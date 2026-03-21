'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

export default function ResetPasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isReady, setIsReady] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    // Check if user has a valid session (came from reset link)
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        toast.error('Invalid Link', {
          description: 'This password reset link is invalid or has expired.',
        })
        router.push('/auth/forgot-password')
        return
      }
      setIsReady(true)
    }

    checkSession()
  }, [supabase, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validate passwords
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      toast.error('Error', {
        description: 'Passwords do not match',
      })
      return
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters')
      toast.error('Error', {
        description: 'Password must be at least 8 characters',
      })
      return
    }

    setIsLoading(true)

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: password,
      })

      if (updateError) {
        setError(updateError.message)
        toast.error('Error', {
          description: updateError.message,
        })
        return
      }

      toast.success('Password Updated!', {
        description: 'Your password has been successfully reset. Redirecting to login...',
      })

      // Sign out and redirect to login
      await supabase.auth.signOut()
      router.push('/auth/login')
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'An error occurred'
      setError(errorMsg)
      toast.error('Error', {
        description: errorMsg,
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (!isReady) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#B8F663] via-[#59E4A0] to-[#00D3D8] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#001f23]"></div>
          <p className="mt-4 text-[#001f23]">Verifying reset link...</p>
        </div>
      </div>
    )
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
            <CardTitle className="text-[#001f23]">Set New Password</CardTitle>
            <CardDescription className="text-[#001f23]/70">
              Enter your new password to complete the reset process
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 rounded-lg bg-red-100 text-red-700 text-sm">
                  {error}
                </div>
              )}

              {/* New Password Field */}
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-[#001f23]">
                  New Password
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter new password (min. 8 characters)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  required
                  minLength={8}
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
                  minLength={8}
                  className="border-[#001f23]/20"
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading || !password || !confirmPassword}
                className="w-full bg-[#001f23] text-white hover:bg-[#001f23]/90"
              >
                {isLoading ? 'Updating Password...' : 'Reset Password'}
              </Button>

              {/* Back to Login */}
              <p className="text-center text-xs text-[#001f23]/70">
                <Link href="/auth/login" className="text-[#001f23] font-semibold hover:underline">
                  Back to Sign In
                </Link>
              </p>
            </form>
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
