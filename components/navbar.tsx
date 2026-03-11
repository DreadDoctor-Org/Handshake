'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function Navbar() {
  return (
    <header className="bg-white/95 backdrop-blur border-b border-[#001f23]/10 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 md:py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 md:gap-3 flex-shrink-0">
            <img 
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202026-03-06%20at%201.07.27%20AM-diCisn1VGmxmGniWtuT9XA85Ahzqh0.jpeg"
              alt="Handshake"
              className="w-8 md:w-10 h-8 md:h-10 rounded"
            />
            <h1 className="text-lg md:text-xl font-bold text-[#001f23]">Handshake</h1>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            <Link href="/">
              <Button variant="ghost" className="text-sm text-[#001f23] hover:bg-[#001f23]/10 px-3">
                Home
              </Button>
            </Link>
            <Link href="/about">
              <Button variant="ghost" className="text-sm text-[#001f23] hover:bg-[#001f23]/10 px-3">
                About
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="ghost" className="text-sm text-[#001f23] hover:bg-[#001f23]/10 px-3">
                Contact
              </Button>
            </Link>
            <Link href="/terms">
              <Button variant="ghost" className="text-sm text-[#001f23] hover:bg-[#001f23]/10 px-3">
                Terms
              </Button>
            </Link>
            <Link href="/privacy">
              <Button variant="ghost" className="text-sm text-[#001f23] hover:bg-[#001f23]/10 px-3">
                Privacy
              </Button>
            </Link>
          </nav>

          {/* Auth Buttons */}
          <div className="flex items-center gap-2 md:gap-3">
            <Link href="/auth/login">
              <Button variant="ghost" className="text-xs md:text-sm text-[#001f23] hover:bg-white/50 px-2 md:px-4">
                Sign In
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button className="bg-[#001f23] text-white hover:bg-[#001f23]/90 text-xs md:text-sm px-3 md:px-6">
                Register
              </Button>
            </Link>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex items-center gap-1 flex-wrap mt-3 pt-3 border-t border-[#001f23]/10">
          <Link href="/">
            <Button variant="ghost" className="text-xs text-[#001f23] hover:bg-[#001f23]/10 px-2 py-1 h-auto">
              Home
            </Button>
          </Link>
          <Link href="/about">
            <Button variant="ghost" className="text-xs text-[#001f23] hover:bg-[#001f23]/10 px-2 py-1 h-auto">
              About
            </Button>
          </Link>
          <Link href="/contact">
            <Button variant="ghost" className="text-xs text-[#001f23] hover:bg-[#001f23]/10 px-2 py-1 h-auto">
              Contact
            </Button>
          </Link>
          <Link href="/terms">
            <Button variant="ghost" className="text-xs text-[#001f23] hover:bg-[#001f23]/10 px-2 py-1 h-auto">
              Terms
            </Button>
          </Link>
          <Link href="/privacy">
            <Button variant="ghost" className="text-xs text-[#001f23] hover:bg-[#001f23]/10 px-2 py-1 h-auto">
              Privacy
            </Button>
          </Link>
        </div>
      </div>
    </header>
  )
}
