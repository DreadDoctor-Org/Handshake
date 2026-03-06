'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/client'
import { registerSchema, type RegisterSchema } from '@/lib/schemas/auth'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const supabase = createClient()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterSchema) => {
    setIsLoading(true)
    setError(null)

    try {
      // Sign up with Supabase Auth
      const { error: authError, data: authData } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/confirm`,
          data: {
            username: data.username,
          },
        },
      })

      if (authError) {
        setError(authError.message)
        toast.error('Registration Failed', {
          description: authError.message,
        })
        return
      }

      if (authData.user) {
        // Create user record in public.users table
        const { error: userError } = await supabase
          .from('users')
          .insert([
            {
              id: authData.user.id,
              username: data.username,
              payment_method: 'crypto',
              payment_status: 'pending',
            },
          ])

        if (userError) {
          console.error('Error creating user record:', userError)
        }

        // Show success message
        setSuccess(true)
        toast.success('Registration Successful!', {
          description: 'Please check your email to confirm your account.',
        })
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'An error occurred during registration'
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
            <CardTitle className="text-[#001f23]">Create Account</CardTitle>
            <CardDescription className="text-[#001f23]/70">
              Register to access Handshake annotation training
            </CardDescription>
          </CardHeader>
          <CardContent>
            {success ? (
              <div className="space-y-4 text-center">
                <div className="text-green-600 text-lg font-semibold">Registration Successful!</div>
                <div className="text-[#001f23]/70 space-y-2">
                  <p>A confirmation email has been sent to your email address.</p>
                  <p className="font-semibold">Please confirm your email to continue.</p>
                </div>
                <Link href="/auth/login">
                  <Button className="w-full mt-4">Go to Sign In</Button>
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {error && (
                <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                  {error}
                </div>
              )}

              {/* Username Field */}
              <div className="space-y-2">
                <label htmlFor="username" className="text-sm font-medium">
                  Username
                </label>
                <Input
                  id="username"
                  placeholder="Enter your username"
                  disabled={isLoading}
                  {...register('username')}
                />
                {errors.username && (
                  <p className="text-xs text-destructive">{errors.username.message}</p>
                )}
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  disabled={isLoading}
                  {...register('email')}
                />
                {errors.email && (
                  <p className="text-xs text-destructive">{errors.email.message}</p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  disabled={isLoading}
                  {...register('password')}
                />
                {errors.password && (
                  <p className="text-xs text-destructive">{errors.password.message}</p>
                )}
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="text-sm font-medium">
                  Confirm Password
                </label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  disabled={isLoading}
                  {...register('confirmPassword')}
                />
                {errors.confirmPassword && (
                  <p className="text-xs text-destructive">{errors.confirmPassword.message}</p>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? 'Creating account...' : 'Create Account'}
              </Button>

                {/* Link to Login */}
                <p className="text-center text-sm text-[#001f23]/70">
                  Already have an account?{' '}
                  <Link href="/auth/login" className="text-[#001f23] font-semibold hover:underline">
                    Sign in
                  </Link>
                </p>
              </form>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
