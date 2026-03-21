import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const email = searchParams.get('email')
  const id = searchParams.get('id')

  if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 })

  const db = supabaseAdmin()
  let query = db.from('orders').select('id,status,total_cents,tracking_number,tracking_url,created_at,customer_name')
    .eq('customer_email', email)
    .order('created_at', { ascending: false })

  if (id) query = query.eq('id', id)

  const { data } = await query.limit(5)
  const order = data?.[0] ?? null
  return NextResponse.json({ order })
}
