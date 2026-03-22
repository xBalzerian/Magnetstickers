import type { Metadata } from 'next'
import './globals.css'
import { organizationJsonLd, websiteJsonLd } from '@/lib/seo'

export const metadata: Metadata = {
  title: { default: 'MagnetStickers — World\'s Largest Die-Cut Magnet Store', template: '%s | MagnetStickers' },
  description: 'Shop thousands of unique die-cut magnet stickers — dog breeds, cats, wildlife, fruits, quotes & more. Premium 20mil vinyl, ships to 190+ countries.',
  metadataBase: new URL('https://magnetstickers.art'),
  keywords: ['magnet stickers', 'die cut magnets', 'fridge magnets', 'dog breed magnets', 'cat magnets', 'cute magnets'],
  robots: { index: true, follow: true },
  openGraph: {
    type: 'website', locale: 'en_US',
    url: 'https://magnetstickers.art', siteName: 'MagnetStickers',
    title: 'MagnetStickers — World\'s Largest Die-Cut Magnet Store',
    description: 'Thousands of unique die-cut magnet stickers. Premium quality, ships worldwide.',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <script type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd()) }} />
        <script type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd()) }} />
      </head>
      <body style={{ background: '#F5F0E8', color: '#1C1410' }}>{children}</body>
    </html>
  )
}
