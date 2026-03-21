'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'

export default function Home() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Check if this is a password recovery link
    const code = searchParams.get('code')
    const type = searchParams.get('type')

    if (code && type === 'recovery') {
      // Redirect to password reset page with the recovery code
      router.push(`/auth/reset-password?code=${code}`)
      return
    }
  }, [searchParams, router])

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-1 bg-gradient-to-b from-[#B8F663] via-[#59E4A0] to-[#00D3D8]">
        {/* Hero Section */}
        <main className="flex items-center justify-center px-4 py-6 md:py-12">
          <div className="w-full max-w-4xl space-y-8 md:space-y-12">
            <div className="text-center space-y-3 md:space-y-6">
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-[#001f23] text-balance leading-tight">
                Master Annotation with Handshake
              </h1>
              <p className="text-sm md:text-lg lg:text-xl text-[#001f23]/80 max-w-2xl mx-auto text-pretty leading-relaxed">
                Join our comprehensive annotation training platform. Register, complete your international payment, and gain instant access to verified handshake accounts ready to task globally.
              </p>
              <div className="flex flex-col gap-3 md:gap-4 justify-center pt-2 md:pt-4">
                <Link href="/auth/register">
                  <Button size="lg" className="w-full md:w-auto bg-[#001f23] text-white hover:bg-[#001f23]/90 text-sm md:text-base px-6 md:px-8">
                    Get Started
                  </Button>
                </Link>
                <Link href="/auth/login">
                  <Button size="lg" variant="outline" className="w-full md:w-auto border-[#001f23] text-[#001f23] hover:bg-white/50 text-sm md:text-base px-6 md:px-8">
                    Already Registered? Sign In
                  </Button>
                </Link>
              </div>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              <div className="border-0 shadow-lg bg-white/95 backdrop-blur rounded-lg p-4 md:p-6 space-y-2 md:space-y-3">
                <h3 className="flex items-center gap-2 text-base md:text-lg font-semibold text-[#001f23]">
                  <span className="text-xl md:text-2xl">✓</span>
                  Easy Registration
                </h3>
                <p className="text-xs md:text-sm text-[#001f23]/70 leading-relaxed">
                  Sign up with email and password. Confirm your email address to proceed.
                </p>
              </div>

              <div className="border-0 shadow-lg bg-white/95 backdrop-blur rounded-lg p-4 md:p-6 space-y-2 md:space-y-3">
                <h3 className="flex items-center gap-2 text-base md:text-lg font-semibold text-[#001f23]">
                  <span className="text-xl md:text-2xl">💳</span>
                  International Payment
                </h3>
                <p className="text-xs md:text-sm text-[#001f23]/70 leading-relaxed">
                  Fast and secure payment via Paystack. Supports cards, mobile money, and bank transfers globally.
                </p>
              </div>

              <div className="border-0 shadow-lg bg-white/95 backdrop-blur rounded-lg p-4 md:p-6 space-y-2 md:space-y-3">
                <h3 className="flex items-center gap-2 text-base md:text-lg font-semibold text-[#001f23]">
                  <span className="text-xl md:text-2xl">🎓</span>
                  Full Access
                </h3>
                <p className="text-xs md:text-sm text-[#001f23]/70 leading-relaxed">
                  Get verified by admin and receive access to all annotation training classes.
                </p>
              </div>
            </div>

            {/* Process Steps */}
            <div className="bg-white/95 backdrop-blur rounded-2xl p-4 md:p-8 shadow-lg">
              <h2 className="text-xl md:text-2xl font-bold text-[#001f23] mb-6 md:mb-8">How It Works</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                <div className="text-center space-y-2 md:space-y-3">
                  <div className="w-10 md:w-12 h-10 md:h-12 rounded-full bg-gradient-to-br from-[#B8F663] to-[#59E4A0] flex items-center justify-center mx-auto">
                    <span className="text-base md:text-lg font-bold text-[#001f23]">1</span>
                  </div>
                  <h4 className="text-sm md:text-base font-semibold text-[#001f23]">Register</h4>
                  <p className="text-xs md:text-sm text-[#001f23]/70">Create account and confirm email</p>
                </div>
                <div className="text-center space-y-2 md:space-y-3">
                  <div className="w-10 md:w-12 h-10 md:h-12 rounded-full bg-gradient-to-br from-[#59E4A0] to-[#23DAC2] flex items-center justify-center mx-auto">
                    <span className="text-base md:text-lg font-bold text-[#001f23]">2</span>
                  </div>
                  <h4 className="text-sm md:text-base font-semibold text-[#001f23]">Sign In</h4>
                  <p className="text-xs md:text-sm text-[#001f23]/70">Log in to your dashboard</p>
                </div>
                <div className="text-center space-y-2 md:space-y-3">
                  <div className="w-10 md:w-12 h-10 md:h-12 rounded-full bg-gradient-to-br from-[#23DAC2] to-[#00D3D8] flex items-center justify-center mx-auto">
                    <span className="text-base md:text-lg font-bold text-[#001f23]">3</span>
                  </div>
                  <h4 className="text-sm md:text-base font-semibold text-[#001f23]">Pay $50 USD</h4>
                  <p className="text-xs md:text-sm text-[#001f23]/70">Fully refundable after 14 days</p>
                </div>
                <div className="text-center space-y-2 md:space-y-3">
                  <div className="w-10 md:w-12 h-10 md:h-12 rounded-full bg-gradient-to-br from-[#00D3D8] to-[#B8F663] flex items-center justify-center mx-auto">
                    <span className="text-base md:text-lg font-bold text-[#001f23]">4</span>
                  </div>
                  <h4 className="text-sm md:text-base font-semibold text-[#001f23]">Get Verified</h4>
                  <p className="text-xs md:text-sm text-[#001f23]/70">Admin verification and account activation</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  )
}
