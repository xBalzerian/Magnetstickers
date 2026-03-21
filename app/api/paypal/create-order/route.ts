import { NextRequest, NextResponse } from 'next/server'

const PAYPAL_BASE = process.env.NODE_ENV === 'production'
  ? 'https://api-m.paypal.com'
  : 'https://api-m.sandbox.paypal.com'

async function getPayPalToken() {
  const creds = Buffer.from(`${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`).toString('base64')
  const res = await fetch(`${PAYPAL_BASE}/v1/oauth2/token`, {
    method: 'POST',
    headers: { 'Authorization': `Basic ${creds}`, 'Content-Type': 'application/x-www-form-urlencoded' },
    body: 'grant_type=client_credentials',
  })
  const data = await res.json()
  return data.access_token
}

export async function POST(req: NextRequest) {
  try {
    const { cart, shipping } = await req.json()
    const token = await getPayPalToken()

    const subtotal = cart.reduce((s: number, i: any) => s + (i.priceCents * i.quantity), 0)
    const subtotalUSD = (subtotal / 100).toFixed(2)

    const res = await fetch(`${PAYPAL_BASE}/v2/checkout/orders`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [{
          amount: { currency_code: 'USD', value: subtotalUSD,
            breakdown: { item_total: { currency_code: 'USD', value: subtotalUSD } } },
          items: cart.map((i: any) => ({
            name: i.name.slice(0, 127),
            unit_amount: { currency_code: 'USD', value: (i.priceCents / 100).toFixed(2) },
            quantity: String(i.quantity),
          })),
          shipping: {
            name: { full_name: shipping.fullName },
            address: {
              address_line_1: shipping.address1,
              address_line_2: shipping.address2 || undefined,
              admin_area_2: shipping.city,
              admin_area_1: shipping.state || undefined,
              postal_code: shipping.zip,
              country_code: shipping.country,
            },
          },
        }],
      }),
    })
    const order = await res.json()
    return NextResponse.json({ orderId: order.id })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
