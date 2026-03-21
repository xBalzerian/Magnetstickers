import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { type, data } = body
    const db = supabaseAdmin()

    if (type === 'package_shipped') {
      const externalId = data.order?.external_id
      const tracking = data.shipment?.tracking_number
      const trackingUrl = data.shipment?.tracking_url

      if (externalId) {
        await db.from('orders').update({
          status: 'shipped',
          tracking_number: tracking,
          tracking_url: trackingUrl,
        }).eq('id', externalId)
      }
    }

    if (type === 'order_updated' && data.order?.status === 'fulfilled') {
      const externalId = data.order?.external_id
      if (externalId) {
        await db.from('orders').update({ status: 'delivered' }).eq('id', externalId)
      }
    }

    return NextResponse.json({ received: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
