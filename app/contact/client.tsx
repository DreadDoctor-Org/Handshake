'use client'

import { useState } from 'react'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'

const ADMIN_EMAIL = 'handshake.ai@outlook.com'

export default function ContactPageClient() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      toast.error('Validation Error', {
        description: 'All fields are required.',
      })
      return
    }

    setIsSubmitting(true)

    try {
      const form = e.currentTarget
      const formElement = new FormData(form)

      // Submit to Formspree
      const response = await fetch('https://formspree.io/f/xykddrzn', {
        method: 'POST',
        body: formElement,
        headers: {
          'Accept': 'application/json',
        },
      })

      if (response.ok) {
        toast.success('Message Sent!', {
          description: 'Thank you for contacting us. We will respond within 24 hours.',
        })

        // Reset form
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: '',
        })
      } else {
        throw new Error('Form submission failed')
      }
    } catch (error) {
      toast.error('Submission Error', {
        description: 'Failed to send message. Please try again.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-[#B8F663] via-[#59E4A0] to-[#00D3D8] py-12 md:py-16">
          <div className="max-w-7xl mx-auto px-4 md:px-6 text-center space-y-4">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-[#001f23] text-balance">
              Contact Handshake AI
            </h1>
            <p className="text-sm md:text-lg lg:text-xl text-[#001f23]/80 max-w-3xl mx-auto text-pretty">
              We're here to help. Reach out for account verification, training access, or any questions you may have.
            </p>
          </div>
        </section>

        {/* Contact Content */}
        <section className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-12">
            {/* Contact Info */}
            <div className="md:col-span-1 space-y-6">
              {/* Email */}
              <Card className="border-0 shadow-lg bg-white/95 backdrop-blur p-4 md:p-6 space-y-3">
                <h3 className="text-lg md:text-xl font-bold text-[#001f23]">Email</h3>
                <p className="text-xs md:text-sm text-[#001f23]/70">For all inquiries and support:</p>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(ADMIN_EMAIL)
                    toast.success('Email copied!', {
                      description: 'Admin email copied to clipboard.',
                    })
                  }}
                  className="text-base md:text-lg font-semibold text-[#59E4A0] hover:text-[#23DAC2] transition break-all"
                >
                  {ADMIN_EMAIL}
                </button>
              </Card>

              {/* Support */}
              <Card className="border-0 shadow-lg bg-white/95 backdrop-blur p-4 md:p-6 space-y-3">
                <h3 className="text-lg md:text-xl font-bold text-[#001f23]">Support For</h3>
                <ul className="space-y-2 text-xs md:text-sm text-[#001f23]/70">
                  <li className="flex gap-2">
                    <span className="text-lg flex-shrink-0">✓</span>
                    <span>Account verification questions</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-lg flex-shrink-0">✓</span>
                    <span>Training access assistance</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-lg flex-shrink-0">✓</span>
                    <span>Task platform guidance</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-lg flex-shrink-0">✓</span>
                    <span>General inquiries</span>
                  </li>
                </ul>
              </Card>
            </div>

            {/* Contact Form */}
            <Card className="md:col-span-2 border-0 shadow-lg bg-white/95 backdrop-blur p-4 md:p-8">
              <h2 className="text-xl md:text-2xl font-bold text-[#001f23] mb-4 md:mb-6">Send us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4" noValidate>
                <div>
                  <label htmlFor="name" className="block text-xs md:text-sm font-medium text-[#001f23] mb-1">
                    Full Name
                  </label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Your name"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    className="bg-[#001f23]/5 border-[#001f23]/20 text-xs md:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-xs md:text-sm font-medium text-[#001f23] mb-1">
                    Email Address
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    className="bg-[#001f23]/5 border-[#001f23]/20 text-xs md:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-xs md:text-sm font-medium text-[#001f23] mb-1">
                    Subject
                  </label>
                  <Input
                    id="subject"
                    name="subject"
                    placeholder="Message subject"
                    value={formData.subject}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    className="bg-[#001f23]/5 border-[#001f23]/20 text-xs md:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-xs md:text-sm font-medium text-[#001f23] mb-1">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    placeholder="Your message..."
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    className="w-full px-3 py-2 border border-[#001f23]/20 rounded-md bg-[#001f23]/5 text-[#001f23] placeholder-[#001f23]/50 focus:outline-none focus:ring-2 focus:ring-[#59E4A0] text-xs md:text-sm"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#001f23] text-white hover:bg-[#001f23]/90 text-xs md:text-sm"
                >
                  {isSubmitting ? 'Preparing Email...' : 'Send Message'}
                </Button>
              </form>
            </Card>
          </div>

          {/* Response Time */}
          <Card className="border-0 shadow-lg bg-gradient-to-r from-[#B8F663] to-[#59E4A0] p-6 md:p-12 space-y-4">
            <h3 className="text-lg md:text-xl font-bold text-[#001f23]">Response Time</h3>
            <p className="text-sm md:text-base text-[#001f23]">
              We typically respond to all inquiries within 24 hours. For urgent matters regarding account verification, please mention it in your subject line.
            </p>
          </Card>
        </section>
      </main>

      <Footer />
    </div>
  )
}
