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
  account_status: string
  country?: string
}

export default function WaitlistPage() {
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
        
        // If account is active, redirect to verified page
        if (data.account_status === 'active') {
          router.push('/verified')
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
          {/* Verification In Progress Card */}
          <Card className="border-0 shadow-lg bg-white/95">
            <CardHeader className="pb-4 md:pb-6">
              <div className="text-center space-y-2">
                <div className="inline-block p-3 md:p-4 bg-blue-100 rounded-full animate-pulse">
                  <svg
                    className="w-8 md:w-12 h-8 md:h-12 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <CardTitle className="text-lg md:text-2xl text-[#001f23]">
                  Your Account is Under Verification
                </CardTitle>
                <CardDescription className="text-xs md:text-sm text-[#001f23]/70">
                  Thank you for submitting your transaction ID. Our admin team is reviewing your payment.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 md:space-y-6">
              {/* Verification Timeline */}
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center text-sm font-bold">
                      ✓
                    </div>
                    <div className="w-1 h-12 bg-green-200 mt-2"></div>
                  </div>
                  <div className="pb-4">
                    <p className="font-semibold text-[#001f23]">Payment Received</p>
                    <p className="text-xs md:text-sm text-[#001f23]/70">Your payment has been recorded</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-bold animate-spin">
                      ⟳
                    </div>
                    <div className="w-1 h-12 bg-gray-200 mt-2"></div>
                  </div>
                  <div className="pb-4">
                    <p className="font-semibold text-[#001f23]">Verification in Progress</p>
                    <p className="text-xs md:text-sm text-[#001f23]/70">Admin team is reviewing your submission</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-gray-300 text-[#001f23] flex items-center justify-center text-sm font-bold">
                      ✓
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold text-[#001f23]">Account Activated</p>
                    <p className="text-xs md:text-sm text-[#001f23]/70">You will be redirected automatically</p>
                  </div>
                </div>
              </div>

              {/* Expected Timeline */}
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm font-semibold text-blue-900 mb-2">Expected Timeline</p>
                <ul className="text-xs md:text-sm text-blue-800 space-y-1">
                  <li>• Standard verification: 1-2 hours</li>
                  <li>• Extended review: 2-12 hours</li>
                  <li>• Maximum processing: 24 hours</li>
                </ul>
              </div>

              {/* User Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3 bg-[#001f23]/5 rounded border border-[#001f23]/10">
                  <p className="text-xs text-[#001f23]/70 mb-1">Email</p>
                  <p className="text-xs md:text-sm font-semibold text-[#001f23] break-all">{userData.email}</p>
                </div>
                <div className="p-3 bg-[#001f23]/5 rounded border border-[#001f23]/10">
                  <p className="text-xs text-[#001f23]/70 mb-1">Transaction ID</p>
                  <p className="text-xs md:text-sm font-semibold text-[#001f23] break-all font-mono">
                    {userData.transaction_id || 'Pending'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Trust Message Card */}
          <Card className="border-0 shadow-lg bg-green-50">
            <CardContent className="pt-4 md:pt-6">
              <div className="flex gap-3">
                <span className="text-2xl">🔒</span>
                <div className="space-y-2">
                  <p className="font-semibold text-green-900">Your Account is Secure</p>
                  <p className="text-xs md:text-sm text-green-800">
                    We process all payments securely through trusted payment providers. Your personal information is encrypted and protected.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Refund Policy */}
          <Card className="border-0 shadow-lg bg-green-50">
            <CardContent className="pt-4 md:pt-6">
              <div className="flex gap-3">
                <span className="text-2xl">✓</span>
                <div className="space-y-2">
                  <p className="font-semibold text-green-900">30-Day Money-Back Guarantee</p>
                  <p className="text-xs md:text-sm text-green-800">
                    Not satisfied? Full refund within 30 days, no questions asked. Your satisfaction is our priority.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* FAQ Section */}
          <Card className="border-0 shadow-lg bg-white/95">
            <CardHeader>
              <CardTitle className="text-base md:text-lg">Frequently Asked Questions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="font-semibold text-sm text-[#001f23] mb-1">Why is verification taking time?</p>
                <p className="text-xs md:text-sm text-[#001f23]/70">
                  Our admin team manually verifies each payment to ensure security and prevent fraud. This protects your account.
                </p>
              </div>
              <div>
                <p className="font-semibold text-sm text-[#001f23] mb-1">What if my verification is rejected?</p>
                <p className="text-xs md:text-sm text-[#001f23]/70">
                  If there's an issue, you'll receive an email with explanation and full refund instructions.
                </p>
              </div>
              <div>
                <p className="font-semibold text-sm text-[#001f23] mb-1">Can I change my transaction ID?</p>
                <p className="text-xs md:text-sm text-[#001f23]/70">
                  Contact admin support if you need to update your transaction ID during verification.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#001f23]/10 bg-white/50 backdrop-blur px-4 md:px-6 py-4 md:py-6">
        <div className="max-w-4xl mx-auto text-center space-y-2">
          <p className="text-xs md:text-sm text-[#001f23]">
            Have questions? Contact us at <strong>handshake.ai@outlook.com</strong>
          </p>
          <p className="text-xs md:text-sm text-[#001f23]/70">
            &copy; {new Date().getFullYear()} Handshake. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
