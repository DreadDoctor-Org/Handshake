'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/client'

const PAYMENT_AMOUNT = 99.99

export default function CardPaymentPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  const handleStripeCheckout = async () => {
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

      // Create checkout session via API
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          amount: Math.round(PAYMENT_AMOUNT * 100), // Amount in cents
          email: user.email,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        setError(errorData.error || 'Failed to create checkout session')
        return
      }

      const { url } = await response.json()

      if (url) {
        window.location.href = url
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
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
        <div className="w-full max-w-md">
          <Card>
            <CardHeader>
              <CardTitle>Card Payment</CardTitle>
              <CardDescription>
                Complete your payment securely with Stripe
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Payment Summary */}
              <div className="space-y-4 p-4 rounded-lg bg-muted/50 border border-border/50">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Handshake Access</span>
                  <span className="font-semibold">${PAYMENT_AMOUNT.toFixed(2)}</span>
                </div>
                <div className="border-t border-border/50 pt-4 flex justify-between items-center font-semibold text-lg">
                  <span>Total</span>
                  <span className="text-primary">${PAYMENT_AMOUNT.toFixed(2)}</span>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                  {error}
                </div>
              )}

              {/* Features */}
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <span className="text-primary mt-1">✓</span>
                  <span>Secure Stripe payment processing</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-primary mt-1">✓</span>
                  <span>All major credit and debit cards accepted</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-primary mt-1">✓</span>
                  <span>Instant payment confirmation</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-primary mt-1">✓</span>
                  <span>Your information is encrypted and secure</span>
                </div>
              </div>

              {/* Checkout Button */}
              <Button
                onClick={handleStripeCheckout}
                disabled={isLoading}
                className="w-full"
                size="lg"
              >
                {isLoading ? (
                  <>
                    <span className="mr-2">Processing...</span>
                  </>
                ) : (
                  <>
                    <span className="mr-2">💳</span>
                    Proceed to Stripe Checkout
                  </>
                )}
              </Button>

              {/* Back Button */}
              <Link href="/payment/choose">
                <Button type="button" variant="outline" className="w-full">
                  Back
                </Button>
              </Link>

              {/* Security Notice */}
              <p className="text-xs text-muted-foreground text-center">
                You will be redirected to Stripe's secure payment page. We never store your card information.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
