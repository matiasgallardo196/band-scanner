import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Footer from '../components/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Band Scanner',
  description: 'Serial Port Scanner',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-neutral-950 text-white min-h-screen relative pb-20`}>
        {children}
        <Footer />
      </body>
    </html>
  )
}
