import type { Metadata } from 'next'
import ContactPageClient from './client'

export const metadata: Metadata = {
  title: 'Contact Handshake AI - Get Support',
  description: 'Contact Handshake AI for account verification, training access, or general inquiries. We are here to help.',
}

export default function ContactPage() {
  return <ContactPageClient />
}
