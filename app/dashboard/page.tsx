'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

interface UserData {
  id: string
  email: string
  username: string
  full_name: string | null
  payment_status: string
  transaction_id: string | null
  account_status: string
  created_at: string
  country?: string
}

export default function DashboardPage() {
  const router = useRouter()
  const [userData, setUserData] = useState<UserData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [transactionId, setTransactionId] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const supabase = createClient()

  const TRON_WALLET = 'TVexA5Ztzc2o4RfSqZUvKhXofz1viT2e6u'
  const PAYMENT_AMOUNT = '50.00'

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
            // Get username and country from user metadata (set during registration)
            const userMetadata = authData.user.user_metadata as any
            const username = userMetadata?.username || authData.user.email?.split('@')[0] || 'user'
            const country = userMetadata?.country || 'Unknown'
            
            const { error: insertError } = await supabase.from('users').insert([
              {
                id: userId,
                email: authData.user.email || '',
                username: username,
                country: country,
                payment_method: 'crypto',
                payment_status: 'pending',
                account_status: 'inactive',
              },
            ])

            if (insertError) {
              throw insertError
            }

            // Fetch again after creating
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

  const handleSubmitTransaction = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!transactionId.trim()) {
      toast.error('Validation Error', {
        description: 'Please enter a transaction ID.',
      })
      return
    }

    if (!userData) {
      toast.error('Error', {
        description: 'User data not loaded.',
      })
      return
    }

    try {
      setIsSubmitting(true)

      // Update user with transaction ID
      const { error: updateError } = await supabase
        .from('users')
        .update({
          transaction_id: transactionId,
          payment_status: 'completed',
        })
        .eq('id', userData.id)

      if (updateError) {
        throw updateError
      }

      // Create payment record
      const { error: paymentError } = await supabase.from('payments').insert([
        {
          user_id: userData.id,
          payment_method: 'crypto',
          amount_usd: parseFloat(PAYMENT_AMOUNT),
          transaction_id: transactionId,
          status: 'pending',
        },
      ])

      if (paymentError) {
        console.log('Payment record error:', paymentError)
        // Don't fail if payment record creation fails
      }

      // Update local state
      setUserData({
        ...userData,
        transaction_id: transactionId,
        payment_status: 'completed',
      })

      toast.success('Transaction Submitted!', {
        description: 'Your transaction ID has been recorded. Waiting for admin verification.',
      })

      setTransactionId('')
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to submit transaction'
      toast.error('Error', {
        description: errorMessage,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#B8F663] via-[#59E4A0] to-[#00D3D8] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-lg text-[#001f23]">Loading your dashboard...</div>
        </div>
      </div>
    )
  }

  if (error || !userData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#B8F663] via-[#59E4A0] to-[#00D3D8] flex flex-col">
        <nav className="flex items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-3">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202026-03-06%20at%201.07.27%20AM-diCisn1VGmxmGniWtuT9XA85Ahzqh0.jpeg"
              alt="Handshake"
              className="w-8 h-8 rounded"
            />
            <span className="text-2xl font-bold text-[#001f23]">Handshake</span>
          </Link>
          <Button onClick={handleSignOut} variant="ghost" className="text-[#001f23]">
            Sign Out
          </Button>
        </nav>

        <main className="flex-1 flex items-center justify-center px-4 py-12">
          <Card className="w-full max-w-md border-0 shadow-lg bg-white/95">
            <CardHeader>
              <CardTitle className="text-[#001f23]">Error Loading Dashboard</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 rounded-lg bg-red-100 text-red-700 text-sm">
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

        <footer className="text-center py-6 text-[#001f23]/70 text-sm">
          <p>&copy; {new Date().getFullYear()} Handshake. All rights reserved.</p>
        </footer>
      </div>
    )
  }

  const isPending = userData.payment_status === 'pending' && !userData.transaction_id
  const isCompleted = userData.payment_status === 'completed'
  const isVerified = userData.payment_status === 'verified' || userData.account_status === 'active'
  const ADMIN_EMAIL = 'handshake.ai@outlook.com'

  const copyAdminEmail = () => {
    navigator.clipboard.writeText(ADMIN_EMAIL)
    toast.success('Admin email copied!', {
      description: 'Email address copied to clipboard.',
    })
  }

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
              <CardTitle className="text-lg md:text-2xl text-[#001f23]">Welcome back, {userData.username}!</CardTitle>
              <CardDescription className="text-xs md:text-sm text-[#001f23]/70">
                {isVerified ? 'Your account is verified and active' : 'Complete the payment process to activate your account'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 md:space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
                <div className="p-2 md:p-3 bg-[#001f23]/5 rounded border border-[#001f23]/10">
                  <p className="text-xs text-[#001f23]/70 mb-1">Email</p>
                  <p className="text-xs md:text-sm font-semibold text-[#001f23] break-all">{userData.email}</p>
                </div>
                <div className="p-2 md:p-3 bg-[#001f23]/5 rounded border border-[#001f23]/10">
                  <p className="text-xs text-[#001f23]/70 mb-1">Username</p>
                  <p className="text-xs md:text-sm font-semibold text-[#001f23]">{userData.username}</p>
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
            <Card className={`border-0 shadow-lg ${isVerified ? 'bg-green-50' : isPending ? 'bg-yellow-50' : 'bg-white/95'}`}>
              <CardHeader className="pb-2 md:pb-3">
                <CardTitle className="text-xs md:text-sm text-[#001f23]">Account Status</CardTitle>
              </CardHeader>
              <CardContent>
                <p className={`text-base md:text-lg font-bold flex items-center gap-2 ${isVerified ? 'text-green-700' : isPending ? 'text-yellow-700' : 'text-[#001f23]'}`}>
                  {isVerified ? '✓ Verified' : isPending ? 'Awaiting Payment' : isCompleted ? 'Payment Submitted' : 'Payment Failed'}
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
                    <p className="text-base md:text-lg font-bold text-[#001f23]">${PAYMENT_AMOUNT} USDT</p>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg bg-white/95">
                  <CardHeader className="pb-2 md:pb-3">
                    <CardTitle className="text-xs md:text-sm text-[#001f23]">Network</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-base md:text-lg font-bold text-[#001f23]">Tron (TRC-20)</p>
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
                  <p className="text-xs md:text-sm text-green-700">Your account is fully verified and ready to use.</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Payment Instructions */}
          {!isVerified && isPending && (
            <Card className="border-0 shadow-lg bg-blue-50">
              <CardHeader className="pb-3 md:pb-4">
                <CardTitle className="text-sm md:text-lg text-[#001f23]">Complete These Steps to Enable Your Account</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 md:space-y-3">
                <div className="space-y-1 md:space-y-2">
                  <div className="flex gap-2 md:gap-3">
                    <span className="font-bold bg-blue-300 rounded-full w-5 md:w-6 h-5 md:h-6 flex items-center justify-center flex-shrink-0 text-xs md:text-sm">1</span>
                    <span className="text-xs md:text-sm text-[#001f23]">
                      <strong>Copy the Wallet Address</strong> - Scroll down to see your payment address
                    </span>
                  </div>
                  <div className="flex gap-2 md:gap-3">
                    <span className="font-bold bg-blue-300 rounded-full w-5 md:w-6 h-5 md:h-6 flex items-center justify-center flex-shrink-0 text-xs md:text-sm">2</span>
                    <span className="text-xs md:text-sm text-[#001f23]">
                      <strong>Open Your Crypto Wallet</strong> - Use Binance, Trust Wallet, TronLink, or any crypto exchange
                    </span>
                  </div>
                  <div className="flex gap-2 md:gap-3">
                    <span className="font-bold bg-blue-300 rounded-full w-5 md:w-6 h-5 md:h-6 flex items-center justify-center flex-shrink-0 text-xs md:text-sm">3</span>
                    <span className="text-xs md:text-sm text-[#001f23]">
                      <strong>Send $50 USDT</strong> - Send exactly $50 to the Tron wallet address below (using USDT on Tron network)
                    </span>
                  </div>
                  <div className="flex gap-2 md:gap-3">
                    <span className="font-bold bg-blue-300 rounded-full w-5 md:w-6 h-5 md:h-6 flex items-center justify-center flex-shrink-0 text-xs md:text-sm">4</span>
                    <span className="text-xs md:text-sm text-[#001f23]">
                      <strong>Copy Your Transaction ID</strong> - After sending, copy the transaction hash/ID from your wallet
                    </span>
                  </div>
                  <div className="flex gap-2 md:gap-3">
                    <span className="font-bold bg-blue-300 rounded-full w-5 md:w-6 h-5 md:h-6 flex items-center justify-center flex-shrink-0 text-xs md:text-sm">5</span>
                    <span className="text-xs md:text-sm text-[#001f23]">
                      <strong>Submit Transaction ID</strong> - Click the button below to submit your transaction ID
                    </span>
                  </div>
                  <div className="flex gap-2 md:gap-3">
                    <span className="font-bold bg-blue-300 rounded-full w-5 md:w-6 h-5 md:h-6 flex items-center justify-center flex-shrink-0 text-xs md:text-sm">6</span>
                    <span className="text-xs md:text-sm text-[#001f23]">
                      <strong>Wait for Admin Verification</strong> - Our admin will verify and activate your account (usually 24 hours)
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Wallet Address Card */}
          {!isVerified && (
          <Card className="border-0 shadow-lg bg-white/95">
            <CardHeader className="pb-3 md:pb-4">
              <CardTitle className="text-sm md:text-lg text-[#001f23]">₿ Send Your Payment Here</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 md:space-y-4">
              <div className="space-y-2">
                <label className="text-xs md:text-sm font-medium text-[#001f23]">Tron Wallet Address</label>
                <div className="flex flex-col sm:flex-row items-center gap-2">
                  <Input
                    value={TRON_WALLET}
                    readOnly
                    className="font-mono text-xs bg-[#001f23]/5 border-[#001f23]/20 w-full"
                  />
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => {
                      navigator.clipboard.writeText(TRON_WALLET)
                      toast.success('Copied!', {
                        description: 'Wallet address copied to clipboard.',
                      })
                    }}
                    className="bg-[#001f23] text-white hover:bg-[#001f23]/90 flex-shrink-0 w-full sm:w-auto text-xs md:text-sm"
                  >
                    Copy
                  </Button>
                </div>
              </div>

              <div className="p-2 md:p-3 bg-[#001f23]/5 rounded border border-[#001f23]/10">
                <p className="text-xs md:text-sm text-[#001f23]">
                  <strong>Important:</strong> Only send USDT on the Tron network (TRC-20). Do not send other tokens or use other networks.
                </p>
              </div>
            </CardContent>
          </Card>
          )}

          {/* Transaction ID Submission */}
          {!isVerified && isPending && (
            <Card className="border-0 shadow-lg bg-white/95">
              <CardHeader className="pb-3 md:pb-4">
                <CardTitle className="text-sm md:text-lg text-[#001f23]">Submit Transaction ID</CardTitle>
                <CardDescription className="text-xs md:text-sm text-[#001f23]/70">After sending payment, paste your transaction ID here</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmitTransaction} className="space-y-3 md:space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="transactionId" className="text-xs md:text-sm font-medium text-[#001f23]">
                      Transaction ID (Hash)
                    </label>
                    <Input
                      id="transactionId"
                      placeholder="Paste your Tron transaction hash here..."
                      value={transactionId}
                      onChange={(e) => setTransactionId(e.target.value)}
                      disabled={isSubmitting}
                      className="font-mono text-xs bg-[#001f23]/5 border-[#001f23]/20"
                    />
                    <p className="text-xs text-[#001f23]/70">
                      Find this in your wallet's transaction history. It looks like: 0x1a2b3c4d...
                    </p>
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting || !transactionId.trim()}
                    className="w-full bg-[#001f23] text-white hover:bg-[#001f23]/90 text-xs md:text-sm"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Transaction ID'}
                  </Button>
                </form>
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
                  Your transaction ID has been recorded: <strong>{userData.transaction_id}</strong>
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
              <p className="text-xs md:text-sm text-[#001f23]">Need help with verification?</p>
              <Button
                onClick={copyAdminEmail}
                variant="outline"
                className="border-[#001f23] text-[#001f23] hover:bg-[#001f23] hover:text-white text-xs md:text-sm px-3 md:px-4 py-1 md:py-2"
              >
                Contact Admin to Get Verified Account
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
