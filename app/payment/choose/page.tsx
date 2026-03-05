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
            <h1 className="text-3xl font-bold">Complete Your Payment</h1>
            <p className="text-muted-foreground">
              Proceed with cryptocurrency payment to access Handshake
            </p>
          </div>

          <div className="flex justify-center">
            {/* Crypto Payment Option */}
            <Link href="/payment/crypto" className="w-full">
              <Card className="cursor-pointer hover:border-primary/50 transition-colors">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="text-2xl">₿</span>
                    Pay with Tron (USDT)
                  </CardTitle>
                  <CardDescription>
                    Fast, secure, and decentralized cryptocurrency payment
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <ul className="text-sm space-y-2 text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">✓</span>
                        <span>Low transaction fees</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">✓</span>
                        <span>Instant verification</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">✓</span>
                        <span>Decentralized and secure</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">✓</span>
                        <span>No personal information required</span>
                      </li>
                    </ul>
                    <Button className="w-full mt-6" size="lg">
                      Continue with Crypto Payment
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>

          <p className="text-center text-sm text-muted-foreground">
            Your payment will be processed securely and verified within minutes.
          </p>
        </div>
      </main>
    </div>
  )
}
