import { supabaseAdmin } from '@/lib/supabase'

async function getOrders() {
  const { data } = await supabaseAdmin().from('orders').select('*').order('created_at', { ascending: false }).limit(100)
  return data ?? []
}

export default async function AdminOrders() {
  const orders = await getOrders()

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-700', paid: 'bg-blue-100 text-blue-700',
    fulfilling: 'bg-purple-100 text-purple-700', shipped: 'bg-indigo-100 text-indigo-700',
    delivered: 'bg-green-100 text-green-700', cancelled: 'bg-red-100 text-red-700',
    refunded: 'bg-gray-100 text-gray-600',
  }

  const totalRevenue = orders.filter(o => ['paid','fulfilling','shipped','delivered'].includes(o.status))
    .reduce((s, o) => s + o.total_cents, 0)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">📦 Orders</h1>
          <p className="text-gray-500 text-sm">{orders.length} total · ${(totalRevenue / 100).toFixed(2)} revenue</p>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <div className="text-5xl mb-3">📭</div>
          <p>No orders yet</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {['Order ID', 'Customer', 'Total', 'Status', 'Printful', 'Tracking', 'Date'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {orders.map(order => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-gray-500">{order.id.slice(0, 8).toUpperCase()}</td>
                    <td className="px-4 py-3">
                      <p className="font-medium">{order.customer_name}</p>
                      <p className="text-xs text-gray-400">{order.customer_email}</p>
                    </td>
                    <td className="px-4 py-3 font-bold text-pink-600">${(order.total_cents / 100).toFixed(2)}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[order.status] ?? 'bg-gray-100'}`}>{order.status}</span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500">{order.printful_order_id ?? '—'}</td>
                    <td className="px-4 py-3 text-xs">
                      {order.tracking_url
                        ? <a href={order.tracking_url} target="_blank" className="text-pink-500 hover:underline">{order.tracking_number}</a>
                        : <span className="text-gray-400">{order.tracking_number ?? '—'}</span>}
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-400">{new Date(order.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
