'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'

interface UserData {
  id: string
  email: string
  full_name: string | null
  payment_status: string
  transaction_id: string | null
  account_status: string
  created_at: string
}

export default function WaitlistPage() {
  const router = useRouter()
  const supabase = createClient()
  const [userData, setUserData] = useState<UserData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [transactionId, setTransactionId] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadUserData = async () => {
      try {
        setIsLoading(true)
        const { data: authData, error: authError } = await supabase.auth.getUser()

        if (authError || !authData.user) {
          router.push('/auth/login')
          return
        }

        const { data, error: dataError } = await supabase
          .from('users')
          .select('*')
          .eq('id', authData.user.id)
          .single()

        if (dataError) {
          throw new Error('Failed to load user data')
        }

        setUserData(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
        toast.error('Error', { description: 'Failed to load your data' })
      } finally {
        setIsLoading(false)
      }
    }

    loadUserData()
  }, [router, supabase])

  const handleSubmitTransaction = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!transactionId.trim()) {
      toast.error('Required Field', {
        description: 'Please enter your transaction ID',
      })
      return
    }

    if (!userData) {
      toast.error('Error', {
        description: 'User data not found',
      })
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      // Update user record with transaction ID
      const { error: updateError } = await supabase
        .from('users')
        .update({
          transaction_id: transactionId.trim(),
          payment_status: 'submitted',
        })
        .eq('id', userData.id)

      if (updateError) {
        throw updateError
      }

      // Update local state
      setUserData({
        ...userData,
        transaction_id: transactionId.trim(),
        payment_status: 'submitted',
      })

      toast.success('Transaction Submitted!', {
        description: 'Your transaction ID has been recorded. Our admin team will verify it shortly.',
      })

      // Clear form
      setTransactionId('')
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to submit transaction'
      setError(errorMsg)
      toast.error('Submission Failed', {
        description: errorMsg,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const copyTransactionId = () => {
    if (userData?.transaction_id) {
      navigator.clipboard.writeText(userData.transaction_id)
      toast.success('Copied!', {
        description: 'Transaction ID copied to clipboard',
      })
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#B8F663] via-[#59E4A0] to-[#00D3D8] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/20 mb-4">
            <div className="w-8 h-8 border-4 border-[#001f23]/20 border-t-[#001f23] rounded-full animate-spin"></div>
          </div>
          <p className="text-[#001f23] font-medium">Loading your account...</p>
        </div>
      </div>
    )
  }

  if (!userData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#B8F663] via-[#59E4A0] to-[#00D3D8] flex items-center justify-center">
        <Card className="border-0 shadow-lg bg-white/95 max-w-md w-full mx-4">
          <CardContent className="pt-6 text-center">
            <p className="text-[#001f23] mb-4">Unable to load your account information.</p>
            <Button onClick={() => router.push('/auth/login')} className="bg-[#001f23] text-white">
              Return to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const nameParts = (userData.full_name || 'User').split(' ')
  const firstName = nameParts[0]

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#B8F663] via-[#59E4A0] to-[#00D3D8]">
      <Navbar />

      <main className="flex-1 px-4 md:px-6 py-6 md:py-8 max-w-4xl mx-auto w-full">
        <div className="space-y-6">
          {/* Header Section */}
          <div className="text-center space-y-3">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <div className="absolute inset-0 bg-[#59E4A0] rounded-full blur-xl opacity-20 animate-pulse"></div>
                <div className="relative bg-white rounded-full p-4 shadow-lg">
                  <svg className="w-10 md:w-12 h-10 md:h-12 text-[#001f23]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-[#001f23]">Verification in Progress</h1>
            <p className="text-sm md:text-base text-[#001f23]/70 max-w-2xl mx-auto">
              Thank you, {firstName}! Your payment has been received. We're on the waitlist to verify your transaction and activate your account.
            </p>
          </div>

          {/* Status Card */}
          <Card className="border-0 shadow-lg bg-white/95 backdrop-blur">
            <CardHeader className="pb-3 md:pb-4">
              <CardTitle className="flex items-center gap-2 text-[#001f23]">
                <span className="text-2xl">⏳</span>
                Verification Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
                {/* Step 1 */}
                <div className="flex gap-3">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-green-100">
                      <svg className="h-5 w-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-[#001f23]">Payment Received</p>
                    <p className="text-xs text-[#001f23]/60">Your transaction is secure</p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex gap-3">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-100 animate-pulse">
                      <svg className="h-5 w-5 text-blue-600 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-[#001f23]">In Verification</p>
                    <p className="text-xs text-[#001f23]/60">Admin team reviewing</p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex gap-3">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-gray-100">
                      <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-[#001f23]">Account Active</p>
                    <p className="text-xs text-[#001f23]/60">Coming soon</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Transaction ID Form */}
          {!userData.transaction_id && (
            <Card className="border-0 shadow-lg bg-white/95 backdrop-blur">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-[#001f23]">
                  <span className="text-2xl">📝</span>
                  Submit Your Transaction ID
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800 font-medium">How to find your Transaction ID:</p>
                  <ul className="text-xs text-blue-700 space-y-1 mt-2 ml-2">
                    <li>✓ Check your payment confirmation email</li>
                    <li>✓ Look in your payment provider's transaction history</li>
                    <li>✓ It may be labeled as "Reference ID" or "Transaction Hash"</li>
                  </ul>
                </div>

                <form onSubmit={handleSubmitTransaction} className="space-y-3">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[#001f23]">Transaction ID / Reference Code</label>
                    <Input
                      value={transactionId}
                      onChange={(e) => setTransactionId(e.target.value)}
                      placeholder="e.g., TXN123456789 or 0x1a2b3c..."
                      className="bg-[#001f23]/5 border-[#001f23]/20 text-[#001f23]"
                    />
                    <p className="text-xs text-[#001f23]/60">
                      This helps us verify your payment and activate your account faster
                    </p>
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting || !transactionId.trim()}
                    className="w-full bg-[#001f23] text-white hover:bg-[#001f23]/90 text-sm md:text-base"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Transaction ID'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Transaction Submitted */}
          {userData.transaction_id && (
            <Card className="border-0 shadow-lg bg-green-50">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-green-700">
                  <span className="text-2xl">✓</span>
                  Transaction ID Submitted
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="bg-white rounded-lg p-4 border border-green-200">
                  <p className="text-xs text-[#001f23]/70 mb-1">Your Transaction ID:</p>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 text-sm font-mono text-[#001f23] bg-[#001f23]/5 p-2 rounded break-all">
                      {userData.transaction_id}
                    </code>
                    <Button
                      type="button"
                      size="sm"
                      onClick={copyTransactionId}
                      className="bg-[#001f23] text-white hover:bg-[#001f23]/90 flex-shrink-0"
                    >
                      Copy
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-green-700">
                  Thank you for submitting your transaction ID. Our admin team is reviewing your payment and will verify your account shortly.
                </p>
              </CardContent>
            </Card>
          )}

          {/* Timeline Card */}
          <Card className="border-0 shadow-lg bg-white/95 backdrop-blur">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-[#001f23]">
                <span className="text-2xl">📋</span>
                What Happens Next
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { time: '1-2 hours', text: 'Initial payment verification' },
                  { time: '2-12 hours', text: 'Admin team reviews transaction ID' },
                  { time: '12-24 hours', text: 'Account verification complete' },
                  { time: '24+ hours', text: 'Account fully activated & ready to use' },
                ].map((item, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="h-8 w-8 rounded-full bg-[#59E4A0] flex items-center justify-center text-white text-sm font-semibold">
                        {index + 1}
                      </div>
                      {index < 3 && <div className="h-8 w-0.5 bg-[#59E4A0]/30 mt-2"></div>}
                    </div>
                    <div className="pb-4">
                      <p className="font-semibold text-[#001f23] text-sm">{item.time}</p>
                      <p className="text-xs text-[#001f23]/70">{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Trust & Support Card */}
          <Card className="border-0 shadow-lg bg-gradient-to-r from-[#B8F663]/20 to-[#59E4A0]/20">
            <CardContent className="pt-6 space-y-3">
              <div className="flex items-start gap-3">
                <span className="text-2xl">🔒</span>
                <div className="flex-1">
                  <p className="font-semibold text-[#001f23] text-sm">Your data is secure</p>
                  <p className="text-xs text-[#001f23]/70">End-to-end encrypted with industry-standard security</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">💰</span>
                <div className="flex-1">
                  <p className="font-semibold text-[#001f23] text-sm">Full refund guarantee</p>
                  <p className="text-xs text-[#001f23]/70">14-day money-back guarantee, no questions asked</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">📧</span>
                <div className="flex-1">
                  <p className="font-semibold text-[#001f23] text-sm">Need help?</p>
                  <p className="text-xs text-[#001f23]/70">Contact our support team at handshake.ai@outlook.com</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Motivational Message */}
          <div className="bg-white/95 backdrop-blur rounded-lg p-4 md:p-6 border border-[#001f23]/10 text-center">
            <p className="text-[#001f23] text-sm md:text-base leading-relaxed">
              You're almost there! Once verified, you'll gain instant access to our global network of annotation and task opportunities. 
              We're committed to making your onboarding smooth and secure.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
