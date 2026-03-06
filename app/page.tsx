'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function Home() {
  const currentYear = new Date().getFullYear()

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#B8F663] via-[#59E4A0] to-[#00D3D8]">
      {/* Navigation Header */}
      <header className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <img 
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202026-03-06%20at%201.07.27%20AM-diCisn1VGmxmGniWtuT9XA85Ahzqh0.jpeg"
            alt="Handshake"
            className="w-10 h-10 rounded"
          />
          <h1 className="text-2xl font-bold text-[#001f23]">Handshake</h1>
        </div>
        <nav className="flex items-center gap-4">
          <Link href="/auth/login">
            <Button variant="ghost" className="text-[#001f23] hover:bg-white/20">
              Sign In
            </Button>
          </Link>
          <Link href="/auth/register">
            <Button className="bg-[#001f23] text-white hover:bg-[#001f23]/90">
              Register Now
            </Button>
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-4xl space-y-12">
          <div className="text-center space-y-6">
            <h2 className="text-5xl md:text-6xl font-bold text-[#001f23] text-balance">
              Master Annotation with Handshake
            </h2>
            <p className="text-xl text-[#001f23]/80 max-w-2xl mx-auto text-pretty">
              Join our comprehensive annotation training platform. Register, complete your crypto payment, and gain instant access to verified handshake accounts ready to task in third-world countries.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link href="/auth/register">
                <Button size="lg" className="bg-[#001f23] text-white hover:bg-[#001f23]/90 px-8">
                  Get Started
                </Button>
              </Link>
              <Link href="/auth/login">
                <Button size="lg" variant="outline" className="border-[#001f23] text-[#001f23] hover:bg-white/50 px-8">
                  Already Registered? Sign In
                </Button>
              </Link>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-6">
            <div className="border-0 shadow-lg bg-white/95 backdrop-blur rounded-lg p-6 space-y-3">
              <h3 className="flex items-center gap-2 text-lg font-semibold text-[#001f23]">
                <span className="text-2xl">✓</span>
                Easy Registration
              </h3>
              <p className="text-[#001f23]/70">
                Sign up with email and password. Confirm your email address to proceed.
              </p>
            </div>

            <div className="border-0 shadow-lg bg-white/95 backdrop-blur rounded-lg p-6 space-y-3">
              <h3 className="flex items-center gap-2 text-lg font-semibold text-[#001f23]">
                <span className="text-2xl">₿</span>
                Crypto Payment
              </h3>
              <p className="text-[#001f23]/70">
                Fast and secure payment via Tron blockchain. No intermediaries, complete privacy.
              </p>
            </div>

            <div className="border-0 shadow-lg bg-white/95 backdrop-blur rounded-lg p-6 space-y-3">
              <h3 className="flex items-center gap-2 text-lg font-semibold text-[#001f23]">
                <span className="text-2xl">🎓</span>
                Full Access
              </h3>
              <p className="text-[#001f23]/70">
                Get verified by admin and receive access to all annotation training classes.
              </p>
            </div>
          </div>

          {/* Process Steps */}
          <div className="bg-white/95 backdrop-blur rounded-2xl p-8 shadow-lg">
            <h3 className="text-2xl font-bold text-[#001f23] mb-8">How It Works</h3>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#B8F663] to-[#59E4A0] flex items-center justify-center mx-auto">
                  <span className="text-lg font-bold text-[#001f23]">1</span>
                </div>
                <h4 className="font-semibold text-[#001f23]">Register</h4>
                <p className="text-sm text-[#001f23]/70">Create account and confirm email</p>
              </div>
              <div className="text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#59E4A0] to-[#23DAC2] flex items-center justify-center mx-auto">
                  <span className="text-lg font-bold text-[#001f23]">2</span>
                </div>
                <h4 className="font-semibold text-[#001f23]">Sign In</h4>
                <p className="text-sm text-[#001f23]/70">Log in to your dashboard</p>
              </div>
              <div className="text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#23DAC2] to-[#00D3D8] flex items-center justify-center mx-auto">
                  <span className="text-lg font-bold text-[#001f23]">3</span>
                </div>
                <h4 className="font-semibold text-[#001f23]">Pay with Crypto</h4>
                <p className="text-sm text-[#001f23]/70">Send payment and verify transaction</p>
              </div>
              <div className="text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#00D3D8] to-[#B8F663] flex items-center justify-center mx-auto">
                  <span className="text-lg font-bold text-[#001f23]">4</span>
                </div>
                <h4 className="font-semibold text-[#001f23]">Get Verified</h4>
                <p className="text-sm text-[#001f23]/70">Admin verification and account activation</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-6 text-[#001f23]/70 text-sm">
        <p>&copy; {currentYear} Handshake. All rights reserved.</p>
      </footer>
    </div>
  )
}
