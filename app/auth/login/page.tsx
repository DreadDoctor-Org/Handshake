'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) {
        setError(signInError.message)
        toast.error('Sign In Failed', {
          description: signInError.message,
        })
        return
      }

      toast.success('Welcome Back!', {
        description: 'Redirecting to your dashboard...',
      })

      // Redirect to payment dashboard page
      router.push('/dashboard')
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
            <CardTitle className="text-[#001f23]">Sign In</CardTitle>
            <CardDescription className="text-[#001f23]/70">
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 rounded-lg bg-red-100 text-red-700 text-sm">
                  {error}
                </div>
              )}

              {/* Email Field */}
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-[#001f23]">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  required
                  className="border-[#001f23]/20"
                />
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-[#001f23]">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  required
                  className="border-[#001f23]/20"
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#001f23] text-white hover:bg-[#001f23]/90"
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>

              {/* Link to Registration */}
              <p className="text-center text-sm text-[#001f23]/70">
                Don't have an account?{' '}
                <Link href="/auth/register" className="text-[#001f23] font-semibold hover:underline">
                  Register here
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
