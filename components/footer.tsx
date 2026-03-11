'use client'

import Link from 'next/link'
import { toast } from 'sonner'

const ADMIN_EMAIL = 'handshake.ai@outlook.com'

export default function Footer() {
  const copyEmail = () => {
    navigator.clipboard.writeText(ADMIN_EMAIL)
    toast.success('Email copied!', {
      description: 'Admin email copied to clipboard.',
    })
  }

  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-[#001f23] text-white">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12 mb-8">
          {/* Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <img 
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202026-03-06%20at%201.07.27%20AM-diCisn1VGmxmGniWtuT9XA85Ahzqh0.jpeg"
                alt="Handshake"
                className="w-10 h-10 rounded"
              />
              <h3 className="text-lg font-bold">Handshake AI</h3>
            </div>
            <p className="text-sm text-white/70">
              Empowering global workers through verified annotation and task opportunities.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="font-semibold text-sm">Quick Links</h4>
            <nav className="space-y-2">
              <Link href="/" className="text-sm text-white/70 hover:text-white transition">
                Home
              </Link>
              <Link href="/about" className="text-sm text-white/70 hover:text-white transition">
                About
              </Link>
              <Link href="/contact" className="text-sm text-white/70 hover:text-white transition">
                Contact
              </Link>
              <Link href="/terms" className="text-sm text-white/70 hover:text-white transition">
                Terms of Service
              </Link>
              <Link href="/privacy" className="text-sm text-white/70 hover:text-white transition">
                Privacy Policy
              </Link>
            </nav>
          </div>

          {/* Support */}
          <div className="space-y-3">
            <h4 className="font-semibold text-sm">Support</h4>
            <div className="space-y-2">
              <p className="text-sm text-white/70">
                Need help? Contact us:
              </p>
              <button
                onClick={copyEmail}
                className="text-sm text-[#B8F663] hover:text-[#8CED7F] transition font-semibold break-all text-left"
              >
                {ADMIN_EMAIL}
              </button>
            </div>
          </div>

          {/* Info */}
          <div className="space-y-3">
            <h4 className="font-semibold text-sm">About Us</h4>
            <p className="text-sm text-white/70">
              Handshake AI Official Team is committed to providing transparent and secure services for global workers seeking task opportunities.
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-white/60">
              &copy; {currentYear} Handshake AI Official Team. All rights reserved.
            </p>
            <p className="text-sm text-white/60">
              Designed for transparency and trust
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
