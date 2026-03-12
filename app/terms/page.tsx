import type { Metadata } from 'next'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import { Card } from '@/components/ui/card'

export const metadata: Metadata = {
  title: 'Terms of Service - Handshake AI',
  description: 'Terms of Service for Handshake AI. Read about our policies, payment terms, and user responsibilities.',
}

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-[#B8F663] via-[#59E4A0] to-[#00D3D8] py-12 md:py-16">
          <div className="max-w-7xl mx-auto px-4 md:px-6 text-center space-y-4">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-[#001f23] text-balance">
              Terms of Service
            </h1>
            <p className="text-lg md:text-xl text-[#001f23]/80 max-w-3xl mx-auto">
              Handshake AI – Annotation Training and Verified Accounts
            </p>
            <p className="text-sm md:text-base text-[#001f23]/70">
              Last Updated: {new Date().toLocaleDateString()}
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-16">
          <div className="space-y-8">
            {/* Introduction */}
            <Card className="border-0 shadow-lg bg-white/95 backdrop-blur p-6 md:p-8 space-y-4">
              <h2 className="text-2xl md:text-3xl font-bold text-[#001f23]">1. Introduction</h2>
              <p className="text-base md:text-lg text-[#001f23]/80 leading-relaxed">
                Welcome to Handshake AI. These Terms of Service ("Terms") govern your use of our website, platform, and services. By accessing or using Handshake AI, you agree to comply with these Terms. If you do not agree, please do not use our services.
              </p>
            </Card>

            {/* Eligibility */}
            <Card className="border-0 shadow-lg bg-white/95 backdrop-blur p-6 md:p-8 space-y-4">
              <h2 className="text-2xl md:text-3xl font-bold text-[#001f23]">2. Eligibility and User Responsibilities</h2>
              <div className="space-y-3 text-[#001f23]/80">
                <p className="text-base md:text-lg leading-relaxed">
                  By registering with Handshake AI, you confirm that you are at least 18 years old and capable of entering into legal agreements. You are responsible for:
                </p>
                <ul className="space-y-2 ml-4">
                  <li className="text-base md:text-lg">• Providing accurate and truthful information during registration</li>
                  <li className="text-base md:text-lg">• Maintaining the confidentiality of your account credentials</li>
                  <li className="text-base md:text-lg">• Notifying us immediately of unauthorized access</li>
                  <li className="text-base md:text-lg">• Using the platform only for legitimate purposes</li>
                </ul>
              </div>
            </Card>

            {/* Account Registration */}
            <Card className="border-0 shadow-lg bg-white/95 backdrop-blur p-6 md:p-8 space-y-4">
              <h2 className="text-2xl md:text-3xl font-bold text-[#001f23]">3. Account Registration</h2>
              <div className="space-y-3 text-[#001f23]/80">
                <p className="text-base md:text-lg leading-relaxed">
                  You must register with a valid email address and create a secure password. You agree to:
                </p>
                <ul className="space-y-2 ml-4">
                  <li className="text-base md:text-lg">• Keep your account information current and accurate</li>
                  <li className="text-base md:text-lg">• Not share your login credentials with others</li>
                  <li className="text-base md:text-lg">• Confirm your email address before accessing premium features</li>
                  <li className="text-base md:text-lg">• Be responsible for all activities under your account</li>
                </ul>
              </div>
            </Card>

            {/* Payments and Purchases */}
            <Card className="border-0 shadow-lg bg-white/95 backdrop-blur p-6 md:p-8 space-y-4">
              <h2 className="text-2xl md:text-3xl font-bold text-[#001f23]">4. Payments and Purchases</h2>
              <div className="space-y-4 text-[#001f23]/80">
                <p className="text-base md:text-lg leading-relaxed">
                  Payment is required for annotation training and verified account purchase. By completing a payment transaction, you acknowledge and agree to the following:
                </p>
                <div className="ml-4 space-y-3">
                  <div>
                    <h3 className="font-semibold text-[#001f23] mb-1">Payment Amount</h3>
                    <p className="text-base md:text-lg">The required payment amount is $50 USD (USDT on Tron network).</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#001f23] mb-1">Payment Method</h3>
                    <p className="text-base md:text-lg">We accept cryptocurrency payments via Tron blockchain for maximum security and privacy.</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#001f23] mb-1">After Payment and Verification</h3>
                    <p className="text-base md:text-lg">Upon successful payment verification by our admin team, you will receive verified accounts ready for tasking.</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#001f23] mb-1">Refundable-Payment</h3>
                    <p className="text-base md:text-lg">30-Day Money back guarantee</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Acceptable Use */}
            <Card className="border-0 shadow-lg bg-white/95 backdrop-blur p-6 md:p-8 space-y-4">
              <h2 className="text-2xl md:text-3xl font-bold text-[#001f23]">5. Acceptable Use</h2>
              <div className="space-y-3 text-[#001f23]/80">
                <p className="text-base md:text-lg leading-relaxed">
                  You agree not to use our platform for:
                </p>
                <ul className="space-y-2 ml-4">
                  <li className="text-base md:text-lg">• Illegal activities or violating any applicable laws</li>
                  <li className="text-base md:text-lg">• Harassment, abuse, or threatening behavior towards others</li>
                  <li className="text-base md:text-lg">• Distributing malware, spam, or unauthorized content</li>
                  <li className="text-base md:text-lg">• Attempting to breach security or access unauthorized areas</li>
                  <li className="text-base md:text-lg">• Fraudulent or deceptive activities</li>
                </ul>
              </div>
            </Card>

            {/* Account Suspension */}
            <Card className="border-0 shadow-lg bg-white/95 backdrop-blur p-6 md:p-8 space-y-4">
              <h2 className="text-2xl md:text-3xl font-bold text-[#001f23]">6. Account Suspension or Termination</h2>
              <p className="text-base md:text-lg text-[#001f23]/80 leading-relaxed">
                We reserve the right to suspend or terminate your account if you violate these Terms, engage in fraudulent activities, or pose a threat to our platform. Termination will result in loss of access to all services and forfeiture of any pending benefits.
              </p>
            </Card>

            {/* Limitation of Liability */}
            <Card className="border-0 shadow-lg bg-white/95 backdrop-blur p-6 md:p-8 space-y-4">
              <h2 className="text-2xl md:text-3xl font-bold text-[#001f23]">7. Limitation of Liability</h2>
              <p className="text-base md:text-lg text-[#001f23]/80 leading-relaxed">
                Handshake AI is provided "as is" without warranties. We are not liable for any indirect, incidental, or consequential damages arising from your use of the platform. Our total liability shall not exceed the amount you paid for our services.
              </p>
            </Card>

            {/* Updates to Terms */}
            <Card className="border-0 shadow-lg bg-white/95 backdrop-blur p-6 md:p-8 space-y-4">
              <h2 className="text-2xl md:text-3xl font-bold text-[#001f23]">8. Updates to Terms</h2>
              <p className="text-base md:text-lg text-[#001f23]/80 leading-relaxed">
                We reserve the right to update these Terms at any time. Changes will be effective immediately upon posting. Your continued use of the platform constitutes acceptance of updated Terms.
              </p>
            </Card>

            {/* Contact Information */}
            <Card className="border-0 shadow-lg bg-gradient-to-r from-[#B8F663] to-[#59E4A0] p-6 md:p-8 space-y-4">
              <h2 className="text-2xl md:text-3xl font-bold text-[#001f23]">9. Contact Information</h2>
              <p className="text-base md:text-lg text-[#001f23] leading-relaxed">
                For questions about these Terms, please contact us at:
              </p>
              <p className="text-lg font-semibold text-[#001f23]">
                handshake.ai@outlook.com
              </p>
            </Card>

            {/* Acknowledgement */}
            <Card className="border-0 shadow-lg bg-white/95 backdrop-blur p-6 md:p-8 space-y-4">
              <h3 className="text-lg font-semibold text-[#001f23]">By using Handshake AI, you acknowledge that you have read and agree to these Terms of Service.</h3>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
