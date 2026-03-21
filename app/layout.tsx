import type { Metadata } from 'next'
import './globals.css'
import { organizationJsonLd, websiteJsonLd } from '@/lib/seo'

export const metadata: Metadata = {
  title: { default: 'Magnet Stickers — Unique Die-Cut Magnet Stickers', template: '%s | Magnet Stickers' },
  description: 'Shop thousands of unique die-cut magnet stickers — dog breeds, cats, wildlife, fruits, quotes & more. Premium quality, ships worldwide.',
  metadataBase: new URL('https://magnetstickers.art'),
  keywords: ['magnet stickers', 'die cut magnets', 'fridge magnets', 'dog breed magnets', 'cat magnets', 'cute magnets', 'custom magnets'],
  authors: [{ name: 'Magnet Stickers', url: 'https://magnetstickers.art' }],
  creator: 'Magnet Stickers',
  publisher: 'Magnet Stickers',
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large' } },
  openGraph: {
    type: 'website', locale: 'en_US',
    url: 'https://magnetstickers.art', siteName: 'Magnet Stickers',
    title: 'Magnet Stickers — Unique Die-Cut Magnet Stickers',
    description: 'Shop thousands of unique die-cut magnet stickers. Premium quality, ships worldwide.',
    images: [{ url: 'https://magnetstickers.art/og-image.png', width: 1200, height: 630 }],
  },
  twitter: { card: 'summary_large_image', title: 'Magnet Stickers', description: 'Shop unique die-cut magnet stickers.', images: ['https://magnetstickers.art/og-image.png'] },
  verification: { google: 'YOUR_GOOGLE_VERIFICATION_CODE' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd()) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd()) }}
        />
      </head>
      <body className="bg-white text-gray-900 antialiased">{children}</body>
    </html>
  )
}
