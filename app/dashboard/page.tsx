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
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'

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
      
      // Use NGN as the only supported currency for this merchant account
      const currency = determinePaymentCurrency(userData.country)
      // Convert $50 USD to NGN (approximately 1 USD = 1650 NGN)
      const amount = PAYMENT_AMOUNT_USD * 1650
      const formattedAmount = formatAmountForPaystack(amount)

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
                description: 'Your payment has been processed. Redirecting to verification page...',
              })

              // Redirect to waitlist/verification page
              setTimeout(() => {
                router.push('/waitlist')
              }, 1500)
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
      </div>
    )
  }

  const isVerified = userData?.account_status === 'verified'
  const isCompleted = userData?.payment_status === 'completed'
  const isProcessing = userData?.payment_status === 'processing'

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#B8F663] via-[#59E4A0] to-[#00D3D8] flex flex-col">
      <Navbar />

      <main className="flex-1 px-4 md:px-6 py-6 md:py-8 max-w-6xl mx-auto w-full">
        <div className="space-y-4 md:space-y-6">
          {/* Payment Card */}
          {!isVerified && (
            <Card className="border-0 shadow-lg bg-white/95 backdrop-blur">
              <CardHeader className="pb-3 md:pb-4">
                <CardTitle className="text-sm md:text-lg text-[#001f23]">Complete Your Payment</CardTitle>
                <CardDescription className="text-xs md:text-sm text-[#001f23]/70">
                  Click the button below to securely process your payment
                </CardDescription>
                <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-xs md:text-sm text-blue-800">
                    <span className="font-bold">Amount to Pay: $50 USD</span>
                    <br />
                    <span className="text-blue-700">(Processing in NGN - approximately ₦82,500)</span>
                  </p>
                </div>
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

          {/* Verification Pending Message */}
          {isCompleted && !isVerified && (
            <Card className="border-0 shadow-lg bg-green-50">
              <CardHeader className="pb-3 md:pb-4">
                <CardTitle className="text-sm md:text-lg text-green-700">Payment Submitted Successfully!</CardTitle>
              </CardHeader>
              <CardContent className="space-y-1 md:space-y-2">
                <p className="text-xs md:text-sm text-[#001f23]">
                  Your payment has been successfully processed and recorded.
                </p>
                <p className="text-xs md:text-sm text-[#001f23]">
                  Our admin will verify your payment and activate your account. This usually takes 24 hours.
                </p>
                <p className="text-xs md:text-sm text-[#001f23]">
                  You will receive a confirmation email once your account is verified and activated.
                </p>
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
