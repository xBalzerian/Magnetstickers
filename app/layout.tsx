import type { Metadata } from 'next'
import './globals.css'
import { organizationJsonLd, websiteJsonLd } from '@/lib/seo'

export const metadata: Metadata = {
  title: { default: 'MagnetStickers — World\'s Largest Die-Cut Magnet Store', template: '%s | MagnetStickers' },
  description: 'Shop thousands of unique die-cut magnet stickers — dog breeds, cats, wildlife, fruits, quotes & more. Premium 20mil vinyl, ships to 190+ countries.',
  metadataBase: new URL('https://magnetstickers.art'),
  keywords: ['magnet stickers', 'die cut magnets', 'fridge magnets', 'dog breed magnets', 'cat magnets', 'cute magnets'],
  authors: [{ name: 'MagnetStickers', url: 'https://magnetstickers.art' }],
  robots: { index: true, follow: true },
  openGraph: {
    type: 'website', locale: 'en_US',
    url: 'https://magnetstickers.art', siteName: 'MagnetStickers',
    title: 'MagnetStickers — World\'s Largest Die-Cut Magnet Store',
    description: 'Thousands of unique die-cut magnet stickers. Premium quality, ships worldwide.',
    images: [{ url: 'https://magnetstickers.art/og-image.png', width: 1200, height: 630 }],
  },
  twitter: { card: 'summary_large_image', title: 'MagnetStickers', description: 'Shop unique die-cut magnet stickers.' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="bg-black">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <script type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd()) }} />
        <script type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd()) }} />
      </head>
      <body className="bg-black text-white antialiased">{children}</body>
    </html>
  )
}
