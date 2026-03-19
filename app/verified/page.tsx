'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

interface UserData {
  id: string
  email: string
  full_name: string | null
  account_status: string
  country?: string
  transaction_id: string | null
}

export default function VerifiedPage() {
  const router = useRouter()
  const [userData, setUserData] = useState<UserData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const { data: authData, error: authError } = await supabase.auth.getUser()

        if (authError || !authData.user) {
          router.push('/auth/login')
          return
        }

        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', authData.user.id)
          .single()

        if (error) throw error

        setUserData(data)

        // If account is not active, redirect to dashboard
        if (data.account_status !== 'active') {
          router.push('/dashboard')
          return
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unable to load user data'
        toast.error('Error', { description: errorMessage })
        router.push('/auth/login')
      } finally {
        setIsLoading(false)
      }
    }

    loadUserData()
  }, [supabase, router])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#B8F663] via-[#59E4A0] to-[#00D3D8] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-base md:text-lg text-[#001f23]">Loading...</div>
        </div>
      </div>
    )
  }

  if (!userData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#B8F663] via-[#59E4A0] to-[#00D3D8] flex items-center justify-center">
        <Card className="w-full max-w-md border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Session Expired</CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push('/auth/login')} className="w-full">
              Sign In Again
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#B8F663] via-[#59E4A0] to-[#00D3D8] flex flex-col">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-4 md:px-6 py-3 md:py-4">
        <div className="flex items-center gap-2 md:gap-3">
          <img
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202026-03-06%20at%201.07.27%20AM-diCisn1VGmxmGniWtuT9XA85Ahzqh0.jpeg"
            alt="Handshake"
            className="w-7 md:w-8 h-7 md:h-8 rounded"
          />
          <h1 className="text-lg md:text-2xl font-bold text-[#001f23]">Handshake</h1>
        </div>
        <Button onClick={handleSignOut} variant="ghost" className="text-xs md:text-sm text-[#001f23]">
          Sign Out
        </Button>
      </nav>

      {/* Main Content */}
      <main className="flex-1 px-4 md:px-6 py-6 md:py-8 max-w-4xl mx-auto w-full">
        <div className="space-y-4 md:space-y-6">
          {/* Success Card */}
          <Card className="border-0 shadow-lg bg-white/95">
            <CardHeader className="pb-4 md:pb-6">
              <div className="text-center space-y-3">
                <div className="inline-block p-4 md:p-6 bg-green-100 rounded-full">
                  <svg
                    className="w-12 md:w-16 h-12 md:h-16 text-green-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <CardTitle className="text-2xl md:text-3xl text-green-700">
                  Account Verified!
                </CardTitle>
                <CardDescription className="text-base md:text-lg text-[#001f23]">
                  Congratulations, {userData.full_name}! Your account is now fully verified and active.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <p className="text-sm md:text-base text-green-900">
                  Your payment has been verified and your account is ready to use. You now have full access to all Handshake features and can start working globally.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Account Details */}
          <Card className="border-0 shadow-lg bg-white/95">
            <CardHeader>
              <CardTitle className="text-lg md:text-xl">Account Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3 bg-[#001f23]/5 rounded border border-[#001f23]/10">
                  <p className="text-xs text-[#001f23]/70 mb-1">Full Name</p>
                  <p className="text-xs md:text-sm font-semibold text-[#001f23]">{userData.full_name || 'Not provided'}</p>
                </div>
                <div className="p-3 bg-[#001f23]/5 rounded border border-[#001f23]/10">
                  <p className="text-xs text-[#001f23]/70 mb-1">Email</p>
                  <p className="text-xs md:text-sm font-semibold text-[#001f23] break-all">{userData.email}</p>
                </div>
                <div className="p-3 bg-[#001f23]/5 rounded border border-[#001f23]/10">
                  <p className="text-xs text-[#001f23]/70 mb-1">Country</p>
                  <p className="text-xs md:text-sm font-semibold text-[#001f23]">{userData.country || 'Not provided'}</p>
                </div>
                <div className="p-3 bg-green-50 rounded border border-green-200">
                  <p className="text-xs text-green-700 mb-1">Status</p>
                  <p className="text-xs md:text-sm font-semibold text-green-900">✓ Active & Verified</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Features */}
          <Card className="border-0 shadow-lg bg-white/95">
            <CardHeader>
              <CardTitle className="text-lg md:text-xl">What You Can Do Now</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex gap-3">
                  <span className="text-xl text-green-600">✓</span>
                  <div>
                    <p className="font-semibold text-sm text-[#001f23]">Access Global Opportunities</p>
                    <p className="text-xs text-[#001f23]/70">Work with clients worldwide</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="text-xl text-green-600">✓</span>
                  <div>
                    <p className="font-semibold text-sm text-[#001f23]">Full Account Features</p>
                    <p className="text-xs text-[#001f23]/70">Access all tools and resources</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="text-xl text-green-600">✓</span>
                  <div>
                    <p className="font-semibold text-sm text-[#001f23]">Priority Support</p>
                    <p className="text-xs text-[#001f23]/70">Get help from our support team</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="text-xl text-green-600">✓</span>
                  <div>
                    <p className="font-semibold text-sm text-[#001f23]">Guaranteed Refund Policy</p>
                    <p className="text-xs text-[#001f23]/70">30-day money-back guarantee</p>
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <Card className="border-0 shadow-lg bg-blue-50">
            <CardHeader>
              <CardTitle className="text-lg md:text-xl text-blue-900">Next Steps</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-blue-900">
                Your account is ready! You can now start using all features. Check your email for additional information and resources.
              </p>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button className="flex-1 bg-[#001f23] text-white hover:bg-[#001f23]/90">
                  Explore Features
                </Button>
                <Button variant="outline" className="flex-1 border-[#001f23] text-[#001f23] hover:bg-[#001f23]/10">
                  View Documentation
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#001f23]/10 bg-white/50 backdrop-blur px-4 md:px-6 py-4 md:py-6">
        <div className="max-w-4xl mx-auto text-center space-y-2">
          <p className="text-xs md:text-sm text-[#001f23]">
            Need help? Contact us at <strong>handshake.ai@outlook.com</strong>
          </p>
          <p className="text-xs md:text-sm text-[#001f23]/70">
            &copy; {new Date().getFullYear()} Handshake. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
