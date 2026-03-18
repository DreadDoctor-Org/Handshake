import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/server'

export const metadata = {
  title: 'Account Verified - Handshake',
  description: 'Your Handshake account has been verified and is ready to use.',
}

export default async function VerifiedPage() {
  const supabase = createClient()
  
  const { data: authData } = await supabase.auth.getUser()
  
  if (!authData.user) {
    redirect('/auth/login')
  }

  const { data: userData } = await supabase
    .from('users')
    .select('*')
    .eq('id', authData.user.id)
    .single()

  if (!userData || userData.account_status !== 'active') {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#B8F663] via-[#59E4A0] to-[#00D3D8] flex flex-col">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-4 md:px-6 py-3 md:py-4">
        <Link href="/dashboard" className="flex items-center gap-2 md:gap-3">
          <img
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202026-03-06%20at%201.07.27%20AM-diCisn1VGmxmGniWtuT9XA85Ahzqh0.jpeg"
            alt="Handshake"
            className="w-7 md:w-8 h-7 md:h-8 rounded"
          />
          <span className="text-lg md:text-2xl font-bold text-[#001f23]">Handshake</span>
        </Link>
      </nav>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-2xl space-y-6">
          {/* Success Card */}
          <Card className="border-0 shadow-xl bg-white/97 backdrop-blur">
            <CardHeader className="text-center pb-6 md:pb-8">
              <div className="mx-auto mb-4 md:mb-6">
                <div className="w-20 md:w-24 h-20 md:h-24 rounded-full bg-green-100 flex items-center justify-center mx-auto">
                  <span className="text-5xl md:text-6xl">✓</span>
                </div>
              </div>
              <CardTitle className="text-2xl md:text-4xl text-green-700 text-center">Account Verified!</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 md:space-y-8">
              {/* User Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-[#001f23]/5 rounded-lg border border-[#001f23]/10">
                  <p className="text-xs md:text-sm text-[#001f23]/70 mb-1">Full Name</p>
                  <p className="text-sm md:text-base font-semibold text-[#001f23]">{userData.full_name || 'User'}</p>
                </div>
                <div className="p-4 bg-[#001f23]/5 rounded-lg border border-[#001f23]/10">
                  <p className="text-xs md:text-sm text-[#001f23]/70 mb-1">Email</p>
                  <p className="text-sm md:text-base font-semibold text-[#001f23] break-all">{userData.email}</p>
                </div>
                <div className="p-4 bg-[#001f23]/5 rounded-lg border border-[#001f23]/10">
                  <p className="text-xs md:text-sm text-[#001f23]/70 mb-1">Country</p>
                  <p className="text-sm md:text-base font-semibold text-[#001f23]">{userData.country || 'Not set'}</p>
                </div>
                <div className="p-4 bg-[#001f23]/5 rounded-lg border border-[#001f23]/10">
                  <p className="text-xs md:text-sm text-[#001f23]/70 mb-1">Account Status</p>
                  <p className="text-sm md:text-base font-semibold text-green-700">Active</p>
                </div>
              </div>

              {/* Success Message */}
              <Card className="border-0 bg-green-50">
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    <h3 className="font-semibold text-[#001f23] md:text-lg">Congratulations!</h3>
                    <p className="text-sm md:text-base text-[#001f23] leading-relaxed">
                      Your account has been successfully verified and is now fully active. You can now access all features and opportunities globally.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Features */}
              <Card className="border-0 bg-blue-50">
                <CardHeader>
                  <CardTitle className="text-sm md:text-base text-blue-700">Your Account Includes:</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex gap-2 md:gap-3 text-xs md:text-sm text-[#001f23]">
                      <span className="text-green-600 font-bold">✓</span>
                      <span>Full access to verified handshake accounts</span>
                    </li>
                    <li className="flex gap-2 md:gap-3 text-xs md:text-sm text-[#001f23]">
                      <span className="text-green-600 font-bold">✓</span>
                      <span>Global task opportunities</span>
                    </li>
                    <li className="flex gap-2 md:gap-3 text-xs md:text-sm text-[#001f23]">
                      <span className="text-green-600 font-bold">✓</span>
                      <span>Professional annotation training access</span>
                    </li>
                    <li className="flex gap-2 md:gap-3 text-xs md:text-sm text-[#001f23]">
                      <span className="text-green-600 font-bold">✓</span>
                      <span>Verified account security and support</span>
                    </li>
                    <li className="flex gap-2 md:gap-3 text-xs md:text-sm text-[#001f23]">
                      <span className="text-green-600 font-bold">✓</span>
                      <span>Full refund guarantee within 14 days</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                <Link href="/dashboard" className="flex-1">
                  <Button className="w-full bg-[#001f23] text-white hover:bg-[#001f23]/90 text-sm md:text-base py-2 md:py-3" size="lg">
                    Go to Dashboard
                  </Button>
                </Link>
                <Link href="/" className="flex-1">
                  <Button variant="outline" className="w-full border-[#001f23] text-[#001f23] hover:bg-[#001f23]/10 text-sm md:text-base py-2 md:py-3" size="lg">
                    Return Home
                  </Button>
                </Link>
              </div>

              {/* Support Info */}
              <Card className="border-0 bg-[#001f23]/5">
                <CardContent className="pt-6">
                  <p className="text-xs md:text-sm text-center text-[#001f23]/70">
                    Need help? Contact our admin team at{' '}
                    <span className="font-semibold text-[#001f23]">handshake.ai@outlook.com</span>
                  </p>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-4 md:py-6 text-[#001f23]/70 text-xs md:text-sm">
        <p>&copy; {new Date().getFullYear()} Handshake. All rights reserved.</p>
      </footer>
    </div>
  )
}
