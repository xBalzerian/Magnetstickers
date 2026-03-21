import Link from 'next/link'
import { supabaseAdmin } from '@/lib/supabase'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Order Confirmed | Magnet Stickers',
  robots: { index: false },
}

interface Props { searchParams: Promise<{ id?: string }> }

export default async function OrderConfirmationPage({ searchParams }: Props) {
  const { id } = await searchParams
  let order = null
  if (id) {
    const { data } = await supabaseAdmin().from('orders').select('*').eq('id', id).single()
    order = data
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center">
      <div className="text-7xl mb-6">🎉</div>
      <h1 className="text-3xl font-extrabold mb-3">Order Confirmed!</h1>
      <p className="text-gray-600 mb-6 text-lg">
        Thank you! We&apos;re sending your magnet to print right now.
      </p>

      {order && (
        <div className="bg-gray-50 rounded-2xl p-6 text-left mb-8 space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Order ID</span>
            <span className="font-mono text-xs">{order.id.slice(0, 8).toUpperCase()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Email</span>
            <span className="font-medium">{order.customer_email}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Total</span>
            <span className="font-bold text-pink-600">${(order.total_cents / 100).toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Status</span>
            <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-semibold capitalize">{order.status}</span>
          </div>
        </div>
      )}

      <div className="bg-blue-50 rounded-2xl p-5 mb-8 text-left">
        <h3 className="font-semibold mb-3 text-blue-800">What happens next?</h3>
        <ol className="space-y-2 text-sm text-blue-700">
          <li>✅ Payment received & confirmed</li>
          <li>🖨️ Your magnet is sent to Printful for printing</li>
          <li>📦 Ships to your address in 3–7 business days</li>
          <li>📧 Tracking email sent once shipped</li>
        </ol>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link href="/shop" className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 px-8 rounded-full transition-colors">
          Continue Shopping
        </Link>
        <Link href="/order-tracking" className="border-2 border-gray-200 text-gray-700 hover:border-pink-300 font-bold py-3 px-8 rounded-full transition-colors">
          Track My Order
        </Link>
      </div>
    </div>
  )
}
