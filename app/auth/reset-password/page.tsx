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
  const [isVerified, setIsVerified] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (session) {
          setIsVerified(true)
        } else {
          setError('Your session has expired. Please request a new password reset link.')
        }
      } catch (err) {
        setError('An error occurred. Please try again.')
      }
    }

    checkSession()
  }, [supabase.auth])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password.length < 8) {
      toast.error('Error', { description: 'Password must be at least 8 characters' })
      return
    }

    if (password !== confirmPassword) {
      toast.error('Error', { description: 'Passwords do not match' })
      return
    }

    setIsLoading(true)
    try {
      const { error: updateError } = await supabase.auth.updateUser({ password })

      if (updateError) throw updateError

      toast.success('Success!', { description: 'Your password has been reset successfully.' })

      await supabase.auth.signOut()
      setTimeout(() => router.push('/auth/login'), 1500)
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to reset password'
      toast.error('Error', { description: errorMsg })
    } finally {
      setIsLoading(false)
    }
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#B8F663] via-[#59E4A0] to-[#00D3D8] flex flex-col">
        <nav className="flex items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-3">
            <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202026-03-06%20at%201.07.27%20AM-diCisn1VGmxmGniWtuT9XA85Ahzqh0.jpeg" alt="Handshake" className="w-8 h-8 rounded" />
            <span className="text-2xl font-bold text-[#001f23]">Handshake</span>
          </Link>
        </nav>
        <main className="flex-1 flex items-center justify-center px-4 py-12">
          <Card className="w-full max-w-md border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-[#001f23]">Recovery Link Expired</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-[#001f23]/70">{error}</p>
              <Link href="/auth/forgot-password" className="block">
                <Button className="w-full bg-[#001f23] text-white hover:bg-[#001f23]/90">Request New Reset Link</Button>
              </Link>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  if (!isVerified) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#B8F663] via-[#59E4A0] to-[#00D3D8] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#001f23] mx-auto"></div>
          <p className="text-[#001f23] mt-4">Verifying your link...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#B8F663] via-[#59E4A0] to-[#00D3D8] flex flex-col">
      <nav className="flex items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-3">
          <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202026-03-06%20at%201.07.27%20AM-diCisn1VGmxmGniWtuT9XA85Ahzqh0.jpeg" alt="Handshake" className="w-8 h-8 rounded" />
          <span className="text-2xl font-bold text-[#001f23]">Handshake</span>
        </Link>
      </nav>

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-[#001f23]">Set New Password</CardTitle>
            <CardDescription className="text-[#001f23]/70">Enter your new password below</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-[#001f23]">New Password</label>
                <Input type="password" id="password" placeholder="Minimum 8 characters" value={password} onChange={(e) => setPassword(e.target.value)} disabled={isLoading} required />
              </div>

              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="text-sm font-medium text-[#001f23]">Confirm Password</label>
                <Input type="password" id="confirmPassword" placeholder="Re-enter your password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} disabled={isLoading} required />
              </div>

              <Button type="submit" disabled={isLoading} className="w-full bg-[#001f23] text-white hover:bg-[#001f23]/90">
                {isLoading ? 'Resetting...' : 'Reset Password'}
              </Button>

              <p className="text-center text-sm text-[#001f23]/70">
                Remember your password? <Link href="/auth/login" className="text-[#001f23] font-semibold hover:underline">Sign In</Link>
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