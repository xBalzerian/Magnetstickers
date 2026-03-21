import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { createOrder as printfulCreateOrder, confirmOrder as printfulConfirmOrder } from '@/lib/printful'

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
    const { orderId, cart, shipping } = await req.json()
    const token = await getPayPalToken()

    // Capture the PayPal payment
    const captureRes = await fetch(`${PAYPAL_BASE}/v2/checkout/orders/${orderId}/capture`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
    })
    const capture = await captureRes.json()
    if (capture.status !== 'COMPLETED') {
      return NextResponse.json({ success: false, error: 'Payment not completed' }, { status: 400 })
    }

    const total = cart.reduce((s: number, i: any) => s + (i.priceCents * i.quantity), 0)
    const db = supabaseAdmin()

    // Save order to Supabase
    const { data: dbOrder } = await db.from('orders').insert({
      paypal_order_id: orderId,
      customer_email: shipping.email,
      customer_name: shipping.fullName,
      shipping_address: shipping,
      items: cart,
      subtotal_cents: total,
      shipping_cents: 0,
      total_cents: total,
      currency: 'USD',
      status: 'paid',
    }).select().single()

    // Save order items
    if (dbOrder) {
      await db.from('order_items').insert(
        cart.map((item: any) => ({
          order_id: dbOrder.id,
          product_id: item.productId,
          product_name: item.name,
          product_image: item.image,
          quantity: item.quantity,
          price_cents: item.priceCents,
          printful_variant_id: item.printfulVariantId,
        }))
      )

      // Get product images for Printful
      const { data: products } = await db.from('products').select('id, images').in('id', cart.map((i: any) => i.productId))
      const productMap = Object.fromEntries((products ?? []).map((p: any) => [p.id, p]))

      // Create Printful order
      try {
        const printfulItems = cart.map((item: any) => ({
          variant_id: item.printfulVariantId,
          quantity: item.quantity,
          files: [{
            type: 'default',
            url: productMap[item.productId]?.images?.[0] ?? '',
          }],
        }))

        const pfRecipient = {
          name: shipping.fullName,
          email: shipping.email,
          address1: shipping.address1,
          address2: shipping.address2 || undefined,
          city: shipping.city,
          state_code: shipping.state || undefined,
          country_code: shipping.country,
          zip: shipping.zip,
          phone: shipping.phone || undefined,
        }

        const pfOrder = await printfulCreateOrder(pfRecipient, printfulItems, dbOrder.id)
        if (pfOrder?.result?.id) {
          await printfulConfirmOrder(pfOrder.result.id)
          await db.from('orders').update({
            printful_order_id: pfOrder.result.id,
            status: 'fulfilling',
          }).eq('id', dbOrder.id)
        }
      } catch (pfErr) {
        console.error('Printful order failed:', pfErr)
        // Don't fail the whole thing — order is captured, handle manually
      }
    }

    return NextResponse.json({ success: true, dbOrderId: dbOrder?.id })
  } catch (err: any) {
    console.error('Capture error:', err)
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
