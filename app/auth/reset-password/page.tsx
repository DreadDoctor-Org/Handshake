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
    const verifyCode = async () => {
      try {
        const code = searchParams.get('code')
        
        if (!code) {
          setError('No recovery code found. Please request a new password reset.')
          setIsVerifying(false)
          return
        }

        const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
        
        if (exchangeError || !data.session) {
          setError('Invalid or expired recovery link. Please request a new password reset.')
          setIsVerifying(false)
          return
        }

        setIsVerifying(false)
      } catch (err) {
        setError('An error occurred while verifying your link.')
        setIsVerifying(false)
      }
    }

    verifyCode()
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password.length < 8) {
      toast.error('Password must be at least 8 characters')
      return
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    setIsLoading(true)
    try {
      const { error: updateError } = await supabase.auth.updateUser({ password })

      if (updateError) {
        toast.error(updateError.message || 'Failed to reset password')
        return
      }

      toast.success('Password reset successfully!')
      await supabase.auth.signOut()
      
      setTimeout(() => {
        router.push('/auth/login')
      }, 2000)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to reset password')
    } finally {
      setIsLoading(false)
    }
  }

  if (isVerifying) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#B8F663] via-[#59E4A0] to-[#00D3D8] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#001f23] mx-auto mb-4"></div>
          <p className="text-[#001f23] font-semibold">Verifying your recovery link...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#B8F663] via-[#59E4A0] to-[#00D3D8] flex flex-col">
        <nav className="flex items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-3">
            <span className="text-2xl font-bold text-[#001f23]">Handshake</span>
          </Link>
        </nav>
        <main className="flex-1 flex items-center justify-center px-4 py-12">
          <Card className="w-full max-w-md border-0 shadow-lg bg-white/95">
            <CardHeader>
              <CardTitle className="text-[#001f23]">Recovery Link Invalid</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-[#001f23]/70">{error}</p>
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
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#B8F663] via-[#59E4A0] to-[#00D3D8] flex flex-col">
      <nav className="flex items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-3">
          <span className="text-2xl font-bold text-[#001f23]">Handshake</span>
        </Link>
      </nav>

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md border-0 shadow-lg bg-white/95">
          <CardHeader>
            <CardTitle className="text-[#001f23]">Reset Your Password</CardTitle>
            <CardDescription className="text-[#001f23]/70">Enter your new password below</CardDescription>
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
                  className="bg-white border-[#001f23]/20"
                />
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
                  className="bg-white border-[#001f23]/20"
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#001f23] text-white hover:bg-[#001f23]/90"
              >
                {isLoading ? 'Resetting Password...' : 'Reset Password'}
              </Button>

              <p className="text-center text-sm text-[#001f23]/70">
                Remember your password?{' '}
                <Link href="/auth/login" className="text-[#001f23] font-semibold hover:underline">
                  Sign In
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
