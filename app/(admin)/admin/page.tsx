export const dynamic = 'force-dynamic'

import { supabaseAdmin } from '@/lib/supabase'
import Link from 'next/link'

async function getStats() {
  const db = supabaseAdmin()
  const [{ count: products }, { count: designs }, { count: orders }, { data: revenue }] = await Promise.all([
    db.from('products').select('*', { count: 'exact', head: true }).eq('is_active', true),
    db.from('designs').select('*', { count: 'exact', head: true }),
    db.from('orders').select('*', { count: 'exact', head: true }),
    db.from('orders').select('total_cents').in('status', ['paid', 'fulfilling', 'shipped', 'delivered']),
  ])
  const totalRevenue = (revenue ?? []).reduce((s: number, o: any) => s + o.total_cents, 0)
  return { products: products ?? 0, designs: designs ?? 0, orders: orders ?? 0, revenue: totalRevenue }
}

async function getRecentOrders() {
  const { data } = await supabaseAdmin().from('orders').select('*').order('created_at', { ascending: false }).limit(5)
  return data ?? []
}

export default async function AdminDashboard() {
  const [stats, recentOrders] = await Promise.all([getStats(), getRecentOrders()])

  const statCards = [
    { label: 'Active Products', value: stats.products.toLocaleString(), icon: '🧲', href: '/admin/products', color: 'bg-pink-50 text-pink-600' },
    { label: 'Total Designs', value: stats.designs.toLocaleString(), icon: '🎨', href: '/admin/designs', color: 'bg-purple-50 text-purple-600' },
    { label: 'Total Orders', value: stats.orders.toLocaleString(), icon: '📦', href: '/admin/orders', color: 'bg-blue-50 text-blue-600' },
    { label: 'Revenue', value: `$${(stats.revenue / 100).toFixed(2)}`, icon: '💰', href: '/admin/orders', color: 'bg-green-50 text-green-600' },
  ]

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-700', paid: 'bg-blue-100 text-blue-700',
    fulfilling: 'bg-purple-100 text-purple-700', shipped: 'bg-indigo-100 text-indigo-700',
    delivered: 'bg-green-100 text-green-700', cancelled: 'bg-red-100 text-red-700',
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-gray-500 text-sm">Welcome back to MagnetStickers admin</p>
        </div>
        <div className="flex gap-3">
          <Link href="/admin/batches" className="bg-pink-500 hover:bg-pink-600 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors flex items-center gap-2">
            ⚡ Generate Designs
          </Link>
          <Link href="/" target="_blank" className="border border-gray-200 text-gray-600 text-sm px-4 py-2 rounded-xl hover:bg-gray-50">
            View Store ↗
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {statCards.map(s => (
          <Link key={s.label} href={s.href} className="bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-md transition-shadow">
            <div className={`text-3xl w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${s.color}`}>{s.icon}</div>
            <div className="text-2xl font-extrabold text-gray-900">{s.value}</div>
            <div className="text-sm text-gray-500 mt-0.5">{s.label}</div>
          </Link>
        ))}
      </div>

      {/* Recent orders */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-bold">Recent Orders</h2>
          <Link href="/admin/orders" className="text-sm text-pink-500 hover:underline">View all →</Link>
        </div>
        {recentOrders.length === 0 ? (
          <div className="p-10 text-center text-gray-400">No orders yet</div>
        ) : (
          <div className="divide-y divide-gray-50">
            {recentOrders.map((order: any) => (
              <div key={order.id} className="flex items-center justify-between px-5 py-3 hover:bg-gray-50">
                <div>
                  <p className="text-sm font-medium">{order.customer_name}</p>
                  <p className="text-xs text-gray-400">{order.customer_email} · {new Date(order.created_at).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-sm">${(order.total_cents / 100).toFixed(2)}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[order.status] ?? 'bg-gray-100 text-gray-600'}`}>{order.status}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
