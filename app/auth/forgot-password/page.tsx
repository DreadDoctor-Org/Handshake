'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/`,
      })

      if (error) {
        toast.error('Error', {
          description: error.message,
        })
        return
      }

      setSubmitted(true)
      toast.success('Email Sent!', {
        description: 'Check your email for password reset instructions. If you don\'t see it within 5 minutes, check your spam folder.',
      })
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'An error occurred'
      toast.error('Error', {
        description: errorMsg,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#B8F663] via-[#59E4A0] to-[#00D3D8] flex flex-col">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-3">
          <img 
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202026-03-06%20at%201.07.27%20AM-diCisn1VGmxmGniWtuT9XA85Ahzqh0.jpeg"
            alt="Handshake"
            className="w-8 h-8 rounded"
          />
          <span className="text-2xl font-bold text-[#001f23]">Handshake</span>
        </Link>
      </nav>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-[#001f23]">Reset Password</CardTitle>
            <CardDescription className="text-[#001f23]/70">
              Enter your email to receive password reset instructions
            </CardDescription>
          </CardHeader>
          <CardContent>
            {submitted ? (
              <div className="space-y-4 text-center">
                <div className="p-4 rounded-lg bg-green-50 border border-green-200">
                  <p className="text-green-800 text-sm">
                    Password reset link has been sent to <strong>{email}</strong>. Check your email and follow the instructions to reset your password.
                  </p>
                </div>
                <p className="text-sm text-[#001f23]/70">
                  Didn't receive the email? Check your spam folder or{' '}
                  <button
                    onClick={() => setSubmitted(false)}
                    className="text-[#001f23] font-semibold hover:underline"
                  >
                    try again
                  </button>
                </p>
                <Link href="/auth/login" className="block">
                  <Button className="w-full bg-[#001f23] text-white hover:bg-[#001f23]/90">
                    Back to Sign In
                  </Button>
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email Field */}
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-[#001f23]">
                    Email Address
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your registered email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    required
                    className="border-[#001f23]/20"
                  />
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isLoading || !email}
                  className="w-full bg-[#001f23] text-white hover:bg-[#001f23]/90"
                >
                  {isLoading ? 'Sending...' : 'Send Reset Link'}
                </Button>

                {/* Back to Login */}
                <p className="text-center text-sm text-[#001f23]/70">
                  Remember your password?{' '}
                  <Link href="/auth/login" className="text-[#001f23] font-semibold hover:underline">
                    Sign In
                  </Link>
                </p>
              </form>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="text-center py-6 text-[#001f23]/70 text-sm">
        <p>&copy; {new Date().getFullYear()} Handshake. All rights reserved.</p>
      </footer>
    </div>
  )
}
