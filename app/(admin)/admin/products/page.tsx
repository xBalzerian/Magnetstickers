export const dynamic = 'force-dynamic'

import { supabaseAdmin } from '@/lib/supabase'
import Link from 'next/link'
import Image from 'next/image'

async function getProducts() {
  const { data } = await supabaseAdmin().from('products')
    .select('*, categories(name)')
    .order('created_at', { ascending: false })
    .limit(200)
  return data ?? []
}

export default async function AdminProducts() {
  const products = await getProducts()
  const active = products.filter(p => p.is_active).length

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">🧲 Products</h1>
          <p className="text-gray-500 text-sm">{products.length} total · {active} active</p>
        </div>
        <Link href="/admin/batches" className="bg-pink-500 hover:bg-pink-600 text-white font-bold px-4 py-2 rounded-xl text-sm transition-colors">
          + Generate More
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
        {products.map((p: any) => (
          <div key={p.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
            <div className="aspect-square bg-gray-50 relative">
              {p.images?.[0] ? (
                <Image src={p.images[0]} alt={p.name} fill className="object-contain p-3" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-4xl">🧲</div>
              )}
              <div className={`absolute top-2 right-2 w-2.5 h-2.5 rounded-full ${p.is_active ? 'bg-green-400' : 'bg-gray-300'}`} />
            </div>
            <div className="p-3">
              <p className="text-xs text-pink-500 mb-0.5">{(p.categories as any)?.name}</p>
              <p className="text-xs font-semibold text-gray-800 line-clamp-2">{p.name}</p>
              <p className="text-xs font-bold text-pink-600 mt-1">${(p.price_cents / 100).toFixed(2)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
