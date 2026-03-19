'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { COUNTRY_CODES } from '@/lib/utils/country-codes'

export default function RegisterPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [countryCode, setCountryCode] = useState('+1')
  const [country, setCountry] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [showCountries, setShowCountries] = useState(false)
  const supabase = createClient()

  const filteredCountries = COUNTRY_CODES.filter(
    (item) =>
      item.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.code.includes(searchTerm)
  )

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Validate all fields
      if (!email || !password || !fullName || !phoneNumber || !country || !countryCode) {
        throw new Error('Please fill in all fields')
      }

      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters')
      }

      // Create auth account
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      })

      if (authError) throw authError
      if (!authData.user) throw new Error('Registration failed')

      // Combine country code with phone (remove + sign)
      const cleanCountryCode = countryCode.replace('+', '')
      const fullPhone = `${cleanCountryCode}${phoneNumber}`

      // Create user record
      const { error: dbError } = await supabase.from('users').insert([
        {
          id: authData.user.id,
          email,
          full_name: fullName,
          phone_number: fullPhone,
          country,
          payment_status: 'pending',
          account_status: 'inactive',
        },
      ])

      if (dbError) throw dbError

      toast.success('Registration Successful!', {
        description: 'Please check your email to confirm your account.',
      })

      // Redirect after 2 seconds
      setTimeout(() => {
        router.push('/auth/login')
      }, 2000)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Registration failed'
      toast.error('Registration Error', { description: message })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#B8F663] via-[#59E4A0] to-[#00D3D8] flex items-center justify-center px-4 py-8">
      <Card className="w-full max-w-md border-0 shadow-lg bg-white/95">
        <CardHeader className="space-y-2">
          <div className="flex items-center gap-2">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202026-03-06%20at%201.07.27%20AM-diCisn1VGmxmGniWtuT9XA85Ahzqh0.jpeg"
              alt="Handshake"
              className="w-8 h-8 rounded"
            />
            <span className="text-xl font-bold text-[#001f23]">Handshake</span>
          </div>
          <CardTitle className="text-2xl text-[#001f23]">Create Account</CardTitle>
          <CardDescription className="text-sm">Sign up to access verified Handshake accounts</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="text-xs font-medium text-[#001f23]">Email</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                disabled={isLoading}
                className="mt-1 bg-white border-[#001f23]/20"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-[#001f23]">Password</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min 6 characters"
                disabled={isLoading}
                className="mt-1 bg-white border-[#001f23]/20"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-[#001f23]">Full Name</label>
              <Input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="John Doe"
                disabled={isLoading}
                className="mt-1 bg-white border-[#001f23]/20"
              />
            </div>

            <div className="flex gap-2">
              <div className="w-24">
                <label className="text-xs font-medium text-[#001f23]">Country Code</label>
                <select
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  disabled={isLoading}
                  className="w-full mt-1 px-2 py-2 text-xs bg-white border border-[#001f23]/20 rounded-md text-[#001f23]"
                >
                  {COUNTRY_CODES.map((item) => (
                    <option key={item.code} value={item.code}>
                      {item.code}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex-1">
                <label className="text-xs font-medium text-[#001f23]">Phone Number</label>
                <Input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="766058154"
                  disabled={isLoading}
                  className="mt-1 bg-white border-[#001f23]/20"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-[#001f23]">Country</label>
              <div className="relative">
                <Input
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  onClick={() => setShowCountries(!showCountries)}
                  placeholder="Select country"
                  disabled={isLoading}
                  className="mt-1 bg-white border-[#001f23]/20 cursor-pointer"
                  readOnly
                />
                {showCountries && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#001f23]/20 rounded-md shadow-lg z-10 max-h-48 overflow-y-auto">
                    <Input
                      type="text"
                      placeholder="Search countries..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="sticky top-0 m-1 text-xs border-[#001f23]/20"
                    />
                    {filteredCountries.map((item) => (
                      <button
                        key={item.country}
                        type="button"
                        onClick={() => {
                          setCountry(item.country)
                          setShowCountries(false)
                          setSearchTerm('')
                        }}
                        className="w-full text-left px-3 py-2 text-xs hover:bg-[#B8F663]/20 text-[#001f23]"
                      >
                        {item.country}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#001f23] text-white hover:bg-[#001f23]/90 py-2"
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>

          <p className="text-center text-xs text-[#001f23]/70 mt-4">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-[#001f23] font-semibold hover:underline">
              Sign In
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
