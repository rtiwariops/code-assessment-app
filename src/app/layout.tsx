import type { Metadata } from 'next'
import { GoogleAnalytics } from '@next/third-parties/google'
import './globals.css'

export const metadata: Metadata = {
  title: 'Code Assessment | MaximizeHire',
  description: 'Complete your coding assessment',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // GA4 Measurement ID — public value; env var overrides the default.
  const gaId = process.env.NEXT_PUBLIC_GA_ID || 'G-LYY1ZVVMYK'
  return (
    <html lang="en">
      <body className="bg-gray-900 text-white">{children}</body>
      {gaId ? <GoogleAnalytics gaId={gaId} /> : null}
    </html>
  )
}
