import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { createOrder as printfulCreateOrder, confirmOrder as printfulConfirmOrder } from '@/lib/printful'

const IS_PROD = process.env.NODE_ENV === 'production'
const PAYPAL_BASE = IS_PROD ? 'https://api-m.paypal.com' : 'https://api-m.sandbox.paypal.com'

async function getPayPalToken() {
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID
  const secret = process.env.PAYPAL_CLIENT_SECRET
  const creds = Buffer.from(`${clientId}:${secret}`).toString('base64')
  const res = await fetch(`${PAYPAL_BASE}/v1/oauth2/token`, {
    method: 'POST',
    headers: { 'Authorization': `Basic ${creds}`, 'Content-Type': 'application/x-www-form-urlencoded' },
    body: 'grant_type=client_credentials',
  })
  const data = await res.json()
  return data.access_token
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const paypalOrderId = searchParams.get('token')
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://magnetstickers.art'

  if (!paypalOrderId) {
    return NextResponse.redirect(`${siteUrl}/checkout?error=missing_token`)
  }

  try {
    const token = await getPayPalToken()
    const captureRes = await fetch(`${PAYPAL_BASE}/v2/checkout/orders/${paypalOrderId}/capture`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
    })
    const capture = await captureRes.json()

    if (capture.status !== 'COMPLETED') {
      return NextResponse.redirect(`${siteUrl}/checkout?error=payment_incomplete`)
    }

    const payer = capture.payer
    const shipping = capture.purchase_units?.[0]?.shipping
    const items = capture.purchase_units?.[0]?.items ?? []
    const total = Math.round(parseFloat(capture.purchase_units?.[0]?.amount?.value ?? '0') * 100)

    const db = supabaseAdmin()
    const { data: dbOrder } = await db.from('orders').insert({
      paypal_order_id: paypalOrderId,
      customer_email: payer?.email_address ?? '',
      customer_name: shipping?.name?.full_name ?? payer?.name?.given_name ?? 'Customer',
      shipping_address: shipping?.address ?? {},
      items: items,
      subtotal_cents: total,
      shipping_cents: 0,
      total_cents: total,
      currency: 'USD',
      status: 'paid',
    }).select().single()

    return NextResponse.redirect(`${siteUrl}/order-confirmation?id=${dbOrder?.id ?? ''}`)
  } catch (err: any) {
    console.error('PayPal return error:', err)
    return NextResponse.redirect(`${siteUrl}/checkout?error=capture_failed`)
  }
}
