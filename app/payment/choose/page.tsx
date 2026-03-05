'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function ChoosePaymentPage() {
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
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold">Select Payment Method</h1>
            <p className="text-muted-foreground">
              Choose how you'd like to complete your payment
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Card Payment Option */}
            <Link href="/payment/card">
              <Card className="cursor-pointer hover:border-primary/50 transition-colors h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="text-2xl">💳</span>
                    Card Payment
                  </CardTitle>
                  <CardDescription>
                    Pay with credit or debit card via Stripe
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <ul className="text-sm space-y-2 text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">✓</span>
                        <span>Instant processing</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">✓</span>
                        <span>Secure Stripe checkout</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">✓</span>
                        <span>All major cards accepted</span>
                      </li>
                    </ul>
                    <Button className="w-full mt-6">
                      Continue with Card
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </Link>

            {/* Crypto Payment Option */}
            <Link href="/payment/crypto">
              <Card className="cursor-pointer hover:border-primary/50 transition-colors h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="text-2xl">₿</span>
                    Crypto Payment
                  </CardTitle>
                  <CardDescription>
                    Pay with cryptocurrency (Tron)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <ul className="text-sm space-y-2 text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">✓</span>
                        <span>Decentralized transaction</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">✓</span>
                        <span>Low fees</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">✓</span>
                        <span>Private and secure</span>
                      </li>
                    </ul>
                    <Button className="w-full mt-6">
                      Continue with Crypto
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>

          <p className="text-center text-sm text-muted-foreground">
            Both payment methods are processed securely and instantly.
          </p>
        </div>
      </main>
    </div>
  )
}
