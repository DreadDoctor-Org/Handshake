'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { PAYSTACK_PUBLIC_KEY, initializePayment, formatAmountForPaystack, determinePaymentCurrency } from '@/lib/paystack'

declare global {
  interface Window {
    PaystackPop: any
  }
}

interface UserData {
  id: string
  email: string
  full_name: string | null
  payment_status: string
  paystack_reference: string | null
  account_status: string
  created_at: string
  country?: string
}

export default function DashboardPage() {
  const router = useRouter()
  const [userData, setUserData] = useState<UserData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)
  const [transactionId, setTransactionId] = useState('')
  const [isSubmittingId, setIsSubmittingId] = useState(false)
  const supabase = createClient()

  const PAYMENT_AMOUNT_USD = 50
  const ADMIN_EMAIL = 'handshake.ai@outlook.com'

  useEffect(() => {
    // Load Paystack script
    const script = document.createElement('script')
    script.src = 'https://js.paystack.co/v1/inline.js'
    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  useEffect(() => {
    const loadUserData = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // Get current user
        const { data: authData, error: authError } = await supabase.auth.getUser()

        if (authError || !authData.user) {
          toast.error('Session Expired', {
            description: 'Please sign in again to continue.',
          })
          router.push('/auth/login')
          return
        }

        const userId = authData.user.id

        // Fetch user data from public.users table
        const { data, error: dataError } = await supabase
          .from('users')
          .select('*')
          .eq('id', userId)
          .single()

        if (dataError) {
          // If user doesn't exist in table, create them
          if (dataError.code === 'PGRST116' || dataError.message.includes('No rows')) {
            const userMetadata = authData.user.user_metadata as any
            const fullName = userMetadata?.fullName || authData.user.email?.split('@')[0] || 'user'
            const phoneNumber = userMetadata?.phoneNumber || 'Not provided'
            const country = userMetadata?.country || 'Unknown'
            
            const { error: insertError } = await supabase.from('users').insert([
              {
                id: userId,
                email: authData.user.email || '',
                full_name: fullName,
                phone_number: phoneNumber,
                country: country,
                payment_method: 'paystack',
                payment_status: 'pending',
                account_status: 'inactive',
              },
            ])

            if (insertError) {
              throw insertError
            }

            const { data: newData, error: newError } = await supabase
              .from('users')
              .select('*')
              .eq('id', userId)
              .single()

            if (newError) throw newError
            setUserData(newData)
          } else {
            throw dataError
          }
        } else {
          setUserData(data)
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load user data'
        setError(errorMessage)
        toast.error('Error', {
          description: errorMessage,
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadUserData()
  }, [supabase, router])

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut()
      toast.success('Signed Out', {
        description: 'You have been signed out successfully.',
      })
      router.push('/')
    } catch (err) {
      toast.error('Error signing out')
    }
  }

  const handleInitializePayment = async () => {
    if (!userData) return

    setIsProcessingPayment(true)

    try {
      const nameParts = userData.full_name?.split(' ') || ['User', 'Account']
      const firstName = nameParts[0] || 'User'
      const lastName = nameParts.slice(1).join(' ') || 'Account'
      
      // Use KES as default currency (supported by merchant account)
      const currency = determinePaymentCurrency(userData.country)
      // Convert $50 USD to KES (approximately 1 USD = 130 KES)
      const amount = currency === 'KES' ? PAYMENT_AMOUNT_USD * 130 : PAYMENT_AMOUNT_USD
      const formattedAmount = formatAmountForPaystack(amount, currency)

      const response = await initializePayment({
        email: userData.email,
        amount: formattedAmount,
        currency: currency,
        firstName: firstName,
        lastName: lastName,
        userId: userData.id,
      })

      if (!response.status) {
        throw new Error('Failed to initialize payment')
      }

      // Store the access code for verification later
      const accessCode = response.data.access_code
      const authorizationUrl = response.data.authorization_url

      // Update user with paystack reference
      await supabase
        .from('users')
        .update({
          paystack_reference: accessCode,
          payment_status: 'processing',
        })
        .eq('id', userData.id)

      // Open Paystack payment form
      if (window.PaystackPop) {
        const handler = window.PaystackPop.setup({
          key: PAYSTACK_PUBLIC_KEY,
          email: userData.email,
          amount: formattedAmount,
          currency: currency,
          ref: accessCode,
          firstName: firstName,
          lastName: lastName,
          onClose: () => {
            toast.error('Payment Cancelled', {
              description: 'You have cancelled the payment. Please try again.',
            })
            setIsProcessingPayment(false)
          },
          onSuccess: async (response: any) => {
            try {
              // Update payment status to completed
              const { error } = await supabase
                .from('users')
                .update({
                  payment_status: 'completed',
                  paystack_reference: response.reference || accessCode,
                })
                .eq('id', userData.id)

              if (error) throw error

              // Create payment record
              await supabase.from('payments').insert([
                {
                  user_id: userData.id,
                  payment_method: 'paystack',
                  amount_usd: PAYMENT_AMOUNT_USD,
                  transaction_id: response.reference || accessCode,
                  status: 'completed',
                  currency: currency,
                },
              ])

              toast.success('Payment Successful!', {
                description: 'Your payment has been processed. Waiting for admin verification.',
              })

              // Refresh user data
              const { data: updatedData } = await supabase
                .from('users')
                .select('*')
                .eq('id', userData.id)
                .single()

              if (updatedData) {
                setUserData(updatedData)
              }
            } catch (err) {
              toast.error('Error', {
                description: 'Payment recorded but there was an error updating your account.',
              })
            } finally {
              setIsProcessingPayment(false)
            }
          },
        })
        handler.openIframe()
      } else {
        // Fallback: redirect to authorization URL
        window.location.href = authorizationUrl
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to initialize payment'
      toast.error('Payment Error', {
        description: errorMessage,
      })
      setIsProcessingPayment(false)
    }
  }

  const copyAdminEmail = () => {
    navigator.clipboard.writeText(ADMIN_EMAIL)
    toast.success('Admin email copied!', {
      description: 'Email address copied to clipboard.',
    })
  }

  const handleSubmitTransactionId = async () => {
    if (!transactionId.trim() || !userData) {
      toast.error('Error', { description: 'Please enter a transaction ID' })
      return
    }

    setIsSubmittingId(true)
    try {
      const { error } = await supabase
        .from('users')
        .update({
          transaction_id: transactionId.trim(),
          account_status: 'pending',
        })
        .eq('id', userData.id)

      if (error) throw error

      toast.success('Transaction ID Submitted!', {
        description: 'Redirecting to waitlist dashboard...',
      })

      // Redirect to waitlist after 1.5 seconds
      setTimeout(() => {
        router.push('/waitlist')
      }, 1500)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to submit transaction ID'
      toast.error('Error', { description: errorMessage })
    } finally {
      setIsSubmittingId(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#B8F663] via-[#59E4A0] to-[#00D3D8] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-base md:text-lg text-[#001f23]">Loading your dashboard...</div>
        </div>
      </div>
    )
  }

  if (error || !userData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#B8F663] via-[#59E4A0] to-[#00D3D8] flex flex-col">
        <nav className="flex items-center justify-between px-4 md:px-6 py-3 md:py-4">
          <Link href="/" className="flex items-center gap-2 md:gap-3">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202026-03-06%20at%201.07.27%20AM-diCisn1VGmxmGniWtuT9XA85Ahzqh0.jpeg"
              alt="Handshake"
              className="w-7 md:w-8 h-7 md:h-8 rounded"
            />
            <span className="text-lg md:text-2xl font-bold text-[#001f23]">Handshake</span>
          </Link>
          <Button onClick={handleSignOut} variant="ghost" className="text-xs md:text-sm text-[#001f23]">
            Sign Out
          </Button>
        </nav>

        <main className="flex-1 flex items-center justify-center px-4 py-12">
          <Card className="w-full max-w-md border-0 shadow-lg bg-white/95">
            <CardHeader>
              <CardTitle className="text-lg md:text-2xl text-[#001f23]">Error Loading Dashboard</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 rounded-lg bg-red-100 text-red-700 text-xs md:text-sm">
                {error || 'Unable to load user data. Please try again.'}
              </div>
              <Button onClick={() => window.location.reload()} className="w-full">
                Retry
              </Button>
              <Button onClick={handleSignOut} variant="outline" className="w-full">
                Sign Out
              </Button>
            </CardContent>
          </Card>
        </main>

        <footer className="text-center py-4 md:py-6 text-[#001f23]/70 text-xs md:text-sm">
          <p>&copy; {new Date().getFullYear()} Handshake. All rights reserved.</p>
        </footer>
      </div>
    )
  }

  const isPending = userData.payment_status === 'pending'
  const isProcessing = userData.payment_status === 'processing'
  const isCompleted = userData.payment_status === 'completed'
  const isVerified = userData.payment_status === 'verified' || userData.account_status === 'active'

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#B8F663] via-[#59E4A0] to-[#00D3D8] flex flex-col">
      {/* Navigation Header */}
      <nav className="flex items-center justify-between px-4 md:px-6 py-3 md:py-4">
        <div className="flex items-center gap-2 md:gap-3">
          <img
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202026-03-06%20at%201.07.27%20AM-diCisn1VGmxmGniWtuT9XA85Ahzqh0.jpeg"
            alt="Handshake"
            className="w-7 md:w-8 h-7 md:h-8 rounded"
          />
          <h1 className="text-lg md:text-2xl font-bold text-[#001f23]">Handshake</h1>
        </div>
        <Button onClick={handleSignOut} variant="ghost" className="text-xs md:text-sm text-[#001f23] hover:bg-white/20 px-2 md:px-4">
          Sign Out
        </Button>
      </nav>

      {/* Main Content */}
      <main className="flex-1 px-4 md:px-6 py-6 md:py-8 max-w-6xl mx-auto w-full">
        <div className="space-y-4 md:space-y-6">
          {/* Welcome Card */}
          <Card className="border-0 shadow-lg bg-white/95 backdrop-blur">
            <CardHeader className="pb-3 md:pb-4">
              <CardTitle className="text-lg md:text-2xl text-[#001f23]">Welcome, {userData.full_name || 'User'}!</CardTitle>
              <CardDescription className="text-xs md:text-sm text-[#001f23]/70">
                {isVerified ? 'Your account is verified and active' : 'Complete the international payment to activate your account'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 md:space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
                <div className="p-2 md:p-3 bg-[#001f23]/5 rounded border border-[#001f23]/10">
                  <p className="text-xs text-[#001f23]/70 mb-1">Email</p>
                  <p className="text-xs md:text-sm font-semibold text-[#001f23] break-all">{userData.email}</p>
                </div>
                <div className="p-2 md:p-3 bg-[#001f23]/5 rounded border border-[#001f23]/10">
                  <p className="text-xs text-[#001f23]/70 mb-1">Name</p>
                  <p className="text-xs md:text-sm font-semibold text-[#001f23]">{userData.full_name || 'Not set'}</p>
                </div>
                <div className="p-2 md:p-3 bg-[#001f23]/5 rounded border border-[#001f23]/10">
                  <p className="text-xs text-[#001f23]/70 mb-1">Country</p>
                  <p className="text-xs md:text-sm font-semibold text-[#001f23]">{userData.country || 'Not set'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Status Indicator */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
            <Card className={`border-0 shadow-lg ${isVerified ? 'bg-green-50' : isPending || isProcessing ? 'bg-yellow-50' : 'bg-white/95'}`}>
              <CardHeader className="pb-2 md:pb-3">
                <CardTitle className="text-xs md:text-sm text-[#001f23]">Payment Status</CardTitle>
              </CardHeader>
              <CardContent>
                <p className={`text-base md:text-lg font-bold flex items-center gap-2 ${isVerified ? 'text-green-700' : isPending || isProcessing ? 'text-yellow-700' : 'text-[#001f23]'}`}>
                  {isVerified ? '✓ Verified' : isProcessing ? 'Processing...' : isPending ? 'Awaiting Payment' : isCompleted ? 'Payment Completed' : 'Pending'}
                </p>
              </CardContent>
            </Card>

            {!isVerified && (
              <>
                <Card className="border-0 shadow-lg bg-white/95">
                  <CardHeader className="pb-2 md:pb-3">
                    <CardTitle className="text-xs md:text-sm text-[#001f23]">Amount Required</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-base md:text-lg font-bold text-[#001f23]">${PAYMENT_AMOUNT_USD} USD</p>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg bg-white/95">
                  <CardHeader className="pb-2 md:pb-3">
                    <CardTitle className="text-xs md:text-sm text-[#001f23]">Payment Method</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-base md:text-lg font-bold text-[#001f23]">International Payments</p>
                  </CardContent>
                </Card>
              </>
            )}

            {isVerified && (
              <Card className="border-0 shadow-lg bg-green-50 md:col-span-2">
                <CardHeader className="pb-2 md:pb-3">
                  <CardTitle className="text-xs md:text-sm text-green-700">Account Activated</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs md:text-sm text-green-700">Your account is fully verified and ready to use globally and internationally.</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Payment Instructions */}
          {!isVerified && (
            <Card className="border-0 shadow-lg bg-blue-50">
              <CardHeader className="pb-3 md:pb-4">
                <CardTitle className="text-sm md:text-lg text-[#001f23]">International Payment Processing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 md:space-y-3">
                <div className="space-y-1 md:space-y-2">
                  <div className="flex gap-2 md:gap-3">
                    <span className="font-bold bg-blue-300 rounded-full w-5 md:w-6 h-5 md:h-6 flex items-center justify-center flex-shrink-0 text-xs md:text-sm">1</span>
                    <span className="text-xs md:text-sm text-[#001f23]">
                      <strong>Click "Pay Now" button below</strong> - This will open the secure Paystack payment form
                    </span>
                  </div>
                  <div className="flex gap-2 md:gap-3">
                    <span className="font-bold bg-blue-300 rounded-full w-5 md:w-6 h-5 md:h-6 flex items-center justify-center flex-shrink-0 text-xs md:text-sm">2</span>
                    <span className="text-xs md:text-sm text-[#001f23]">
                      <strong>Select your payment method</strong> - Choose card, mobile money, or bank transfer
                    </span>
                  </div>
                  <div className="flex gap-2 md:gap-3">
                    <span className="font-bold bg-blue-300 rounded-full w-5 md:w-6 h-5 md:h-6 flex items-center justify-center flex-shrink-0 text-xs md:text-sm">4</span>
                    <span className="text-xs md:text-sm text-[#001f23]">
                      <strong>Complete the checkout</strong> - Follow the payment method prompts
                    </span>
                  </div>
                  <div className="flex gap-2 md:gap-3">
                    <span className="font-bold bg-blue-300 rounded-full w-5 md:w-6 h-5 md:h-6 flex items-center justify-center flex-shrink-0 text-xs md:text-sm">5</span>
                    <span className="text-xs md:text-sm text-[#001f23]">
                      <strong>Wait for admin verification</strong> - Your account will be activated after admin confirmation (usually 24 hours)
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Refund Policy */}
          {!isVerified && (
            <Card className="border-0 shadow-lg bg-green-50">
              <CardContent className="pt-4 md:pt-6">
                <div className="flex gap-2 md:gap-3">
                  <span className="text-lg md:text-2xl">✓</span>
                  <div className="space-y-1">
                    <p className="text-xs md:text-sm font-bold text-green-700">IMPORTANT - REFUND POLICY</p>
                    <p className="text-xs md:text-sm text-green-700 leading-relaxed">
                      Payment is fully refundable within 14 days and is fully guaranteed. Your satisfaction is our priority. If you have any issues or concerns, contact our support team.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Payment Button */}
          {!isVerified && (
            <Card className="border-0 shadow-lg bg-white/95">
              <CardHeader className="pb-3 md:pb-4">
                <CardTitle className="text-sm md:text-lg text-[#001f23]">Ready to Activate Your Account?</CardTitle>
                <CardDescription className="text-xs md:text-sm text-[#001f23]/70">
                  Click the button below to securely process your ${PAYMENT_AMOUNT_USD} USD payment
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={handleInitializePayment}
                  disabled={isProcessingPayment || isProcessing}
                  className="w-full bg-[#001f23] text-white hover:bg-[#001f23]/90 text-sm md:text-base py-2 md:py-3"
                  size="lg"
                >
                  {isProcessingPayment ? 'Processing...' : isProcessing ? 'Payment in Progress...' : 'Pay Now - $50 USD'}
                </Button>
                <p className="text-xs md:text-sm text-[#001f23]/70 mt-3 text-center">
                  Your payment information is secure and processed through Paystack, a trusted global payment provider.
                </p>
              </CardContent>
            </Card>
          )}

          {/* Transaction ID Submission Form */}
          {isCompleted && !isVerified && (
            <Card className="border-0 shadow-lg bg-white/95">
              <CardHeader className="pb-3 md:pb-4">
                <CardTitle className="text-sm md:text-lg text-[#001f23]">Submit Your Transaction ID</CardTitle>
                <CardDescription className="text-xs md:text-sm text-[#001f23]/70">
                  Copy the transaction ID from your payment confirmation and paste it below for verification
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 md:space-y-4">
                <div className="p-3 md:p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-xs md:text-sm text-blue-800">
                    <strong>Where to find your Transaction ID:</strong>
                    <br />
                    Look for the transaction ID in your Paystack payment confirmation. It will appear in your confirmation email or on the payment completion page.
                  </p>
                </div>
                <div className="space-y-2">
                  <label htmlFor="transactionId" className="text-xs md:text-sm font-medium text-[#001f23]">
                    Transaction ID
                  </label>
                  <Input
                    id="transactionId"
                    type="text"
                    placeholder="Paste your transaction ID here"
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    className="bg-white border-[#001f23]/20 text-xs md:text-sm"
                  />
                </div>
                <Button
                  onClick={handleSubmitTransactionId}
                  disabled={!transactionId.trim() || isSubmittingId}
                  className="w-full bg-[#001f23] text-white hover:bg-[#001f23]/90 text-sm md:text-base py-2 md:py-3"
                  size="lg"
                >
                  {isSubmittingId ? 'Submitting...' : 'Submit Transaction ID'}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Verified Message */}
          {isVerified && (
            <Card className="border-0 shadow-lg bg-green-50">
              <CardHeader className="pb-3 md:pb-4">
                <CardTitle className="text-sm md:text-lg text-green-700 flex items-center gap-2">
                  <span className="text-lg md:text-2xl">✓</span> Account Verified!
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-1 md:space-y-2">
                <p className="text-xs md:text-sm text-[#001f23]">
                  Congratulations! Your account has been verified and activated.
                </p>
                <p className="text-xs md:text-sm text-[#001f23]">
                  You now have full access to verified handshake accounts ready to task globally and internationally.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#001f23]/10 bg-white/50 backdrop-blur px-4 md:px-6 py-4 md:py-6">
        <div className="max-w-6xl mx-auto space-y-3 md:space-y-4">
          {/* Admin Contact Button */}
          {!isVerified && (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 md:gap-3">
              <p className="text-xs md:text-sm text-[#001f23]">Need help with payment?</p>
              <Button
                onClick={copyAdminEmail}
                variant="outline"
                className="border-[#001f23] text-[#001f23] hover:bg-[#001f23] hover:text-white text-xs md:text-sm px-3 md:px-4 py-1 md:py-2"
              >
                Contact Admin for Support
              </Button>
            </div>
          )}

          {/* Admin Email Display */}
          <div className="text-center py-2 md:py-3 bg-[#001f23]/5 rounded-lg border border-[#001f23]/10">
            <p className="text-xs md:text-sm text-[#001f23]">
              <strong>Admin Email:</strong> {ADMIN_EMAIL}
            </p>
          </div>

          {/* Copyright */}
          <p className="text-center text-xs md:text-sm text-[#001f23]/70">
            &copy; {new Date().getFullYear()} Handshake. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
