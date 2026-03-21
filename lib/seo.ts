// SEO utilities — generates metadata for every page
import type { Metadata } from 'next'

const SITE_NAME = 'Magnet Stickers'
const SITE_URL = 'https://magnetstickers.art'
const DEFAULT_DESC = 'Shop thousands of unique die-cut magnet stickers — dog breeds, cats, wildlife, fruits, quotes & more. Premium quality, ships worldwide from Magnet Stickers.'
const DEFAULT_IMAGE = `${SITE_URL}/og-image.png`

export function buildMetadata({
  title,
  description = DEFAULT_DESC,
  path = '/',
  image = DEFAULT_IMAGE,
  noIndex = false,
}: {
  title?: string
  description?: string
  path?: string
  image?: string
  noIndex?: boolean
}): Metadata {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} — Unique Die-Cut Magnet Stickers`
  const url = `${SITE_URL}${path}`

  return {
    title: fullTitle,
    description,
    metadataBase: new URL(SITE_URL),
    alternates: { canonical: url },
    robots: noIndex ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: SITE_NAME,
      images: [{ url: image, width: 1200, height: 630, alt: fullTitle }],
      type: 'website',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [image],
    },
    keywords: [
      'magnet stickers', 'die cut magnets', 'fridge magnets', 'custom magnets',
      'dog breed magnets', 'cat magnets', 'animal magnets', 'cute magnets',
      'printful magnets', 'magnetic stickers', title ?? '',
    ].filter(Boolean),
  }
}

export function buildProductMetadata(product: {
  name: string
  description?: string | null
  images?: string[]
  slug: string
  price_cents: number
}): Metadata {
  const price = (product.price_cents / 100).toFixed(2)
  return {
    ...buildMetadata({
      title: `${product.name} Magnet Sticker`,
      description: product.description ?? `Buy the ${product.name} die-cut magnet sticker. Premium quality, ${price} USD, ships worldwide.`,
      path: `/product/${product.slug}`,
      image: product.images?.[0] ?? DEFAULT_IMAGE,
    }),
    other: {
      'product:price:amount': price,
      'product:price:currency': 'USD',
    },
  }
}

export function buildCategoryMetadata(category: {
  name: string
  description?: string | null
  slug: string
  image_url?: string | null
}): Metadata {
  return buildMetadata({
    title: `${category.name} Magnet Stickers`,
    description: category.description ?? `Browse our collection of ${category.name} die-cut magnet stickers. Unique designs, premium quality, ships worldwide.`,
    path: `/shop/${category.slug}`,
    image: category.image_url ?? DEFAULT_IMAGE,
  })
}

// Structured data (JSON-LD) helpers
export function productJsonLd(product: {
  name: string
  description?: string | null
  images?: string[]
  price_cents: number
  slug: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description ?? `${product.name} die-cut magnet sticker`,
    image: product.images ?? [],
    offers: {
      '@type': 'Offer',
      price: (product.price_cents / 100).toFixed(2),
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      url: `${SITE_URL}/product/${product.slug}`,
    },
    brand: { '@type': 'Brand', name: SITE_NAME },
  }
}

export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    sameAs: ['https://magnetstickers.art'],
  }
}

export function websiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: { '@type': 'EntryPoint', urlTemplate: `${SITE_URL}/shop?q={search_term_string}` },
      'query-input': 'required name=search_term_string',
    },
  }
}
