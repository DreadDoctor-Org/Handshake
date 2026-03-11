import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import { Toaster } from 'sonner'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Handshake - Annotation Training and Verified accounts',
  description: 'Register and complete cryptocurrency payment to access verified handshake accounts ready to task globally. Fast, secure, and decentralized.',
  generator: 'Ian Mukanda',
  icons: {
    icon: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202026-03-06%20at%201.07.27%20AM-diCisn1VGmxmGniWtuT9XA85Ahzqh0.jpeg',
  },
  verification: {
    google: 'gxizJSXo-8ski0C7HEO7BOacq18teHYxxZKiRoDyyLw',
  },
  other: {
    'google-adsense-account': 'ca-pub-4570027203819755',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        {children}
        <Analytics />
        <Toaster position="top-center" />
      </body>
    </html>
  )
}
