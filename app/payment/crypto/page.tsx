'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { cryptoPaymentSchema, type CryptoPaymentSchema } from '@/lib/schemas/payment'

const TRON_WALLET = 'TVexA5Ztzc2o4RfSqZUvKhXofz1viT2e6u'
const PAYMENT_AMOUNT = '99.99'

export default function CryptoPaymentPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const supabase = createClient()

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
            crypto_tx_hash: data.transactionId,
            status: 'pending',
          },
        ])

      if (paymentError) {
        console.error('Error creating payment record:', paymentError)
      }

      setSuccess(true)
      // Redirect to confirmation after a short delay
      setTimeout(() => {
        router.push('/payment/confirmation')
      }, 1500)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while processing your payment')
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted flex flex-col items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-6xl">✓</div>
          <h2 className="text-2xl font-bold">Payment Submitted!</h2>
          <p className="text-muted-foreground">Redirecting to confirmation page...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted flex flex-col">
      {/* Navigation */}
      <nav className="border-b border-border/40 bg-background/80 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/" className="text-2xl font-bold text-primary">
            Handshake
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-2xl space-y-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Payment Details */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Details</CardTitle>
                <CardDescription>Your payment information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Amount</p>
                  <p className="text-2xl font-bold">${PAYMENT_AMOUNT} USD</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Payment Method</p>
                  <p className="text-lg font-semibold">Tron (USDT/TRX)</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Current Rate</p>
                  <p className="text-sm">1 USDT ≈ $1 USD</p>
                </div>
              </CardContent>
            </Card>

            {/* Form */}
            <Card>
              <CardHeader>
                <CardTitle>Wallet Address</CardTitle>
                <CardDescription>Send payment to this address</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Wallet Address Display */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Recipient Address</label>
                    <div className="flex items-center gap-2">
                      <Input
                        value={TRON_WALLET}
                        readOnly
                        className="font-mono text-xs"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          navigator.clipboard.writeText(TRON_WALLET)
                        }}
                      >
                        Copy
                      </Button>
                    </div>
                  </div>

                  {/* QR Code Placeholder */}
                  <div className="aspect-square bg-muted rounded-lg border border-border/50 flex items-center justify-center">
                    <div className="text-center text-muted-foreground">
                      <p className="text-sm">QR Code</p>
                      <p className="text-xs">(Scan with your wallet)</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Transaction Form */}
          <Card>
            <CardHeader>
              <CardTitle>Confirm Transaction</CardTitle>
              <CardDescription>Enter your transaction ID after sending payment</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {error && (
                  <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                    {error}
                  </div>
                )}

                {/* Transaction ID Field */}
                <div className="space-y-2">
                  <label htmlFor="transactionId" className="text-sm font-medium">
                    Transaction ID (Hash)
                  </label>
                  <Input
                    id="transactionId"
                    placeholder="Enter your Tron transaction ID"
                    disabled={isLoading}
                    {...register('transactionId')}
                  />
                  {errors.transactionId && (
                    <p className="text-xs text-destructive">{errors.transactionId.message}</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    You can find this in your wallet's transaction history
                  </p>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full"
                  size="lg"
                >
                  {isLoading ? 'Processing...' : 'Confirm Payment'}
                </Button>

                {/* Back Link */}
                <Link href="/payment/choose">
                  <Button type="button" variant="outline" className="w-full">
                    Back
                  </Button>
                </Link>
              </form>
            </CardContent>
          </Card>

          {/* Instructions */}
          <Card className="bg-muted/50">
            <CardHeader>
              <CardTitle className="text-base">Payment Instructions</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-3 text-sm">
                <li className="flex gap-3">
                  <span className="font-semibold text-primary">1.</span>
                  <span>Copy the wallet address above</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-semibold text-primary">2.</span>
                  <span>Open your Tron wallet (e.g., TronLink, Ledger)</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-semibold text-primary">3.</span>
                  <span>Send ${PAYMENT_AMOUNT} USD equivalent in USDT or TRX</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-semibold text-primary">4.</span>
                  <span>Copy the transaction ID from your wallet</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-semibold text-primary">5.</span>
                  <span>Paste it above and click "Confirm Payment"</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-semibold text-primary">6.</span>
                  <span>Wait for admin verification (usually within 24 hours)</span>
                </li>
              </ol>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
