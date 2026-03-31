'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

export default function ResetPasswordPage() {
  const router = useRouter()
  const supabase = createClient()
  
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isVerifying, setIsVerifying] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    const verifyRecoveryLink = async () => {
      try {
        // Extract tokens from URL hash
        const hash = typeof window !== 'undefined' ? window.location.hash : ''
        
        if (!hash) {
          setError('Invalid recovery link. No tokens found.')
          setIsVerifying(false)
          return
        }

        // Parse hash fragment
        const hashParams = new URLSearchParams(hash.substring(1))
        const accessToken = hashParams.get('access_token')
        const refreshToken = hashParams.get('refresh_token')
        const type = hashParams.get('type')

        if (!accessToken || !refreshToken || type !== 'recovery') {
          setError('Invalid recovery link. Please request a new password reset.')
          setIsVerifying(false)
          return
        }

        // Set the session with the recovery tokens
        const { error: sessionError } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        })

        if (sessionError) {
          setError('Recovery link is invalid or expired. Please request a new one.')
          setIsVerifying(false)
          return
        }

        // Session is valid
        setIsVerifying(false)
      } catch (err) {
        setError('An error occurred. Please try again.')
        setIsVerifying(false)
      }
    }

    verifyRecoveryLink()
  }, [supabase.auth])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate passwords
    if (password.length < 8) {
      toast.error('Error', {
        description: 'Password must be at least 8 characters long.',
      })
      return
    }

    if (password !== confirmPassword) {
      toast.error('Error', {
        description: 'Passwords do not match.',
      })
      return
    }

    setIsLoading(true)

    try {
      // Update user password
      const { error: updateError } = await supabase.auth.updateUser({
        password: password,
      })

      if (updateError) {
        throw updateError
      }

      setSuccess(true)
      toast.success('Success!', {
        description: 'Your password has been reset. Redirecting to login...',
      })

      // Sign out and redirect to login
      await supabase.auth.signOut()

      setTimeout(() => {
        router.push('/auth/login')
      }, 2000)
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to reset password'
      toast.error('Error', {
        description: errorMsg,
      })
      setIsLoading(false)
    }
  }

  // Loading state - verifying link
  if (isVerifying) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#B8F663] via-[#59E4A0] to-[#00D3D8] flex flex-col">
        <nav className="flex items-center justify-between px-4 md:px-6 py-4">
          <Link href="/" className="flex items-center gap-2 md:gap-3">
            <img src="https://blob.v0.app/rWUzZ.jpeg" alt="Handshake" className="w-6 md:w-8 h-6 md:h-8 rounded" />
            <span className="text-xl md:text-2xl font-bold text-[#001f23]">Handshake</span>
          </Link>
        </nav>

        <main className="flex-1 flex items-center justify-center px-4 py-12">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#001f23]"></div>
            </div>
            <p className="text-[#001f23] font-medium">Verifying your recovery link...</p>
            <p className="text-sm text-[#001f23]/70">Please wait while we validate your request.</p>
          </div>
        </main>
      </div>
    )
  }

  // Error state - invalid/expired link
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#B8F663] via-[#59E4A0] to-[#00D3D8] flex flex-col">
        <nav className="flex items-center justify-between px-4 md:px-6 py-4">
          <Link href="/" className="flex items-center gap-2 md:gap-3">
            <img src="https://blob.v0.app/rWUzZ.jpeg" alt="Handshake" className="w-6 md:w-8 h-6 md:h-8 rounded" />
            <span className="text-xl md:text-2xl font-bold text-[#001f23]">Handshake</span>
          </Link>
        </nav>

        <main className="flex-1 flex items-center justify-center px-4 py-12">
          <Card className="w-full max-w-md border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-[#001f23]">Recovery Link Invalid</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-800">{error}</p>
              </div>
              <p className="text-sm text-[#001f23]/70">Recovery links expire after 24 hours. Please request a new one.</p>
              <div className="space-y-2">
                <Link href="/auth/forgot-password" className="block">
                  <Button className="w-full bg-[#001f23] text-white hover:bg-[#001f23]/90">
                    Request New Reset Link
                  </Button>
                </Link>
                <Link href="/auth/login" className="block">
                  <Button variant="outline" className="w-full">
                    Back to Login
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  // Success state - password reset complete
  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#B8F663] via-[#59E4A0] to-[#00D3D8] flex flex-col">
        <nav className="flex items-center justify-between px-4 md:px-6 py-4">
          <Link href="/" className="flex items-center gap-2 md:gap-3">
            <img src="https://blob.v0.app/rWUzZ.jpeg" alt="Handshake" className="w-6 md:w-8 h-6 md:h-8 rounded" />
            <span className="text-xl md:text-2xl font-bold text-[#001f23]">Handshake</span>
          </Link>
        </nav>

        <main className="flex-1 flex items-center justify-center px-4 py-12">
          <Card className="w-full max-w-md border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-[#001f23]">Password Reset Successful</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-sm text-green-800">Your password has been successfully reset. Redirecting to login...</p>
              </div>
              <Link href="/auth/login" className="block">
                <Button className="w-full bg-[#001f23] text-white hover:bg-[#001f23]/90">
                  Go to Login
                </Button>
              </Link>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  // Main reset password form
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#B8F663] via-[#59E4A0] to-[#00D3D8] flex flex-col">
      <nav className="flex items-center justify-between px-4 md:px-6 py-4">
        <Link href="/" className="flex items-center gap-2 md:gap-3">
          <img src="https://blob.v0.app/rWUzZ.jpeg" alt="Handshake" className="w-6 md:w-8 h-6 md:h-8 rounded" />
          <span className="text-xl md:text-2xl font-bold text-[#001f23]">Handshake</span>
        </Link>
      </nav>

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-[#001f23]">Set Your New Password</CardTitle>
            <CardDescription className="text-[#001f23]/70">
              Enter a strong password to secure your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-[#001f23]">
                  New Password
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Minimum 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  required
                  className="bg-white border-[#001f23]/20 text-[#001f23]"
                />
                <p className="text-xs text-[#001f23]/60">Must be at least 8 characters long</p>
              </div>

              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="text-sm font-medium text-[#001f23]">
                  Confirm Password
                </label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Re-enter your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={isLoading}
                  required
                  className="bg-white border-[#001f23]/20 text-[#001f23]"
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading || !password || !confirmPassword}
                className="w-full bg-[#001f23] text-white hover:bg-[#001f23]/90 disabled:opacity-50"
              >
                {isLoading ? 'Resetting Password...' : 'Reset Password'}
              </Button>

              <p className="text-center text-xs text-[#001f23]/70">
                Remember your password?{' '}
                <Link href="/auth/login" className="text-[#001f23] font-semibold hover:underline">
                  Sign In
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </main>

      <footer className="text-center py-4 md:py-6 text-[#001f23]/70 text-xs md:text-sm">
        <p>&copy; {new Date().getFullYear()} Handshake. All rights reserved.</p>
      </footer>
    </div>
  )
}
