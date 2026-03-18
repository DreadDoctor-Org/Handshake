'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

interface UserData {
  id: string
  email: string
  full_name: string | null
  transaction_id: string | null
  payment_status: string
  account_status: string
  created_at: string
}

export default function WaitlistPage() {
  const router = useRouter()
  const [userData, setUserData] = useState<UserData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  const ADMIN_EMAIL = 'handshake.ai@outlook.com'

  useEffect(() => {
    const loadUserData = async () => {
      try {
        setIsLoading(true)
        setError(null)

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

        if (dataError) throw dataError
        setUserData(data)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load user data'
        setError(errorMessage)
        toast.error('Error', { description: errorMessage })
      } finally {
        setIsLoading(false)
      }
    }

    loadUserData()
  }, [supabase, router])

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut()
      toast.success('Signed Out')
      router.push('/')
    } catch (err) {
      toast.error('Error signing out')
    }
  }

  const copyAdminEmail = () => {
    navigator.clipboard.writeText(ADMIN_EMAIL)
    toast.success('Admin email copied!')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#B8F663] via-[#59E4A0] to-[#00D3D8] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-lg md:text-xl text-[#001f23]">Loading your verification status...</div>
          <div className="inline-block animate-spin">
            <div className="text-4xl">⏳</div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !userData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#B8F663] via-[#59E4A0] to-[#00D3D8] flex flex-col">
        <nav className="flex items-center justify-between px-4 md:px-6 py-3 md:py-4">
          <Link href="/" className="flex items-center gap-2 md:gap-3">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202026-03-06%20at%201.07.27%20AM-diCisn1VGmxmGniWtuT9XA85Ahzqh0.jpeg"
              alt="Handshake"
              className="w-7 md:w-8 h-7 md:h-8 rounded"
            />
            <span className="text-lg md:text-2xl font-bold text-[#001f23]">Handshake</span>
          </Link>
          <Button onClick={handleSignOut} variant="ghost" className="text-xs md:text-sm text-[#001f23]">
            Sign Out
          </Button>
        </nav>

        <main className="flex-1 flex items-center justify-center px-4 py-12">
          <Card className="w-full max-w-md border-0 shadow-lg bg-white/95">
            <CardHeader>
              <CardTitle className="text-lg md:text-2xl text-[#001f23]">Error Loading Page</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 rounded-lg bg-red-100 text-red-700 text-xs md:text-sm">
                {error || 'Unable to load verification page.'}
              </div>
              <Button onClick={() => window.location.reload()} className="w-full">
                Retry
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#B8F663] via-[#59E4A0] to-[#00D3D8] flex flex-col">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-4 md:px-6 py-3 md:py-4 bg-white/50 backdrop-blur border-b border-[#001f23]/10">
        <div className="flex items-center gap-2 md:gap-3">
          <img
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202026-03-06%20at%201.07.27%20AM-diCisn1VGmxmGniWtuT9XA85Ahzqh0.jpeg"
            alt="Handshake"
            className="w-7 md:w-8 h-7 md:h-8 rounded"
          />
          <h1 className="text-lg md:text-2xl font-bold text-[#001f23]">Handshake</h1>
        </div>
        <div className="flex items-center gap-2 md:gap-3">
          <Button onClick={handleSignOut} variant="ghost" className="text-xs md:text-sm text-[#001f23]">
            Sign Out
          </Button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 px-4 md:px-6 py-8 md:py-12 max-w-4xl mx-auto w-full">
        <div className="space-y-6 md:space-y-8">
          {/* Welcome Section */}
          <div className="text-center space-y-3 md:space-y-4">
            <div className="text-5xl md:text-6xl animate-bounce">
              ⏳
            </div>
            <h2 className="text-2xl md:text-4xl font-bold text-[#001f23]">
              Your Application is Under Review
            </h2>
            <p className="text-sm md:text-base text-[#001f23]/70 max-w-2xl mx-auto">
              Thank you for submitting your transaction ID! We're verifying your payment and preparing your account for activation.
            </p>
          </div>

          {/* Status Timeline */}
          <Card className="border-0 shadow-lg bg-white/95 backdrop-blur">
            <CardHeader className="pb-3 md:pb-4">
              <CardTitle className="text-lg md:text-2xl text-[#001f23]">Verification Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Step 1: Payment Received */}
                <div className="flex gap-3 md:gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-8 md:w-10 h-8 md:h-10 rounded-full bg-green-500 flex items-center justify-center text-white text-sm md:text-base font-bold flex-shrink-0">
                      ✓
                    </div>
                    <div className="w-1 h-12 md:h-16 bg-green-300"></div>
                  </div>
                  <div className="pt-1 pb-4 md:pb-6">
                    <h4 className="font-semibold text-[#001f23] text-sm md:text-base">Payment Received</h4>
                    <p className="text-xs md:text-sm text-[#001f23]/70">Your $50 USD payment has been successfully processed</p>
                  </div>
                </div>

                {/* Step 2: Verification in Progress */}
                <div className="flex gap-3 md:gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-8 md:w-10 h-8 md:h-10 rounded-full bg-blue-500 flex items-center justify-center text-white text-lg md:text-xl flex-shrink-0 animate-pulse">
                      📋
                    </div>
                    <div className="w-1 h-12 md:h-16 bg-gray-300"></div>
                  </div>
                  <div className="pt-1 pb-4 md:pb-6">
                    <h4 className="font-semibold text-[#001f23] text-sm md:text-base">Verification in Progress</h4>
                    <p className="text-xs md:text-sm text-[#001f23]/70">
                      Our admin team is verifying your transaction ID and payment details (1-2 hours)
                    </p>
                  </div>
                </div>

                {/* Step 3: Account Activation */}
                <div className="flex gap-3 md:gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-8 md:w-10 h-8 md:h-10 rounded-full bg-gray-300 flex items-center justify-center text-[#001f23] text-base md:text-lg flex-shrink-0">
                      ⚡
                    </div>
                    <div className="w-1 h-12 md:h-16 bg-gray-300"></div>
                  </div>
                  <div className="pt-1 pb-4 md:pb-6">
                    <h4 className="font-semibold text-[#001f23] text-sm md:text-base">Account Activation</h4>
                    <p className="text-xs md:text-sm text-[#001f23]/70">
                      Once verified, your account will be activated and you'll gain full access (2-12 hours)
                    </p>
                  </div>
                </div>

                {/* Step 4: Ready to Work */}
                <div className="flex gap-3 md:gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-8 md:w-10 h-8 md:h-10 rounded-full bg-gray-300 flex items-center justify-center text-base md:text-lg flex-shrink-0">
                      🎯
                    </div>
                  </div>
                  <div className="pt-1">
                    <h4 className="font-semibold text-[#001f23] text-sm md:text-base">Ready to Work</h4>
                    <p className="text-xs md:text-sm text-[#001f23]/70">
                      Access verified handshake accounts and start completing tasks (12-24 hours)
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submitted Information Card */}
          <Card className="border-0 shadow-lg bg-white/95 backdrop-blur">
            <CardHeader className="pb-3 md:pb-4">
              <CardTitle className="text-lg md:text-xl text-[#001f23]">Your Submission Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                <div className="p-3 md:p-4 bg-[#001f23]/5 rounded-lg border border-[#001f23]/10">
                  <p className="text-xs text-[#001f23]/70 mb-1">Email</p>
                  <p className="text-xs md:text-sm font-semibold text-[#001f23] break-all">{userData.email}</p>
                </div>
                <div className="p-3 md:p-4 bg-[#001f23]/5 rounded-lg border border-[#001f23]/10">
                  <p className="text-xs text-[#001f23]/70 mb-1">Full Name</p>
                  <p className="text-xs md:text-sm font-semibold text-[#001f23]">{userData.full_name || 'Not set'}</p>
                </div>
                <div className="p-3 md:p-4 bg-[#001f23]/5 rounded-lg border border-[#001f23]/10">
                  <p className="text-xs text-[#001f23]/70 mb-1">Transaction ID</p>
                  <p className="text-xs md:text-sm font-semibold text-[#001f23] break-all font-mono">{userData.transaction_id || 'Pending'}</p>
                </div>
                <div className="p-3 md:p-4 bg-[#001f23]/5 rounded-lg border border-[#001f23]/10">
                  <p className="text-xs text-[#001f23]/70 mb-1">Status</p>
                  <p className="text-xs md:text-sm font-semibold text-[#001f23]">{userData.payment_status === 'submitted' ? 'Under Review' : 'Processing'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Trust & Support Card */}
          <Card className="border-0 shadow-lg bg-green-50">
            <CardHeader className="pb-3 md:pb-4">
              <CardTitle className="text-lg md:text-xl text-green-700 flex items-center gap-2">
                <span className="text-xl md:text-2xl">🔒</span> Your Data is Secure
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 md:space-y-3">
              <p className="text-xs md:text-sm text-green-700">
                Your payment information and personal details are encrypted and protected by industry-standard security measures.
              </p>
              <p className="text-xs md:text-sm text-green-700">
                We're committed to your privacy and will never share your information with third parties without your consent.
              </p>
            </CardContent>
          </Card>

          {/* FAQ/Help Card */}
          <Card className="border-0 shadow-lg bg-white/95 backdrop-blur">
            <CardHeader className="pb-3 md:pb-4">
              <CardTitle className="text-lg md:text-xl text-[#001f23]">Need Help?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 md:space-y-4">
              <div>
                <h4 className="font-semibold text-[#001f23] text-sm md:text-base mb-1">Typical Verification Timeline:</h4>
                <ul className="text-xs md:text-sm text-[#001f23]/70 space-y-1 ml-4">
                  <li>• Initial Review: 1-2 hours</li>
                  <li>• Verification: 2-12 hours</li>
                  <li>• Account Activation: 12-24 hours</li>
                  <li>• Total: Usually within 24 hours</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-[#001f23] text-sm md:text-base mb-2">Contact Support</h4>
                <Button
                  onClick={copyAdminEmail}
                  variant="outline"
                  className="w-full text-xs md:text-sm"
                >
                  📧 Copy Admin Email
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Refund Policy Reminder */}
          <Card className="border-0 shadow-lg bg-blue-50">
            <CardHeader className="pb-2 md:pb-3">
              <CardTitle className="text-sm md:text-base text-blue-700 flex items-center gap-2">
                <span className="text-lg">💰</span> Refund Guarantee
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs md:text-sm text-blue-700">
                Payment is fully refundable within 14 days with no questions asked. Your satisfaction is our priority.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#001f23]/10 bg-white/50 backdrop-blur px-4 md:px-6 py-4 md:py-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs md:text-sm text-[#001f23]/70">
            &copy; {new Date().getFullYear()} Handshake. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
