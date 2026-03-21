'use client'
import { useState } from 'react'
import { buildMetadata } from '@/lib/seo'
import { Package } from 'lucide-react'

export default function OrderTrackingPage() {
  const [email, setEmail] = useState('')
  const [orderId, setOrderId] = useState('')
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); setError(''); setOrder(null)
    try {
      const res = await fetch(`/api/orders/track?email=${encodeURIComponent(email)}&id=${encodeURIComponent(orderId)}`)
      const data = await res.json()
      if (data.order) setOrder(data.order)
      else setError('Order not found. Please check your email and order ID.')
    } catch { setError('Something went wrong. Please try again.') }
    finally { setLoading(false) }
  }

  const statusSteps = ['pending', 'paid', 'fulfilling', 'shipped', 'delivered']
  const statusLabels: Record<string, string> = {
    pending: 'Order Placed', paid: 'Payment Confirmed', fulfilling: 'Being Printed',
    shipped: 'Shipped', delivered: 'Delivered',
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <div className="text-center mb-10">
        <Package size={40} className="mx-auto mb-4 text-pink-500" />
        <h1 className="text-3xl font-bold mb-2">Track Your Order</h1>
        <p className="text-gray-500">Enter your email and order ID to see your order status</p>
      </div>

      <form onSubmit={handleSearch} className="bg-white border border-gray-100 rounded-2xl p-6 mb-8 shadow-sm">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-pink-300" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Order ID</label>
            <input type="text" value={orderId} onChange={e => setOrderId(e.target.value)}
              placeholder="Optional — from your confirmation email"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-pink-300" />
          </div>
        </div>
        <button type="submit" disabled={loading}
          className="mt-5 w-full bg-pink-500 hover:bg-pink-600 disabled:bg-pink-300 text-white font-bold py-3 rounded-2xl transition-colors">
          {loading ? 'Searching…' : 'Track Order'}
        </button>
      </form>

      {error && <div className="bg-red-50 text-red-600 rounded-xl p-4 text-sm mb-6">{error}</div>}

      {order && (
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <h2 className="font-bold text-lg mb-4">Order #{order.id.slice(0, 8).toUpperCase()}</h2>

          {/* Status progress */}
          <div className="flex items-center justify-between mb-8">
            {statusSteps.map((s, i) => {
              const idx = statusSteps.indexOf(order.status)
              const done = i <= idx
              return (
                <div key={s} className="flex flex-col items-center flex-1">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${done ? 'bg-pink-500 text-white' : 'bg-gray-100 text-gray-400'}`}>
                    {done ? '✓' : i + 1}
                  </div>
                  <span className={`text-xs mt-1 text-center hidden sm:block ${done ? 'text-pink-600 font-medium' : 'text-gray-400'}`}>{statusLabels[s]}</span>
                  {i < statusSteps.length - 1 && <div className={`h-px flex-1 mt-4 absolute ${done ? 'bg-pink-500' : 'bg-gray-200'}`} />}
                </div>
              )
            })}
          </div>

          <div className="space-y-2 text-sm border-t pt-4">
            <div className="flex justify-between"><span className="text-gray-500">Status</span><span className="font-semibold capitalize">{order.status}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Total</span><span className="font-semibold">${(order.total_cents / 100).toFixed(2)}</span></div>
            {order.tracking_number && (
              <div className="flex justify-between">
                <span className="text-gray-500">Tracking</span>
                {order.tracking_url
                  ? <a href={order.tracking_url} target="_blank" rel="noopener noreferrer" className="text-pink-600 font-semibold hover:underline">{order.tracking_number}</a>
                  : <span className="font-mono text-sm">{order.tracking_number}</span>}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
