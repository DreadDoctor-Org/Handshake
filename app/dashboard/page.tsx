'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

declare global {
  interface Window {
    PaystackPop: any
  }
}

interface UserData {
  id: string
  email: string
  full_name: string
  payment_status: 'pending' | 'completed' | 'verified'
  account_status: 'inactive' | 'active'
  transaction_id: string | null
}

export default function DashboardPage() {
  const router = useRouter()
  const supabase = createClient()

  const [userData, setUserData] = useState<UserData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [transactionId, setTransactionId] = useState('')
  const [isSubmittingTx, setIsSubmittingTx] = useState(false)

  useEffect(() => {
    const init = async () => {
      await loadUserData()
    }
    init()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function loadUserData() {
    try {
      setIsLoading(true)
      const { data: { user }, error: authError } = await supabase.auth.getUser()

      if (authError || !user) {
        router.push('/auth/login')
        return
      }

      const { data, error: dataError } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single()

      if (dataError) {
        if (dataError.code === 'PGRST116') {
          // User doesn't exist - create them
          const { error: insertError } = await supabase.from('users').insert({
            id: user.id,
            email: user.email,
            full_name: user.user_metadata?.fullName || '',
            phone_number: user.user_metadata?.phoneNumber || '',
            country: user.user_metadata?.country || '',
            payment_status: 'pending',
            account_status: 'inactive',
          })

          if (insertError) throw insertError

          const { data: newData } = await supabase
            .from('users')
            .select('*')
            .eq('id', user.id)
            .single()

          if (newData) setUserData(newData)
        } else {
          throw dataError
        }
      } else {
        setUserData(data)
        if (data.account_status === 'active') {
          router.push('/verified')
          return
        }
        if (data.payment_status === 'completed' && data.transaction_id) {
          router.push('/waitlist')
          return
        }
      }

      setIsLoading(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load dashboard')
      setIsLoading(false)
    }
  }

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  async function handlePayment() {
    if (!userData || !window.PaystackPop) {
      toast.error('Payment system not ready')
      return
    }

    try {
      const handler = window.PaystackPop.setup({
        key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || '',
        email: userData.email,
        amount: 5000 * 100, // $50 USD in cents
        currency: 'USD',
        ref: `handshake-${userData.id}-${Date.now()}`,
        onClose: function () {
          toast.info('Payment window closed.')
        },
        onSuccess: async function (response: any) {
          // Update payment status to completed
          const { error } = await supabase
            .from('users')
            .update({ payment_status: 'completed' })
            .eq('id', userData.id)

          if (error) throw error
          toast.success('Payment successful! Please submit your transaction ID.')
          setUserData({ ...userData, payment_status: 'completed' })
        },
      })
      handler.openIframe()
    } catch (err) {
      toast.error('Payment error', {
        description: err instanceof Error ? err.message : 'Failed to process payment',
      })
    }
  }

  async function handleSubmitTransaction(e: React.FormEvent) {
    e.preventDefault()
    if (!transactionId.trim() || !userData) return

    setIsSubmittingTx(true)
    try {
      const { error } = await supabase
        .from('users')
        .update({ transaction_id: transactionId.trim() })
        .eq('id', userData.id)

      if (error) throw error
      toast.success('Transaction ID submitted!')
      router.push('/waitlist')
    } catch (err) {
      toast.error('Error', {
        description: err instanceof Error ? err.message : 'Failed to submit',
      })
    } finally {
      setIsSubmittingTx(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#B8F663] via-[#59E4A0] to-[#00D3D8] flex items-center justify-center">
        <p className="text-white">Loading...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#B8F663] via-[#59E4A0] to-[#00D3D8] flex flex-col items-center justify-center gap-4 px-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-red-600">Error</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm">{error}</p>
            <Button onClick={() => window.location.reload()} className="w-full">
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!userData) return null

  const isPending = userData.payment_status === 'pending'
  const isCompleted = userData.payment_status === 'completed'

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#B8F663] via-[#59E4A0] to-[#00D3D8] flex flex-col">
      <header className="border-b bg-white/10 backdrop-blur px-4 md:px-6 py-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-[#001f23]">Dashboard</h1>
          <Button onClick={handleSignOut} variant="ghost">
            Sign Out
          </Button>
        </div>
      </header>

      <main className="flex-1 px-4 md:px-6 py-8 max-w-2xl mx-auto w-full">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Welcome, {userData.full_name}</CardTitle>
            <CardDescription>{userData.email}</CardDescription>
          </CardHeader>
        </Card>

        {isPending && (
          <Card>
            <CardHeader>
              <CardTitle>Complete Payment</CardTitle>
              <CardDescription>Pay $50 USD via Paystack</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                onClick={handlePayment}
                className="w-full bg-[#001f23] hover:bg-[#001f23]/90 h-10"
              >
                Pay Now
              </Button>
            </CardContent>
          </Card>
        )}

        {isCompleted && !userData.transaction_id && (
          <Card>
            <CardHeader>
              <CardTitle>Submit Transaction ID</CardTitle>
              <CardDescription>
                Find your transaction ID in the Paystack confirmation email
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitTransaction} className="space-y-4">
                <Input
                  placeholder="Enter transaction ID"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                />
                <Button
                  type="submit"
                  disabled={isSubmittingTx || !transactionId.trim()}
                  className="w-full bg-[#001f23] hover:bg-[#001f23]/90"
                >
                  {isSubmittingTx ? 'Submitting...' : 'Submit'}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {userData.transaction_id && (
          <Card className="bg-green-50">
            <CardContent className="pt-6">
              <p className="text-sm text-green-700">
                Transaction submitted! Redirecting to waitlist...
              </p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
