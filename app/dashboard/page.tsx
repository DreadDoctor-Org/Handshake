'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { PAYSTACK_PUBLIC_KEY, initializePayment, formatAmountForPaystack } from '@/lib/paystack'

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
  account_status: string
  transaction_id: string | null
  country: string | null
}

export default function DashboardPage() {
  const router = useRouter()
  const [userData, setUserData] = useState<UserData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false)
  const [transactionId, setTransactionId] = useState('')
  const [isSubmittingId, setIsSubmittingId] = useState(false)
  const supabase = createClient()

  const PAYMENT_AMOUNT_USD = 50

  useEffect(() => {
    loadUserData()
  }, [])

  const loadUserData = async () => {
    try {
      setIsLoading(true)

      // Get current auth user
      const { data: authData, error: authError } = await supabase.auth.getUser()
      if (authError || !authData.user) throw new Error('Not authenticated')

      // Get user data from database
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', authData.user.id)
        .single()

      if (error) {
        // User doesn't exist - create them
        if (error.code === 'PGRST116') {
          const { error: insertError } = await supabase.from('users').insert([
            {
              id: authData.user.id,
              email: authData.user.email || '',
              full_name: '',
              payment_status: 'pending',
              account_status: 'inactive',
            },
          ])

          if (insertError) throw insertError

          // Fetch the newly created user
          const { data: newData, error: newError } = await supabase
            .from('users')
            .select('*')
            .eq('id', authData.user.id)
            .single()

          if (newError) throw newError
          setUserData(newData)
        } else {
          throw error
        }
      } else {
        setUserData(data)

        // Auto-redirect based on account status
        if (data.account_status === 'active') {
          router.push('/verified')
          return
        }

        if (data.payment_status === 'completed' && data.transaction_id) {
          router.push('/waitlist')
          return
        }
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load user data'
      toast.error('Error', { description: message })
    } finally {
      setIsLoading(false)
    }
  }

  const handlePayment = async () => {
    if (!userData) return

    setIsPaymentProcessing(true)

    try {
      const nameParts = userData.full_name?.split(' ') || ['User', 'Account']
      const firstName = nameParts[0] || 'User'
      const lastName = nameParts.slice(1).join(' ') || 'Account'

      // Initialize Paystack payment
      const response = await initializePayment({
        email: userData.email,
        amount: formatAmountForPaystack(PAYMENT_AMOUNT_USD, 'USD'),
        currency: 'USD',
        firstName,
        lastName,
        userId: userData.id,
      })

      if (!response.status) throw new Error('Failed to initialize payment')

      // Update payment status
      const { error } = await supabase
        .from('users')
        .update({ payment_status: 'completed' })
        .eq('id', userData.id)

      if (error) throw error

      // Show payment window
      if (window.PaystackPop) {
        window.PaystackPop.resumeTransaction(response.data.access_code)
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Payment failed'
      toast.error('Payment Error', { description: message })
    } finally {
      setIsPaymentProcessing(false)
    }
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
        .update({ transaction_id: transactionId.trim() })
        .eq('id', userData.id)

      if (error) throw error

      toast.success('Transaction ID Submitted!', {
        description: 'Redirecting to waitlist...',
      })

      setTimeout(() => {
        router.push('/waitlist')
      }, 1500)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to submit transaction ID'
      toast.error('Error', { description: message })
    } finally {
      setIsSubmittingId(false)
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#B8F663] via-[#59E4A0] to-[#00D3D8] flex items-center justify-center px-4">
        <Card className="w-full max-w-md border-0 shadow-lg">
          <CardContent className="pt-6 text-center">
            <p className="text-[#001f23]">Loading your dashboard...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!userData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#B8F663] via-[#59E4A0] to-[#00D3D8] flex items-center justify-center px-4">
        <Card className="w-full max-w-md border-0 shadow-lg">
          <CardContent className="pt-6">
            <p className="text-[#001f23] text-center mb-4">Unable to load your account</p>
            <Button
              onClick={handleSignOut}
              className="w-full bg-[#001f23] text-white hover:bg-[#001f23]/90"
            >
              Sign Out
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#B8F663] via-[#59E4A0] to-[#00D3D8] flex flex-col">
      {/* Header */}
      <nav className="flex items-center justify-between px-4 md:px-6 py-4 bg-white/20 backdrop-blur">
        <div className="flex items-center gap-3">
          <img
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202026-03-06%20at%201.07.27%20AM-diCisn1VGmxmGniWtuT9XA85Ahzqh0.jpeg"
            alt="Handshake"
            className="w-8 h-8 rounded"
          />
          <h1 className="text-xl font-bold text-[#001f23]">Handshake</h1>
        </div>
        <Button
          onClick={handleSignOut}
          variant="ghost"
          className="text-[#001f23] hover:bg-white/30"
        >
          Sign Out
        </Button>
      </nav>

      {/* Main Content */}
      <main className="flex-1 px-4 md:px-6 py-8 max-w-2xl mx-auto w-full">
        <div className="space-y-6">
          {/* Welcome Card */}
          <Card className="border-0 shadow-lg bg-white/95">
            <CardHeader>
              <CardTitle className="text-[#001f23]">Welcome, {userData.full_name || 'User'}</CardTitle>
              <CardDescription>Complete your payment to access verified Handshake accounts</CardDescription>
            </CardHeader>
          </Card>

          {/* Payment Pending */}
          {userData.payment_status === 'pending' && (
            <Card className="border-0 shadow-lg bg-white/95">
              <CardHeader>
                <CardTitle className="text-lg text-[#001f23]">Complete Payment</CardTitle>
                <CardDescription>Pay $50 USD via Paystack</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-[#001f23]/80 mb-4">
                  To access verified Handshake accounts, please complete your payment of $50 USD. We accept credit cards, debit cards, and bank transfers.
                </p>
                <Button
                  onClick={handlePayment}
                  disabled={isPaymentProcessing}
                  className="w-full bg-[#001f23] text-white hover:bg-[#001f23]/90 py-2 h-10"
                >
                  {isPaymentProcessing ? 'Processing...' : 'Pay $50 USD'}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Transaction ID Submission */}
          {userData.payment_status === 'completed' && !userData.transaction_id && (
            <Card className="border-0 shadow-lg bg-white/95">
              <CardHeader>
                <CardTitle className="text-lg text-[#001f23]">Submit Transaction ID</CardTitle>
                <CardDescription>Confirm your payment by submitting your transaction ID</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-xs text-blue-800">
                    <strong>Where to find your Transaction ID:</strong>
                    <br />
                    Look for the transaction ID in your Paystack payment confirmation email or on the payment completion page.
                  </p>
                </div>
                <div>
                  <label className="text-xs font-medium text-[#001f23]">Transaction ID</label>
                  <Input
                    type="text"
                    placeholder="Paste your transaction ID here"
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    className="mt-2 bg-white border-[#001f23]/20"
                  />
                </div>
                <Button
                  onClick={handleSubmitTransactionId}
                  disabled={!transactionId.trim() || isSubmittingId}
                  className="w-full bg-[#001f23] text-white hover:bg-[#001f23]/90 py-2 h-10"
                >
                  {isSubmittingId ? 'Submitting...' : 'Submit Transaction ID'}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Waiting for Verification */}
          {userData.transaction_id && userData.account_status === 'inactive' && (
            <Card className="border-0 shadow-lg bg-green-50">
              <CardHeader>
                <CardTitle className="text-lg text-green-700">Transaction Submitted</CardTitle>
                <CardDescription>Waiting for admin verification</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm text-[#001f23]">
                  Your transaction ID has been submitted successfully. Our admin team will verify your payment and activate your account.
                </p>
                <p className="text-sm text-[#001f23]/70">
                  This usually takes 1-24 hours. You'll be redirected automatically once verified.
                </p>
                <p className="text-xs text-[#001f23]/60 mt-4">
                  Transaction ID: <span className="font-mono">{userData.transaction_id}</span>
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
