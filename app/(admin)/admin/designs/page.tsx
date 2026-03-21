'use client'
import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'
import { Check, X, Eye, ChevronLeft, ChevronRight } from 'lucide-react'

const STATUS_TABS = ['generated', 'approved', 'rejected', 'pending', 'generating'] as const
type StatusTab = typeof STATUS_TABS[number]

export default function DesignsPage() {
  const [designs, setDesigns] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState<StatusTab>('generated')
  const [counts, setCounts] = useState<Record<string, number>>({})
  const [page, setPage] = useState(0)
  const [preview, setPreview] = useState<any>(null)
  const PER_PAGE = 20

  const loadCounts = useCallback(async () => {
    const results = await Promise.all(STATUS_TABS.map(s =>
      supabase.from('designs').select('*', { count: 'exact', head: true }).eq('status', s)
    ))
    const c: Record<string, number> = {}
    STATUS_TABS.forEach((s, i) => { c[s] = results[i].count ?? 0 })
    setCounts(c)
  }, [])

  const loadDesigns = useCallback(async () => {
    const from = page * PER_PAGE
    const { data } = await supabase.from('designs')
      .select('*, categories(name)')
      .eq('status', activeTab)
      .order('created_at', { ascending: false })
      .range(from, from + PER_PAGE - 1)
    setDesigns(data ?? [])
  }, [activeTab, page])

  useEffect(() => { loadDesigns(); loadCounts() }, [loadDesigns, loadCounts])

  async function updateStatus(id: string, status: 'approved' | 'rejected') {
    await supabase.from('designs').update({ status }).eq('id', id)
    setDesigns(prev => prev.filter(d => d.id !== id))
    setCounts(prev => ({ ...prev, [activeTab]: (prev[activeTab] ?? 1) - 1, [status]: (prev[status] ?? 0) + 1 }))
  }

  async function publishDesign(design: any) {
    // Create a product from this design
    const categoryName = design.categories?.name ?? 'Magnet'
    const slug = `${categoryName.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`
    await supabase.from('products').insert({
      category_id: design.category_id,
      name: `${categoryName} Magnet Sticker`,
      slug,
      images: [design.image_url],
      price_cents: 1499,
      cost_cents: 383,
      is_active: true,
      tags: [categoryName.toLowerCase()],
    })
    await updateStatus(design.id, 'approved')
    alert('Published to store! ✅')
  }

  const tabColors: Record<StatusTab, string> = {
    generated: 'bg-blue-100 text-blue-700',
    approved: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-700',
    pending: 'bg-yellow-100 text-yellow-700',
    generating: 'bg-purple-100 text-purple-700',
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">🎨 Design Review</h1>
      <p className="text-gray-500 text-sm mb-6">Review AI-generated designs and publish to the store</p>

      {/* Status tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {STATUS_TABS.map(s => (
          <button key={s} onClick={() => { setActiveTab(s); setPage(0) }}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${activeTab === s ? tabColors[s] + ' ring-2 ring-offset-1' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
            {s.charAt(0).toUpperCase() + s.slice(1)}
            <span className="bg-white bg-opacity-60 px-1.5 rounded-full text-xs font-bold">{counts[s] ?? 0}</span>
          </button>
        ))}
      </div>

      {designs.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <div className="text-5xl mb-3">🖼</div>
          <p>No {activeTab} designs found</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
          {designs.map(d => (
            <div key={d.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow group">
              <div className="aspect-square bg-gray-50 relative overflow-hidden cursor-pointer" onClick={() => setPreview(d)}>
                {d.image_url ? (
                  <Image src={d.image_url} alt={d.prompt_used} fill className="object-contain p-3" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl text-gray-300">🧲</div>
                )}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all flex items-center justify-center">
                  <Eye size={20} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
              <div className="p-2.5">
                <p className="text-xs text-gray-500 truncate mb-2">{d.categories?.name}</p>
                {activeTab === 'generated' && (
                  <div className="flex gap-1.5">
                    <button onClick={() => publishDesign(d)}
                      className="flex-1 bg-green-500 hover:bg-green-600 text-white text-xs py-1.5 rounded-lg font-semibold flex items-center justify-center gap-1 transition-colors">
                      <Check size={12} /> Publish
                    </button>
                    <button onClick={() => updateStatus(d.id, 'rejected')}
                      className="w-8 bg-red-100 hover:bg-red-200 text-red-500 text-xs py-1.5 rounded-lg flex items-center justify-center transition-colors">
                      <X size={12} />
                    </button>
                  </div>
                )}
                {activeTab === 'approved' && (
                  <span className="block text-center text-xs text-green-600 font-medium">✅ Published</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="flex items-center justify-between mt-8">
        <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}
          className="flex items-center gap-1 text-sm text-gray-500 hover:text-pink-500 disabled:opacity-30">
          <ChevronLeft size={16} /> Prev
        </button>
        <span className="text-sm text-gray-400">Page {page + 1}</span>
        <button onClick={() => setPage(p => p + 1)} disabled={designs.length < PER_PAGE}
          className="flex items-center gap-1 text-sm text-gray-500 hover:text-pink-500 disabled:opacity-30">
          Next <ChevronRight size={16} />
        </button>
      </div>

      {/* Preview modal */}
      {preview && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4" onClick={() => setPreview(null)}>
          <div className="bg-white rounded-2xl max-w-lg w-full p-4" onClick={e => e.stopPropagation()}>
            <div className="aspect-square relative mb-4 bg-gray-50 rounded-xl overflow-hidden">
              {preview.image_url && <Image src={preview.image_url} alt={preview.prompt_used} fill className="object-contain p-6" />}
            </div>
            <p className="text-xs text-gray-500 font-mono leading-relaxed mb-4">{preview.prompt_used}</p>
            <div className="flex gap-3">
              <button onClick={() => { publishDesign(preview); setPreview(null) }}
                className="flex-1 bg-green-500 text-white font-bold py-2.5 rounded-xl hover:bg-green-600 transition-colors text-sm">
                ✅ Publish to Store
              </button>
              <button onClick={() => { updateStatus(preview.id, 'rejected'); setPreview(null) }}
                className="flex-1 bg-red-100 text-red-600 font-bold py-2.5 rounded-xl hover:bg-red-200 transition-colors text-sm">
                ❌ Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
