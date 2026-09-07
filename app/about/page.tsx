import type { Metadata } from 'next'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import { Card } from '@/components/ui/card'

export const metadata: Metadata = {
  title: 'About Handshake AI - Empowering Global Workers',
  description: 'Learn about Handshake AI, our mission to provide verified accounts and annotation training opportunities for global workers.',
}

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-[#B8F663] via-[#59E4A0] to-[#00D3D8] py-12 md:py-16">
          <div className="max-w-7xl mx-auto px-4 md:px-6 text-center space-y-4">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-[#001f23] text-balance">
              About Handshake AI
            </h1>
            <p className="text-lg md:text-xl text-[#001f23]/80 max-w-3xl mx-auto">
              Empowering Global Workers Through Annotation Opportunities
            </p>
          </div>
        </section>

        {/* Content Sections */}
        <section className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-16 space-y-12">
          {/* Who We Are */}
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <h2 className="text-2xl md:text-4xl font-bold text-[#001f23]">Who We Are</h2>
              <p className="text-base md:text-lg text-[#001f23]/80 leading-relaxed">
                Handshake AI is operated by the Handshake AI Official Team, dedicated to enabling international contributors to access annotation and online task platforms. We believe in transparency, security, and fair compensation for all our users worldwide.
              </p>
              <p className="text-base md:text-lg text-[#001f23]/80 leading-relaxed">
                Our platform has been designed with trust at its core, ensuring every user can confidently complete their journey from registration to verified account activation.
              </p>
            </div>
            <Card className="border-0 shadow-lg bg-white/95 backdrop-blur p-6 md:p-8 space-y-4">
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-[#001f23]">Our Values</h3>
                <ul className="space-y-2">
                  <li className="flex gap-3">
                    <span className="text-xl text-[#59E4A0] flex-shrink-0">✓</span>
                    <span className="text-[#001f23]">Transparency in all operations</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-xl text-[#59E4A0] flex-shrink-0">✓</span>
                    <span className="text-[#001f23]">Security and data protection</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-xl text-[#59E4A0] flex-shrink-0">✓</span>
                    <span className="text-[#001f23]">Fair and equal opportunities</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-xl text-[#59E4A0] flex-shrink-0">✓</span>
                    <span className="text-[#001f23]">Global accessibility</span>
                  </li>
                </ul>
              </div>
            </Card>
          </div>

          {/* What We Offer */}
          <div className="space-y-6">
            <h2 className="text-2xl md:text-4xl font-bold text-[#001f23]">What We Offer</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="border-0 shadow-lg bg-white/95 backdrop-blur p-6 space-y-3">
                <div className="text-3xl">📚</div>
                <h3 className="text-lg font-semibold text-[#001f23]">Annotation Training</h3>
                <p className="text-sm text-[#001f23]/70">Comprehensive training programs to master annotation tasks</p>
              </Card>
              <Card className="border-0 shadow-lg bg-white/95 backdrop-blur p-6 space-y-3">
                <div className="text-3xl">✓</div>
                <h3 className="text-lg font-semibold text-[#001f23]">Verified Accounts</h3>
                <p className="text-sm text-[#001f23]/70">Verified accounts ready for immediate tasking</p>
              </Card>
              <Card className="border-0 shadow-lg bg-white/95 backdrop-blur p-6 space-y-3">
                <div className="text-3xl">🌐</div>
                <h3 className="text-lg font-semibold text-[#001f23]">Global Access</h3>
                <p className="text-sm text-[#001f23]/70">Opportunities for workers from around the world</p>
              </Card>
              <Card className="border-0 shadow-lg bg-white/95 backdrop-blur p-6 space-y-3">
                <div className="text-3xl">🤝</div>
                <h3 className="text-lg font-semibold text-[#001f23]">Dedicated Support</h3>
                <p className="text-sm text-[#001f23]/70">24/7 support for account and platform guidance</p>
              </Card>
            </div>
          </div>

          {/* Mission */}
          <Card className="border-0 shadow-lg bg-gradient-to-r from-[#B8F663] to-[#59E4A0] p-8 md:p-12 space-y-4">
            <h2 className="text-2xl md:text-3xl font-bold text-[#001f23]">Our Mission</h2>
            <p className="text-base md:text-lg text-[#001f23] leading-relaxed">
              To empower global workers by providing transparent, secure, and accessible pathways to annotation training and verified task-ready accounts. We are committed to building trust through clear communication, fair pricing, and exceptional customer support.
            </p>
          </Card>

          {/* Why Choose Us */}
          <div className="space-y-6">
            <h2 className="text-2xl md:text-4xl font-bold text-[#001f23]">Why Choose Handshake AI</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-[#001f23] flex items-center gap-2">
                  <span className="text-2xl">✓</span> Verified Task-Ready Accounts
                </h3>
                <p className="text-[#001f23]/80">All accounts are verified by our team before activation</p>
              </div>
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-[#001f23] flex items-center gap-2">
                  <span className="text-2xl">✓</span> Global Accessibility
                </h3>
                <p className="text-[#001f23]/80">Serve workers from all corners of the world</p>
              </div>
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-[#001f23] flex items-center gap-2">
                  <span className="text-2xl">✓</span> Comprehensive Training
                </h3>
                <p className="text-[#001f23]/80">Detailed training resources to ensure your success</p>
              </div>
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-[#001f23] flex items-center gap-2">
                  <span className="text-2xl">✓</span> Reliable Support
                </h3>
                <p className="text-[#001f23]/80">Dedicated support team ready to assist you</p>
              </div>
            </div>
          </div>

          {/* Team */}
          <Card className="border-0 shadow-lg bg-white/95 backdrop-blur p-8 md:p-12 space-y-6">
            <h2 className="text-2xl md:text-3xl font-bold text-[#001f23]">Meet the Team</h2>
            <p className="text-base md:text-lg text-[#001f23]/80 leading-relaxed">
              Handshake AI Official Team is composed of experienced professionals committed to delivering the best service. Our team members work tirelessly to ensure every user receives quality training, secure accounts, and exceptional support.
            </p>
            <p className="text-base md:text-lg text-[#001f23]/80 leading-relaxed">
              We believe in continuous improvement and regularly update our platform based on user feedback and industry best practices.
            </p>
          </Card>

          {/* Our Story */}
          <div className="space-y-4">
            <h2 className="text-2xl md:text-4xl font-bold text-[#001f23]">Our Story</h2>
            <p className="text-base md:text-lg text-[#001f23]/80 leading-relaxed">
              Handshake AI began with a simple observation: the global demand for high-quality training data was growing rapidly, yet
              many capable workers around the world lacked a clear, trustworthy path into annotation work. Talented people were held
              back not by ability, but by a shortage of structured training and reliable access to legitimate opportunities.
            </p>
            <p className="text-base md:text-lg text-[#001f23]/80 leading-relaxed">
              We set out to close that gap. By combining approachable training materials with a transparent verification process, we
              help contributors move from curiosity to competence. Our focus has always been on clarity—clear expectations, clear
              pricing, and clear communication—so that every member knows exactly what they are working toward at each step.
            </p>
          </div>

          {/* How We Verify Accounts */}
          <div className="space-y-6">
            <h2 className="text-2xl md:text-4xl font-bold text-[#001f23]">How Our Verification Process Works</h2>
            <p className="text-base md:text-lg text-[#001f23]/80 leading-relaxed max-w-3xl">
              Verification protects both contributors and the platform. It ensures that every active account meets consistent quality
              and security standards before it is put to use. Here is what the process looks like from start to finish.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border-0 shadow-lg bg-white/95 backdrop-blur p-6 space-y-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#B8F663] to-[#59E4A0] flex items-center justify-center">
                  <span className="font-bold text-[#001f23]">1</span>
                </div>
                <h3 className="text-lg font-semibold text-[#001f23]">Registration &amp; Email Confirmation</h3>
                <p className="text-sm text-[#001f23]/70 leading-relaxed">
                  You create an account and confirm your email address, establishing a secure identity within the platform.
                </p>
              </Card>
              <Card className="border-0 shadow-lg bg-white/95 backdrop-blur p-6 space-y-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#59E4A0] to-[#23DAC2] flex items-center justify-center">
                  <span className="font-bold text-[#001f23]">2</span>
                </div>
                <h3 className="text-lg font-semibold text-[#001f23]">Enrollment &amp; Review</h3>
                <p className="text-sm text-[#001f23]/70 leading-relaxed">
                  After enrollment, our team reviews your profile to confirm everything is in order before activation.
                </p>
              </Card>
              <Card className="border-0 shadow-lg bg-white/95 backdrop-blur p-6 space-y-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#23DAC2] to-[#00D3D8] flex items-center justify-center">
                  <span className="font-bold text-[#001f23]">3</span>
                </div>
                <h3 className="text-lg font-semibold text-[#001f23]">Activation &amp; Access</h3>
                <p className="text-sm text-[#001f23]/70 leading-relaxed">
                  Once verified, your account is activated and you receive access to training and task-ready resources.
                </p>
              </Card>
            </div>
          </div>

          {/* Commitment */}
          <div className="space-y-4">
            <h2 className="text-2xl md:text-4xl font-bold text-[#001f23]">Our Commitment to Contributors</h2>
            <p className="text-base md:text-lg text-[#001f23]/80 leading-relaxed">
              We understand that trust is earned, not assumed. That is why we hold ourselves to a straightforward set of commitments:
              we explain our pricing openly, we protect your personal and payment information with industry-standard security, and we
              respond to support requests promptly. We never ask for more information than we need, and we are always transparent about
              how the platform works.
            </p>
            <p className="text-base md:text-lg text-[#001f23]/80 leading-relaxed">
              Above all, we are committed to your growth. The training and resources we provide are designed to give you skills that
              remain valuable well beyond any single task or project. When our contributors succeed, we succeed—and that shared success
              is the foundation of everything we do.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
