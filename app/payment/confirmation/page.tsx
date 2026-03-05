'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/client'

export default function ConfirmationPage() {
  const [user, setUser] = useState<any>(null)
  const [paymentInfo, setPaymentInfo] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Get current user
        const { data: { user: authUser } } = await supabase.auth.getUser()
        
        if (authUser) {
          setUser(authUser)
          
          // Fetch user payment info
          const { data: userData } = await supabase
            .from('users')
            .select('*')
            .eq('id', authUser.id)
            .single()

          if (userData) {
            setPaymentInfo(userData)
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserData()
  }, [supabase])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
          <p className="text-muted-foreground">Loading confirmation details...</p>
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
          {/* Success Message */}
          <div className="text-center space-y-4">
            <div className="text-6xl">✓</div>
            <h1 className="text-3xl font-bold">Payment Submitted Successfully!</h1>
            <p className="text-lg text-muted-foreground">
              Thank you for registering with Handshake
            </p>
          </div>

          {/* Status Cards */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Account Information */}
            <Card>
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
                <CardDescription>Your registration details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-semibold">{user?.email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Username</p>
                  <p className="font-semibold">{paymentInfo?.username}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Account Status</p>
                  <p className="font-semibold text-primary">Active</p>
                </div>
              </CardContent>
            </Card>

            {/* Payment Information */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Information</CardTitle>
                <CardDescription>Your payment status</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Payment Method</p>
                  <p className="font-semibold capitalize">
                    {paymentInfo?.payment_method === 'pending' 
                      ? 'Processing...' 
                      : paymentInfo?.payment_method}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Payment Status</p>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${
                      paymentInfo?.payment_status === 'completed' 
                        ? 'bg-green-500' 
                        : paymentInfo?.payment_status === 'failed'
                        ? 'bg-red-500'
                        : 'bg-yellow-500'
                    }`}></div>
                    <p className="font-semibold capitalize">{paymentInfo?.payment_status}</p>
                  </div>
                </div>
                {paymentInfo?.transaction_id && (
                  <div>
                    <p className="text-sm text-muted-foreground">Transaction ID</p>
                    <p className="font-mono text-sm break-all">{paymentInfo.transaction_id}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Next Steps */}
          <Card className="bg-muted/50">
            <CardHeader>
              <CardTitle>What Happens Next?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-primary text-primary-foreground font-semibold">
                      1
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold">Payment Verification</p>
                    <p className="text-sm text-muted-foreground">
                      Our team will verify your payment within 24 hours
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-primary text-primary-foreground font-semibold">
                      2
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold">Account Activation</p>
                    <p className="text-sm text-muted-foreground">
                      Once verified, your account will be fully activated
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-primary text-primary-foreground font-semibold">
                      3
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold">Access Granted</p>
                    <p className="text-sm text-muted-foreground">
                      You'll receive an email with instructions to access your tools
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/">
              <Button variant="outline" className="w-full sm:w-auto">
                Back to Home
              </Button>
            </Link>
            <Button className="w-full sm:w-auto">
              Check Payment Status
            </Button>
          </div>

          {/* Support */}
          <div className="text-center text-sm text-muted-foreground">
            <p>Need help? Contact our support team at support@handshake.com</p>
          </div>
        </div>
      </main>
    </div>
  )
}
