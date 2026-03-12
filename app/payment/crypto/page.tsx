'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { cryptoPaymentSchema, type CryptoPaymentSchema } from '@/lib/schemas/payment'
import { toast } from 'sonner'

const TRON_WALLET = 'TVexA5Ztzc2o4RfSqZUvKhXofz1viT2e6u'
const PAYMENT_AMOUNT = '50.00'

export default function CryptoPaymentPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [isAuthed, setIsAuthed] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user }, error } = await supabase.auth.getUser()
      if (error || !user) {
        toast.error('Session Required', {
          description: 'Please sign in to complete payment.',
        })
        router.push('/auth/login')
      } else {
        setIsAuthed(true)
      }
    }
    checkAuth()
  }, [supabase, router])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CryptoPaymentSchema>({
    resolver: zodResolver(cryptoPaymentSchema),
  })

  const onSubmit = async (data: CryptoPaymentSchema) => {
    setIsLoading(true)
    setError(null)

    try {
      // Get current user
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()

      if (userError || !user) {
        setError('Please log in to continue')
        router.push('/auth/register')
        return
      }

      // Update user payment information
      const { error: updateError } = await supabase
        .from('users')
        .update({
          payment_method: 'crypto',
          transaction_id: data.transactionId,
          payment_status: 'pending',
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id)

      if (updateError) {
        setError('Failed to save payment information. Please try again.')
        toast.error('Error', {
          description: 'Failed to save payment information.',
        })
        return
      }

      // Create payment record
      const { error: paymentError } = await supabase
        .from('payments')
        .insert([
          {
            user_id: user.id,
            payment_method: 'crypto',
            amount_usd: parseFloat(PAYMENT_AMOUNT),
            transaction_id: data.transactionId,
            status: 'pending',
          },
        ])

      if (paymentError) {
        console.error('Error creating payment record:', paymentError)
      }

      setSuccess(true)
      toast.success('Payment Submitted!', {
        description: 'Transaction ID recorded. Waiting for admin verification.',
      })
      // Redirect to dashboard after a short delay
      setTimeout(() => {
        router.push('/dashboard')
      }, 1500)
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'An error occurred while processing your payment'
      setError(errorMsg)
      toast.error('Error', {
        description: errorMsg,
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (!isAuthed) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#B8F663] via-[#59E4A0] to-[#00D3D8] flex flex-col items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-lg text-[#001f23]">Checking authentication...</div>
        </div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#B8F663] via-[#59E4A0] to-[#00D3D8] flex flex-col items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-6xl">✓</div>
          <h2 className="text-2xl font-bold text-[#001f23]">Payment Submitted!</h2>
          <p className="text-[#001f23]/70">Redirecting to your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#B8F663] via-[#59E4A0] to-[#00D3D8] flex flex-col">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-4">
        <Link href="/dashboard" className="flex items-center gap-3">
          <img
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202026-03-06%20at%201.07.27%20AM-diCisn1VGmxmGniWtuT9XA85Ahzqh0.jpeg"
            alt="Handshake"
            className="w-8 h-8 rounded"
          />
          <span className="text-2xl font-bold text-[#001f23]">Handshake</span>
        </Link>
      </nav>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-2xl space-y-6">
          {/* Payment Details */}
          <Card className="border-0 shadow-lg bg-white/95 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-[#001f23]">₿ Tron Payment</CardTitle>
              <CardDescription className="text-[#001f23]/70">Send payment to complete your registration</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <p className="text-sm text-[#001f23]/70">Amount</p>
                  <p className="text-2xl font-bold text-[#001f23]">${PAYMENT_AMOUNT}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-[#001f23]/70">Method</p>
                  <p className="text-lg font-semibold text-[#001f23]">USDT</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-[#001f23]/70">Network</p>
                  <p className="text-lg font-semibold text-[#001f23]">Tron</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Wallet Address Card */}
          <Card className="border-0 shadow-lg bg-white/95 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-[#001f23]">Send Payment To</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Wallet Address Display */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#001f23]">Tron Wallet Address</label>
                <div className="flex items-center gap-2">
                  <Input
                    value={TRON_WALLET}
                    readOnly
                    className="font-mono text-xs bg-[#001f23]/5 border-[#001f23]/20"
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
                    className="bg-[#001f23] text-white hover:bg-[#001f23]/90"
                  >
                    Copy
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Transaction Form */}
          <Card className="border-0 shadow-lg bg-white/95 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-[#001f23]">Verify Payment</CardTitle>
              <CardDescription className="text-[#001f23]/70">Enter your transaction ID after sending payment</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {error && (
                  <div className="p-3 rounded-lg bg-red-100 text-red-700 text-sm">
                    {error}
                  </div>
                )}

                {/* Transaction ID Field */}
                <div className="space-y-2">
                  <label htmlFor="transactionId" className="text-sm font-medium text-[#001f23]">
                    Transaction ID (Hash)
                  </label>
                  <Input
                    id="transactionId"
                    placeholder="Paste your Tron transaction hash here..."
                    disabled={isLoading}
                    {...register('transactionId')}
                    className="font-mono text-sm bg-[#001f23]/5 border-[#001f23]/20"
                  />
                  {errors.transactionId && (
                    <p className="text-xs text-red-600">{errors.transactionId.message}</p>
                  )}
                  <p className="text-xs text-[#001f23]/70">
                    Copy from your wallet's transaction history
                  </p>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#001f23] text-white hover:bg-[#001f23]/90"
                  size="lg"
                >
                  {isLoading ? 'Processing...' : 'Submit Transaction ID'}
                </Button>

                {/* Back Link */}
                <Link href="/dashboard">
                  <Button type="button" variant="outline" className="w-full border-[#001f23] text-[#001f23] hover:bg-white/50">
                    Back to Dashboard
                  </Button>
                </Link>
              </form>
            </CardContent>
          </Card>

          {/* Instructions */}
          <Card className="border-0 shadow-lg bg-blue-50">
            <CardHeader>
              <CardTitle className="text-base text-[#001f23]">How to Complete Payment</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-2 text-sm text-[#001f23]">
                <li className="flex gap-3">
                  <span className="font-bold">1.</span>
                  <span>Copy the wallet address above</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold">2.</span>
                  <span>Open your Tron wallet (TronLink, Trust Wallet, etc.)</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold">3.</span>
                  <span>Send ${PAYMENT_AMOUNT} USDT to the wallet address</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold">4.</span>
                  <span>Copy the transaction ID from your wallet</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold">5.</span>
                  <span>Paste it in the field above and click Submit</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold">6.</span>
                  <span>Wait for admin verification (24 hours)</span>
                </li>
              </ol>
              <li className="flex gap-3">
                <span className="font-bold">6.</span>
                <span>NOTE: 30-DAY MONEY BACK, GUARANTEED</span>
              </li>
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
