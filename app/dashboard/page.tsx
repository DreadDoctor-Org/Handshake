'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

interface User {
  id: string
  username: string
  payment_status: string
  transaction_id: string | null
  created_at: string
}

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const loadUser = async () => {
      try {
        const { data: { user: authUser }, error: authError } = await supabase.auth.getUser()
        
        if (authError || !authUser) {
          toast.error('Session Expired', {
            description: 'Please sign in again to continue.',
          })
          router.push('/auth/login')
          return
        }

        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('id', authUser.id)
          .single()

        if (userError) {
          console.error('Error loading user:', userError)
          toast.error('Error', {
            description: 'Failed to load user data.',
          })
          return
        }

        setUser(userData)
      } catch (err) {
        console.error('Error:', err)
        toast.error('Error', {
          description: 'An unexpected error occurred.',
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadUser()
  }, [supabase, router])

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut()
      toast.success('Signed Out', {
        description: 'You have been signed out successfully.',
      })
      router.push('/')
    } catch (err) {
      toast.error('Error', {
        description: 'Failed to sign out.',
      })
    }
  }

  if (isLoading) {
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
        </nav>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-[#001f23] text-lg">Loading...</div>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const isPending = user.payment_status === 'pending'
  const isCompleted = user.payment_status === 'completed'
  const isFailed = user.payment_status === 'failed'

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#B8F663] via-[#59E4A0] to-[#00D3D8] flex flex-col">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-3">
          <img 
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202026-03-06%20at%201.07.27%20AM-diCisn1VGmxmGniWtuT9XA85Ahzqh0.jpeg"
            alt="Handshake"
            className="w-8 h-8 rounded"
          />
          <span className="text-2xl font-bold text-[#001f23]">Handshake</span>
        </Link>
        <Button 
          variant="ghost" 
          onClick={handleSignOut}
          className="text-[#001f23] hover:bg-white/20"
        >
          Sign Out
        </Button>
      </nav>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-2xl space-y-6">
          {/* Welcome Card */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-[#001f23]">Welcome, {user.username}!</CardTitle>
              <CardDescription className="text-[#001f23]/70">
                Manage your account and payment status
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Payment Status Card */}
          <Card className={`border-0 shadow-lg ${
            isCompleted ? 'bg-green-50' : isPending ? 'bg-yellow-50' : 'bg-red-50'
          }`}>
            <CardHeader>
              <CardTitle className="text-[#001f23] flex items-center gap-2">
                <span className={`inline-block w-3 h-3 rounded-full ${
                  isCompleted ? 'bg-green-500' : isPending ? 'bg-yellow-500' : 'bg-red-500'
                }`}></span>
                Payment Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-[#001f23]/70">Status</p>
                  <p className="text-lg font-semibold text-[#001f23] capitalize">
                    {user.payment_status === 'pending' && '⏳ Awaiting Payment'}
                    {user.payment_status === 'completed' && '✓ Payment Confirmed'}
                    {user.payment_status === 'failed' && '✗ Payment Failed'}
                  </p>
                </div>

                {isPending && (
                  <div className="space-y-1">
                    <p className="text-sm text-[#001f23]/70">Transaction ID</p>
                    <p className="text-[#001f23]">
                      {user.transaction_id || 'Not submitted yet'}
                    </p>
                  </div>
                )}

                {isPending && (
                  <div className="p-4 rounded-lg bg-blue-100 text-blue-900 text-sm space-y-3">
                    <p className="font-semibold text-base">Complete These Steps to Enable Your Account:</p>
                    <div className="space-y-2">
                      <div className="flex gap-3">
                        <span className="font-bold bg-blue-300 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">1</span>
                        <span><strong>Copy the Wallet Address</strong> - Scroll down to see your payment address</span>
                      </div>
                      <div className="flex gap-3">
                        <span className="font-bold bg-blue-300 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">2</span>
                        <span><strong>Open Your Crypto Wallet</strong> - Use Binance, Trust Wallet, TronLink, or any crypto exchange</span>
                      </div>
                      <div className="flex gap-3">
                        <span className="font-bold bg-blue-300 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">3</span>
                        <span><strong>Send $50 USDT</strong> - Send exactly $50 to the Tron wallet address below (using USDT on Tron network)</span>
                      </div>
                      <div className="flex gap-3">
                        <span className="font-bold bg-blue-300 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">4</span>
                        <span><strong>Copy Your Transaction ID</strong> - After sending, copy the transaction hash/ID from your wallet</span>
                      </div>
                      <div className="flex gap-3">
                        <span className="font-bold bg-blue-300 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">5</span>
                        <span><strong>Submit Transaction ID</strong> - Click the button below to submit your transaction ID</span>
                      </div>
                      <div className="flex gap-3">
                        <span className="font-bold bg-blue-300 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">6</span>
                        <span><strong>Wait for Admin Verification</strong> - Our admin will verify and activate your account (usually 24 hours)</span>
                      </div>
                    </div>
                  </div>
                )}

                {isCompleted && (
                  <div className="p-4 rounded-lg bg-green-100 text-green-900 text-sm">
                    <p>Your payment has been verified by our admin. Check your email for account activation instructions.</p>
                  </div>
                )}

                {isFailed && (
                  <div className="p-4 rounded-lg bg-red-100 text-red-900 text-sm">
                    <p>Your payment verification failed. Please contact support or try again.</p>
                  </div>
                )}
              </div>

              {isPending && (
                <Button 
                  onClick={() => router.push('/payment/crypto')}
                  className="w-full bg-[#001f23] text-white hover:bg-[#001f23]/90"
                >
                  Submit Payment & Transaction ID
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Crypto Payment Info */}
          {isPending && (
            <Card className="border-0 shadow-lg bg-white/95 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-[#001f23]">₿ Tron Payment Information</CardTitle>
                <CardDescription className="text-[#001f23]/70">
                  Send your payment to the address below
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 rounded-lg bg-[#001f23]/5 border border-[#001f23]/20">
                  <p className="text-sm text-[#001f23]/70 mb-2">Wallet Address (Tron):</p>
                  <p className="text-[#001f23] font-mono font-bold break-all text-lg">
                    TVexA5Ztzc2o4RfSqZUvKhXofz1viT2e6u
                  </p>
                </div>

                <div className="space-y-2 p-3 bg-white rounded border border-[#001f23]/10">
                  <p className="text-sm text-[#001f23]/70"><strong>Amount to Send:</strong></p>
                  <p className="text-2xl font-bold text-[#001f23]">$50 USDT</p>
                  <p className="text-xs text-[#001f23]/60 mt-2">Send on Tron Network (TRC-20)</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Account Info */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-[#001f23]">Account Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-[#001f23]/70">Account ID:</span>
                <span className="text-[#001f23] font-mono">{user.id.slice(0, 12)}...</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#001f23]/70">Username:</span>
                <span className="text-[#001f23]">{user.username}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#001f23]/70">Member Since:</span>
                <span className="text-[#001f23]">{new Date(user.created_at).toLocaleDateString()}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-6 text-[#001f23]/70 text-sm">
        <p>&copy; {new Date().getFullYear()} Handshake. All rights reserved.</p>
      </footer>
    </div>
  )
}
