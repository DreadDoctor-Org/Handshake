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
import { COUNTRY_CODES } from '@/lib/utils/country-codes'
import { useState as useSearchState } from 'react'

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [showCountries, setShowCountries] = useState(false)
  const supabase = createClient()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
  })

  const selectedCountryCode = watch('countryCode')

  const filteredCountries = COUNTRY_CODES.filter(
    (item) =>
      item.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.code.includes(searchTerm)
  )

  const onSubmit = async (data: RegisterSchema) => {
    setIsLoading(true)
    setError(null)

    try {
      // Get user's country from IP address
      let userCountry = 'Unknown'
      try {
        const ipResponse = await fetch('https://ipapi.co/json/')
        const ipData = await ipResponse.json()
        userCountry = ipData.country_name || 'Unknown'
      } catch (geoError) {
        console.error('Geolocation fetch error:', geoError)
      }

      // Combine first and last name
      const fullName = `${data.firstName} ${data.lastName}`
      const phoneWithCode = `${data.countryCode}${data.phoneNumber}`

      // Sign up with Supabase Auth
      const { error: authError, data: authData } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/login`,
          data: {
            fullName: fullName,
            phoneNumber: phoneWithCode,
            country: userCountry,
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
      <nav className="flex items-center justify-between px-4 md:px-6 py-3 md:py-4">
        <Link href="/" className="flex items-center gap-2 md:gap-3">
          <img
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202026-03-06%20at%201.07.27%20AM-diCisn1VGmxmGniWtuT9XA85Ahzqh0.jpeg"
            alt="Handshake"
            className="w-7 md:w-8 h-7 md:h-8 rounded"
          />
          <span className="text-lg md:text-2xl font-bold text-[#001f23]">Handshake</span>
        </Link>
      </nav>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-6 md:py-12">
        <Card className="w-full max-w-md border-0 shadow-lg">
          <CardHeader className="pb-3 md:pb-4">
            <CardTitle className="text-lg md:text-2xl text-[#001f23]">Create Account</CardTitle>
            <CardDescription className="text-xs md:text-sm text-[#001f23]/70">
              Register to access international payment services
            </CardDescription>
          </CardHeader>
          <CardContent>
            {success ? (
              <div className="space-y-4 text-center">
                <div className="text-green-600 text-base md:text-lg font-semibold">Registration Successful!</div>
                <div className="text-[#001f23]/70 space-y-2 text-xs md:text-sm">
                  <p>A confirmation email has been sent to your email address.</p>
                  <p className="font-semibold">Please confirm your email to continue.</p>
                </div>
                <Link href="/auth/login">
                  <Button className="w-full mt-4">Go to Sign In</Button>
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                {error && (
                  <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-xs md:text-sm">
                    {error}
                  </div>
                )}

                {/* First Name Field */}
                <div className="space-y-1">
                  <label htmlFor="firstName" className="text-xs md:text-sm font-medium">
                    First Name
                  </label>
                  <Input
                    id="firstName"
                    placeholder="Enter your first name"
                    disabled={isLoading}
                    className="text-xs md:text-sm"
                    {...register('firstName')}
                  />
                  {errors.firstName && (
                    <p className="text-xs text-destructive">{errors.firstName.message}</p>
                  )}
                </div>

                {/* Last Name Field */}
                <div className="space-y-1">
                  <label htmlFor="lastName" className="text-xs md:text-sm font-medium">
                    Last Name
                  </label>
                  <Input
                    id="lastName"
                    placeholder="Enter your last name"
                    disabled={isLoading}
                    className="text-xs md:text-sm"
                    {...register('lastName')}
                  />
                  {errors.lastName && (
                    <p className="text-xs text-destructive">{errors.lastName.message}</p>
                  )}
                </div>

                {/* Phone Number with Country Code */}
                <div className="space-y-1">
                  <label htmlFor="phone" className="text-xs md:text-sm font-medium">
                    Mobile Number
                  </label>
                  <div className="flex gap-2">
                    {/* Country Code Dropdown */}
                    <div className="relative w-32">
                      <button
                        type="button"
                        onClick={() => setShowCountries(!showCountries)}
                        className="w-full px-2 md:px-3 py-2 text-xs md:text-sm border border-input rounded-md bg-white hover:bg-accent flex items-center justify-between"
                      >
                        <span>{selectedCountryCode || 'Select code'}</span>
                        <span className="text-xs">▼</span>
                      </button>
                      {showCountries && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-input rounded-md shadow-lg z-50 max-h-48 overflow-y-auto">
                          <input
                            type="text"
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-2 py-1 text-xs border-b border-input sticky top-0 bg-white"
                          />
                          {filteredCountries.map((item, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => {
                                setValue('countryCode', item.code)
                                setShowCountries(false)
                                setSearchTerm('')
                              }}
                              className="w-full text-left px-2 py-2 text-xs md:text-sm hover:bg-accent flex items-center gap-2"
                            >
                              <span>{item.flag}</span>
                              <span>{item.code}</span>
                              <span className="text-xs text-muted-foreground">{item.country}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    {/* Phone Number Input */}
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="1234567890"
                      disabled={isLoading}
                      className="flex-1 text-xs md:text-sm"
                      {...register('phoneNumber')}
                    />
                  </div>
                  {errors.countryCode && (
                    <p className="text-xs text-destructive">{errors.countryCode.message}</p>
                  )}
                  {errors.phoneNumber && (
                    <p className="text-xs text-destructive">{errors.phoneNumber.message}</p>
                  )}
                </div>

                {/* Email Field */}
                <div className="space-y-1">
                  <label htmlFor="email" className="text-xs md:text-sm font-medium">
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    disabled={isLoading}
                    className="text-xs md:text-sm"
                    {...register('email')}
                  />
                  {errors.email && (
                    <p className="text-xs text-destructive">{errors.email.message}</p>
                  )}
                </div>

                {/* Password Field */}
                <div className="space-y-1">
                  <label htmlFor="password" className="text-xs md:text-sm font-medium">
                    Password
                  </label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Min 8 characters"
                    disabled={isLoading}
                    className="text-xs md:text-sm"
                    {...register('password')}
                  />
                  {errors.password && (
                    <p className="text-xs text-destructive">{errors.password.message}</p>
                  )}
                </div>

                {/* Confirm Password Field */}
                <div className="space-y-1">
                  <label htmlFor="confirmPassword" className="text-xs md:text-sm font-medium">
                    Confirm Password
                  </label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    disabled={isLoading}
                    className="text-xs md:text-sm"
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
                <p className="text-center text-xs md:text-sm text-[#001f23]/70">
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

      {/* Footer */}
      <footer className="text-center py-4 md:py-6 text-[#001f23]/70 text-xs md:text-sm">
        <p>&copy; {new Date().getFullYear()} Handshake. All rights reserved.</p>
      </footer>
    </div>
  )
}
