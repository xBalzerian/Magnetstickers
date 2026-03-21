import { NextRequest, NextResponse } from 'next/server'

const IS_PROD = process.env.NODE_ENV === 'production'
const PAYPAL_BASE = IS_PROD
  ? 'https://api-m.paypal.com'
  : 'https://api-m.sandbox.paypal.com'

async function getPayPalToken() {
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID
  const secret = process.env.PAYPAL_CLIENT_SECRET
  if (!clientId || !secret) throw new Error('PayPal credentials not configured')
  const creds = Buffer.from(`${clientId}:${secret}`).toString('base64')
  const res = await fetch(`${PAYPAL_BASE}/v1/oauth2/token`, {
    method: 'POST',
    headers: { 'Authorization': `Basic ${creds}`, 'Content-Type': 'application/x-www-form-urlencoded' },
    body: 'grant_type=client_credentials',
  })
  const data = await res.json()
  if (!data.access_token) throw new Error('Failed to get PayPal token')
  return data.access_token
}

export async function POST(req: NextRequest) {
  try {
    const { cart, shipping } = await req.json()
    const token = await getPayPalToken()

    const subtotal = cart.reduce((s: number, i: any) => s + (i.priceCents * i.quantity), 0)
    const subtotalUSD = (subtotal / 100).toFixed(2)
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://magnetstickers.art'

    const res = await fetch(`${PAYPAL_BASE}/v2/checkout/orders`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [{
          amount: {
            currency_code: 'USD',
            value: subtotalUSD,
            breakdown: { item_total: { currency_code: 'USD', value: subtotalUSD } },
          },
          items: cart.map((i: any) => ({
            name: i.name.slice(0, 127),
            unit_amount: { currency_code: 'USD', value: (i.priceCents / 100).toFixed(2) },
            quantity: String(i.quantity),
          })),
          shipping: {
            name: { full_name: shipping.fullName },
            address: {
              address_line_1: shipping.address1,
              ...(shipping.address2 ? { address_line_2: shipping.address2 } : {}),
              admin_area_2: shipping.city,
              ...(shipping.state ? { admin_area_1: shipping.state } : {}),
              postal_code: shipping.zip,
              country_code: shipping.country,
            },
          },
        }],
        application_context: {
          brand_name: 'MagnetStickers',
          landing_page: 'BILLING',
          shipping_preference: 'SET_PROVIDED_ADDRESS',
          user_action: 'PAY_NOW',
          return_url: `${siteUrl}/api/paypal/return`,
          cancel_url: `${siteUrl}/checkout`,
        },
      }),
    })

    const order = await res.json()
    if (!order.id) {
      console.error('PayPal order error:', JSON.stringify(order))
      return NextResponse.json({ error: order.message || 'PayPal order creation failed' }, { status: 400 })
    }

    const approveUrl = order.links?.find((l: any) => l.rel === 'approve')?.href

    return NextResponse.json({ orderId: order.id, approveUrl })
  } catch (err: any) {
    console.error('PayPal create-order error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
