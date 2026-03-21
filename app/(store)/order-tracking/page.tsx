'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Search, Package, Truck, CheckCircle, ArrowLeft } from 'lucide-react'

export default function OrderTrackingPage() {
  const [orderId, setOrderId] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState('')

  async function handleTrack(e: React.FormEvent) {
    e.preventDefault()
    if (!orderId.trim()) return
    setLoading(true); setError(''); setResult(null)
    try {
      const res = await fetch(`/api/orders/track?orderId=${encodeURIComponent(orderId.trim())}&email=${encodeURIComponent(email.trim())}`)
      const data = await res.json()
      if (!res.ok || data.error) throw new Error(data.error ?? 'Order not found')
      setResult(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-xl mx-auto px-4 sm:px-6 py-12 sm:py-20">

        <div className="flex items-center gap-3 mb-8">
          <Link href="/" className="text-gray-600 hover:text-gray-300 transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black">Track My Order</h1>
            <p className="text-gray-600 text-sm mt-1">Enter your order details to check status</p>
          </div>
        </div>

        <div className="bg-gray-950 border border-white/8 rounded-3xl p-6 sm:p-8 mb-6">
          <form onSubmit={handleTrack} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Order ID</label>
              <input type="text" value={orderId} onChange={e => setOrderId(e.target.value)}
                placeholder="e.g. MS-1234567"
                className="w-full bg-white/5 border border-white/10 focus:border-pink-500/50 rounded-xl px-4 py-3 text-white placeholder-gray-700 outline-none transition-colors text-sm" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Email Address</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full bg-white/5 border border-white/10 focus:border-pink-500/50 rounded-xl px-4 py-3 text-white placeholder-gray-700 outline-none transition-colors text-sm" />
            </div>
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-xl">
                {error}
              </div>
            )}
            <button type="submit" disabled={loading}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 disabled:opacity-50 text-white font-black py-4 rounded-2xl transition-all flex items-center justify-center gap-2 text-sm shadow-xl shadow-pink-500/20">
              {loading ? (
                <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Tracking...</>
              ) : (
                <><Search size={16} /> Track Order</>
              )}
            </button>
          </form>
        </div>

        {result && (
          <div className="bg-gray-950 border border-white/8 rounded-3xl p-6 sm:p-8">
            <h2 className="font-black text-lg mb-5">Order {result.orderId}</h2>
            <div className="space-y-4">
              {[
                { icon: CheckCircle, label: 'Order Confirmed', done: true },
                { icon: Package, label: 'In Production', done: result.status !== 'pending' },
                { icon: Truck, label: 'Shipped', done: result.status === 'shipped' || result.status === 'delivered' },
                { icon: CheckCircle, label: 'Delivered', done: result.status === 'delivered' },
              ].map(step => (
                <div key={step.label} className={`flex items-center gap-3 text-sm ${step.done ? 'text-white' : 'text-gray-700'}`}>
                  <step.icon size={18} className={step.done ? 'text-green-400' : 'text-gray-800'} />
                  <span className={step.done ? 'font-semibold' : ''}>{step.label}</span>
                  {step.done && <div className="w-1.5 h-1.5 rounded-full bg-green-400 ml-auto" />}
                </div>
              ))}
            </div>
            {result.trackingUrl && (
              <a href={result.trackingUrl} target="_blank" rel="noopener noreferrer"
                className="mt-6 w-full bg-white/5 hover:bg-white/8 border border-white/10 text-gray-300 hover:text-white font-semibold py-3 rounded-2xl text-center block transition-all text-sm">
                View on Carrier Website
              </a>
            )}
          </div>
        )}

        <p className="text-center text-xs text-gray-700 mt-6">
          Need help? <Link href="/contact" className="text-pink-400 hover:text-pink-300 transition-colors">Contact us</Link>
        </p>
      </div>
    </div>
  )
}
