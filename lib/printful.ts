// ================================================================
// Printful API Wrapper — Die-Cut Magnets
// Product ID: 656
// Variants:
//   16366 = 3"×3" (900×900px @ 300dpi) — $3.32 cost
//   16367 = 4"×4" (1200×1200px @ 300dpi) — $3.83 cost
//   16465 = 6"×6" (1800×1800px @ 300dpi) — $5.87 cost
//
// Print file specs:
//   Format: PNG with transparent background
//   Resolution: 300 DPI minimum
//   The design should fill the canvas — Printful cuts to the shape
//   Color mode: RGB (not CMYK)
//   Max file size: 200MB
// ================================================================

const BASE = 'https://api.printful.com'
const KEY = process.env.PRINTFUL_API_KEY!

export const PRINTFUL_PRODUCT_ID = 656

export const PRINTFUL_VARIANTS = {
  '3x3': { id: 16366, label: '3″ × 3″', sizeCm: '8×8 cm', dpi: 300, px: 900,  costCents: 332  },
  '4x4': { id: 16367, label: '4″ × 4″', sizeCm: '10×10 cm', dpi: 300, px: 1200, costCents: 383 },
  '6x6': { id: 16465, label: '6″ × 6″', sizeCm: '15×15 cm', dpi: 300, px: 1800, costCents: 587 },
} as const

export type MagnetSize = keyof typeof PRINTFUL_VARIANTS

export interface ShippingAddress {
  name: string
  email: string
  address1: string
  address2?: string
  city: string
  state_code?: string
  country_code: string
  zip: string
  phone?: string
}

export interface PrintfulOrderItem {
  variant_id: number
  quantity: number
  files: { type: string; url: string }[]
}

async function pf(path: string, opts: RequestInit = {}) {
  const res = await fetch(`${BASE}${path}`, {
    ...opts,
    headers: {
      'Authorization': `Bearer ${KEY}`,
      'Content-Type': 'application/json',
      ...(opts.headers ?? {}),
    },
  })
  return res.json()
}

export async function createOrder(
  recipient: ShippingAddress,
  items: PrintfulOrderItem[],
  externalId: string
) {
  return pf('/orders', {
    method: 'POST',
    body: JSON.stringify({ external_id: externalId, recipient, items }),
  })
}

export async function confirmOrder(orderId: number) {
  return pf(`/orders/${orderId}/confirm`, { method: 'POST' })
}

export async function getOrder(orderId: number) {
  return pf(`/orders/${orderId}`)
}

export async function getShippingRates(
  recipient: Partial<ShippingAddress>,
  items: { variant_id: number; quantity: number }[]
) {
  return pf('/shipping/rates', {
    method: 'POST',
    body: JSON.stringify({ recipient, items }),
  })
}

export async function getProductVariants() {
  return pf('/products/656')
}
