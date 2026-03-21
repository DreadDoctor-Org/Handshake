'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

export default function ResetPasswordPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isVerifying, setIsVerifying] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    const verifyRecoveryCode = async () => {
      try {
        // Get the code from URL query parameters
        const code = searchParams.get('code')
        console.log('[v0] Recovery code from URL:', code)

        if (!code) {
          setError('Invalid recovery link. Please request a new password reset.')
          setIsVerifying(false)
          return
        }

        // Exchange the code for a session
        const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
        
        if (exchangeError || !data.session) {
          console.error('[v0] Error exchanging code for session:', exchangeError)
          setError('This recovery link is invalid or has expired. Please request a new one.')
          setIsVerifying(false)
          return
        }

        // Session established successfully
        console.log('[v0] Session established successfully')
        setIsVerifying(false)
      } catch (err) {
        console.error('[v0] Error verifying recovery code:', err)
        setError('An error occurred while verifying your recovery link.')
        setIsVerifying(false)
      }
    }

    verifyRecoveryCode()
  }, [searchParams, supabase])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    // Validation
    if (password.length < 8) {
      setError('Password must be at least 8 characters long')
      setIsLoading(false)
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      setIsLoading(false)
      return
    }

    try {
      // Update the password
      const { error: updateError } = await supabase.auth.updateUser({
        password: password,
      })

      if (updateError) {
        throw updateError
      }

      toast.success('Password Reset Successful!', {
        description: 'You can now sign in with your new password.',
      })

      // Sign out and redirect to login
      await supabase.auth.signOut()
      
      setTimeout(() => {
        router.push('/auth/login')
      }, 1500)
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to reset password'
      console.error('[v0] Error resetting password:', errorMsg)
      setError(errorMsg)
    } finally {
      setIsLoading(false)
    }
  }

  if (isVerifying) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#B8F663] via-[#59E4A0] to-[#00D3D8] flex flex-col">
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

        <main className="flex-1 flex items-center justify-center px-4 py-12">
          <Card className="w-full max-w-md border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-[#001f23]">Verifying Recovery Link</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#001f23] mx-auto"></div>
                <p className="text-sm text-[#001f23]/70">Please wait while we verify your recovery link...</p>
              </div>
            </CardContent>
          </Card>
        </main>

        <footer className="text-center py-6 text-[#001f23]/70 text-sm">
          <p>&copy; {new Date().getFullYear()} Handshake. All rights reserved.</p>
        </footer>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#B8F663] via-[#59E4A0] to-[#00D3D8] flex flex-col">
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

        <main className="flex-1 flex items-center justify-center px-4 py-12">
          <Card className="w-full max-w-md border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-red-600">Recovery Link Invalid</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-lg bg-red-50 border border-red-200">
                <p className="text-red-800 text-sm">{error}</p>
              </div>
              <Link href="/auth/forgot-password" className="block">
                <Button className="w-full bg-[#001f23] text-white hover:bg-[#001f23]/90">
                  Request New Recovery Link
                </Button>
              </Link>
              <Link href="/auth/login" className="block">
                <Button variant="outline" className="w-full border-[#001f23] text-[#001f23]">
                  Back to Sign In
                </Button>
              </Link>
            </CardContent>
          </Card>
        </main>

        <footer className="text-center py-6 text-[#001f23]/70 text-sm">
          <p>&copy; {new Date().getFullYear()} Handshake. All rights reserved.</p>
        </footer>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#B8F663] via-[#59E4A0] to-[#00D3D8] flex flex-col">
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

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-[#001f23]">Set New Password</CardTitle>
            <CardDescription className="text-[#001f23]/70">
              Enter your new password below to reset your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Password Field */}
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-[#001f23]">
                  New Password
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter new password (min 8 characters)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  required
                  className="border-[#001f23]/20"
                />
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="text-sm font-medium text-[#001f23]">
                  Confirm Password
                </label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={isLoading}
                  required
                  className="border-[#001f23]/20"
                />
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                  <p className="text-red-800 text-sm">{error}</p>
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading || !password || !confirmPassword}
                className="w-full bg-[#001f23] text-white hover:bg-[#001f23]/90"
              >
                {isLoading ? 'Resetting...' : 'Reset Password'}
              </Button>

              {/* Back to Login */}
              <p className="text-center text-sm text-[#001f23]/70">
                <Link href="/auth/login" className="text-[#001f23] font-semibold hover:underline">
                  Back to Sign In
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </main>

      <footer className="text-center py-6 text-[#001f23]/70 text-sm">
        <p>&copy; {new Date().getFullYear()} Handshake. All rights reserved.</p>
      </footer>
    </div>
  )
}
