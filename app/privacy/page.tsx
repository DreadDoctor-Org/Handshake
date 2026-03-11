'use client'

import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import { Card } from '@/components/ui/card'

export const metadata = {
  title: 'Privacy Policy - Handshake AI',
  description: 'Privacy Policy for Handshake AI. Learn how we collect, use, and protect your personal data.',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-[#B8F663] via-[#59E4A0] to-[#00D3D8] py-12 md:py-16">
          <div className="max-w-7xl mx-auto px-4 md:px-6 text-center space-y-4">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-[#001f23] text-balance">
              Privacy Policy
            </h1>
            <p className="text-lg md:text-xl text-[#001f23]/80 max-w-3xl mx-auto">
              Handshake AI – Commitment to Data Protection
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
                At Handshake AI, we are committed to protecting your privacy and ensuring you have a positive experience on our platform. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services.
              </p>
            </Card>

            {/* Information We Collect */}
            <Card className="border-0 shadow-lg bg-white/95 backdrop-blur p-6 md:p-8 space-y-4">
              <h2 className="text-2xl md:text-3xl font-bold text-[#001f23]">2. Information We Collect</h2>
              <div className="space-y-4 text-[#001f23]/80">
                <p className="text-base md:text-lg leading-relaxed">
                  We collect information in the following ways:
                </p>
                <div className="ml-4 space-y-3">
                  <div>
                    <h3 className="font-semibold text-[#001f23] mb-1">Personal Information</h3>
                    <p className="text-base md:text-lg">Email address, username, password hash, and optional profile information</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#001f23] mb-1">Account Details</h3>
                    <p className="text-base md:text-lg">Login credentials and account activity logs</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#001f23] mb-1">Location Data</h3>
                    <p className="text-base md:text-lg">Country information derived from IP address for user segmentation</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#001f23] mb-1">Website Usage Data</h3>
                    <p className="text-base md:text-lg">Pages visited, time spent, click patterns, and device information for analytics</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#001f23] mb-1">Transaction Information</h3>
                    <p className="text-base md:text-lg">Payment method, transaction ID, and payment status</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* How We Use Information */}
            <Card className="border-0 shadow-lg bg-white/95 backdrop-blur p-6 md:p-8 space-y-4">
              <h2 className="text-2xl md:text-3xl font-bold text-[#001f23]">3. How We Use Information</h2>
              <div className="space-y-3 text-[#001f23]/80">
                <p className="text-base md:text-lg leading-relaxed">
                  We use the information we collect for the following purposes:
                </p>
                <ul className="space-y-2 ml-4">
                  <li className="text-base md:text-lg">• Account management and user authentication</li>
                  <li className="text-base md:text-lg">• Processing and verifying payments</li>
                  <li className="text-base md:text-lg">• Providing personalized training and support</li>
                  <li className="text-base md:text-lg">• Improving platform features and user experience</li>
                  <li className="text-base md:text-lg">• Communicating with you about your account and services</li>
                  <li className="text-base md:text-lg">• Ensuring platform security and preventing fraud</li>
                  <li className="text-base md:text-lg">• Analyzing usage patterns for service improvement</li>
                </ul>
              </div>
            </Card>

            {/* Data Protection */}
            <Card className="border-0 shadow-lg bg-white/95 backdrop-blur p-6 md:p-8 space-y-4">
              <h2 className="text-2xl md:text-3xl font-bold text-[#001f23]">4. Data Protection</h2>
              <p className="text-base md:text-lg text-[#001f23]/80 leading-relaxed">
                We implement reasonable and appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction. All sensitive information is encrypted and stored securely. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
              </p>
            </Card>

            {/* Data Sharing */}
            <Card className="border-0 shadow-lg bg-white/95 backdrop-blur p-6 md:p-8 space-y-4">
              <h2 className="text-2xl md:text-3xl font-bold text-[#001f23]">5. Data Sharing</h2>
              <div className="space-y-4 text-[#001f23]/80">
                <p className="text-base md:text-lg leading-relaxed">
                  We are committed to your privacy and do not sell your personal information to third parties. We may share your information only in the following circumstances:
                </p>
                <ul className="space-y-2 ml-4">
                  <li className="text-base md:text-lg">• With our team members who require access for account management</li>
                  <li className="text-base md:text-lg">• With trusted service providers who assist in platform operations</li>
                  <li className="text-base md:text-lg">• When required by law or legal process</li>
                  <li className="text-base md:text-lg">• To prevent fraud, unauthorized access, or other illegal activities</li>
                </ul>
              </div>
            </Card>

            {/* Cookies and Analytics */}
            <Card className="border-0 shadow-lg bg-white/95 backdrop-blur p-6 md:p-8 space-y-4">
              <h2 className="text-2xl md:text-3xl font-bold text-[#001f23]">6. Cookies and Analytics</h2>
              <div className="space-y-4 text-[#001f23]/80">
                <p className="text-base md:text-lg leading-relaxed">
                  Our website uses cookies and analytics tools to enhance user experience and gather usage insights. You can control cookie preferences in your browser settings. We also use Google Analytics to understand how visitors interact with our platform.
                </p>
              </div>
            </Card>

            {/* User Rights */}
            <Card className="border-0 shadow-lg bg-white/95 backdrop-blur p-6 md:p-8 space-y-4">
              <h2 className="text-2xl md:text-3xl font-bold text-[#001f23]">7. User Rights</h2>
              <div className="space-y-3 text-[#001f23]/80">
                <p className="text-base md:text-lg leading-relaxed">
                  You have the right to:
                </p>
                <ul className="space-y-2 ml-4">
                  <li className="text-base md:text-lg">• Access your personal data held by us</li>
                  <li className="text-base md:text-lg">• Request correction of inaccurate information</li>
                  <li className="text-base md:text-lg">• Request deletion of your account and associated data</li>
                  <li className="text-base md:text-lg">• Opt-out of promotional communications</li>
                  <li className="text-base md:text-lg">• Request information about how your data is used</li>
                </ul>
              </div>
            </Card>

            {/* Data Retention */}
            <Card className="border-0 shadow-lg bg-white/95 backdrop-blur p-6 md:p-8 space-y-4">
              <h2 className="text-2xl md:text-3xl font-bold text-[#001f23]">8. Data Retention</h2>
              <p className="text-base md:text-lg text-[#001f23]/80 leading-relaxed">
                We retain your personal data for as long as necessary to provide our services and fulfill the purposes outlined in this Privacy Policy. You can request deletion of your data at any time, subject to legal and operational requirements.
              </p>
            </Card>

            {/* Third-Party Links */}
            <Card className="border-0 shadow-lg bg-white/95 backdrop-blur p-6 md:p-8 space-y-4">
              <h2 className="text-2xl md:text-3xl font-bold text-[#001f23]">9. Third-Party Links</h2>
              <p className="text-base md:text-lg text-[#001f23]/80 leading-relaxed">
                Our website may contain links to third-party websites. We are not responsible for the privacy practices of these external sites. We encourage you to review their privacy policies before providing any personal information.
              </p>
            </Card>

            {/* Children's Privacy */}
            <Card className="border-0 shadow-lg bg-white/95 backdrop-blur p-6 md:p-8 space-y-4">
              <h2 className="text-2xl md:text-3xl font-bold text-[#001f23]">10. Children's Privacy</h2>
              <p className="text-base md:text-lg text-[#001f23]/80 leading-relaxed">
                Handshake AI is not intended for users under 18 years of age. We do not knowingly collect personal information from children. If we become aware of data collection from a minor, we will delete it immediately.
              </p>
            </Card>

            {/* Policy Updates */}
            <Card className="border-0 shadow-lg bg-white/95 backdrop-blur p-6 md:p-8 space-y-4">
              <h2 className="text-2xl md:text-3xl font-bold text-[#001f23]">11. Updates to Privacy Policy</h2>
              <p className="text-base md:text-lg text-[#001f23]/80 leading-relaxed">
                We may update this Privacy Policy periodically to reflect changes in our practices or legal requirements. We will notify you of any material changes by posting the updated policy on our website. Your continued use of the platform constitutes acceptance of the updated Privacy Policy.
              </p>
            </Card>

            {/* Contact Information */}
            <Card className="border-0 shadow-lg bg-gradient-to-r from-[#B8F663] to-[#59E4A0] p-6 md:p-8 space-y-4">
              <h2 className="text-2xl md:text-3xl font-bold text-[#001f23]">12. Contact Information</h2>
              <p className="text-base md:text-lg text-[#001f23] leading-relaxed">
                For privacy-related questions or to exercise your data rights, please contact us at:
              </p>
              <p className="text-lg font-semibold text-[#001f23]">
                handshake.ai@outlook.com
              </p>
            </Card>

            {/* Acknowledgement */}
            <Card className="border-0 shadow-lg bg-white/95 backdrop-blur p-6 md:p-8 space-y-4">
              <h3 className="text-lg font-semibold text-[#001f23]">By using Handshake AI, you acknowledge that you have read and agree to this Privacy Policy.</h3>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
