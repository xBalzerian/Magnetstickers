'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

const PROMPT_TEMPLATES = {
  animal: (subject: string) =>
    `cute kawaii ${subject} die-cut magnet sticker art, isolated on pure white background, clean die-cut edges, vibrant colors, chibi style illustration, high detail, no text, sticker-ready artwork`,
  wildlife: (subject: string) =>
    `adorable ${subject} wildlife die-cut magnet sticker, pure white background, clean edges, watercolor illustration style, vibrant natural colors, cute cartoon style, high detail, no text`,
  fruit: (subject: string) =>
    `cute ${subject} fruit character die-cut magnet sticker, smiling face, pure white background, clean edges, vibrant colors, kawaii style illustration, high detail, no text`,
  quote: (subject: string) =>
    `fun motivational quote sticker design: "${subject}", colorful lettering, die-cut magnet sticker style, white background, clean edges, playful typography with decorative elements`,
}

export default function BatchesPage() {
  const [categories, setCategories] = useState<any[]>([])
  const [selectedCat, setSelectedCat] = useState('')
  const [promptType, setPromptType] = useState<keyof typeof PROMPT_TEMPLATES>('animal')
  const [subjects, setSubjects] = useState('')
  const [previews, setPreviews] = useState<string[]>([])
  const [batches, setBatches] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [runningBatch, setRunningBatch] = useState<string | null>(null)
  const [result, setResult] = useState<any>(null)

  useEffect(() => {
    supabase.from('categories').select('*').order('level').order('name')
      .then(({ data }) => setCategories(data ?? []))
    loadBatches()
  }, [])

  async function loadBatches() {
    const { data } = await supabase.from('batches').select('*, categories(name)').order('created_at', { ascending: false }).limit(20)
    setBatches(data ?? [])
  }

  function generatePreviews() {
    const list = subjects.split('\n').map(s => s.trim()).filter(Boolean)
    const template = PROMPT_TEMPLATES[promptType]
    setPreviews(list.map(s => template(s)))
  }

  async function runBatch() {
    if (!selectedCat || previews.length === 0) return alert('Select a category and add subjects first')
    setLoading(true); setResult(null)
    try {
      const cat = categories.find(c => c.id === selectedCat)
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-secret': process.env.NEXT_PUBLIC_ADMIN_PW ?? 'magnets2025admin' },
        body: JSON.stringify({
          categoryId: selectedCat,
          prompts: previews,
          batchName: `${cat?.name} — ${new Date().toLocaleDateString()}`,
        }),
      })
      const data = await res.json()
      setResult(data)
      await loadBatches()
    } finally {
      setLoading(false)
    }
  }

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-700',
    running: 'bg-blue-100 text-blue-700 animate-pulse',
    completed: 'bg-green-100 text-green-700',
    failed: 'bg-red-100 text-red-700',
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">🎨 Design Generator</h1>
      <p className="text-gray-500 text-sm mb-8">Generate batches of AI magnet sticker designs via KIE Z-Image API</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        {/* Create batch */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="font-bold mb-5">New Batch</h2>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Category</label>
              <select value={selectedCat} onChange={e => setSelectedCat(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-pink-300">
                <option value="">— Select category —</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{' '.repeat((c.level - 1) * 2)}{c.level > 1 ? '└ ' : ''}{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Prompt Style</label>
              <div className="grid grid-cols-2 gap-2">
                {(Object.keys(PROMPT_TEMPLATES) as (keyof typeof PROMPT_TEMPLATES)[]).map(t => (
                  <button key={t} onClick={() => setPromptType(t)}
                    className={`py-2 px-3 rounded-xl text-sm font-medium border transition-all capitalize ${promptType === t ? 'border-pink-400 bg-pink-50 text-pink-600' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">
                Subjects <span className="text-gray-400 font-normal">(one per line, max 10)</span>
              </label>
              <textarea value={subjects} onChange={e => setSubjects(e.target.value)} rows={6}
                placeholder={"Shih Tzu\nGolden Retriever\nFrench Bulldog\nCorgi\nPomeranian"}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-pink-300 font-mono" />
            </div>

            <button onClick={generatePreviews} className="w-full border-2 border-pink-300 text-pink-600 font-semibold py-2.5 rounded-xl hover:bg-pink-50 transition-colors text-sm">
              👁 Preview Prompts ({subjects.split('\n').filter(s => s.trim()).length})
            </button>
          </div>
        </div>

        {/* Prompts preview */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="font-bold mb-4">Prompt Preview</h2>
          {previews.length === 0 ? (
            <div className="text-center text-gray-400 py-12 text-sm">Click "Preview Prompts" to see generated prompts</div>
          ) : (
            <div className="space-y-2 max-h-72 overflow-y-auto mb-5">
              {previews.map((p, i) => (
                <div key={i} className="bg-gray-50 rounded-lg px-3 py-2 text-xs text-gray-600 font-mono leading-relaxed">
                  {i + 1}. {p}
                </div>
              ))}
            </div>
          )}

          {previews.length > 0 && (
            <>
              {result && (
                <div className={`rounded-xl p-3 text-sm mb-4 ${result.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                  {result.success
                    ? `✅ Generated ${result.generated}/${previews.length} designs. ${result.failed} failed.`
                    : `❌ Error: ${result.error}`}
                </div>
              )}
              <button onClick={runBatch} disabled={loading}
                className="w-full bg-pink-500 hover:bg-pink-600 disabled:bg-pink-300 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2">
                {loading ? <><span className="animate-spin">⚡</span> Generating ({previews.length} designs)…</> : `⚡ Run Batch (${previews.length} designs)`}
              </button>
              <p className="text-xs text-gray-400 mt-2 text-center">~5-10 credits per image · {previews.length} images = ~{previews.length * 7} credits estimated</p>
            </>
          )}
        </div>
      </div>

      {/* Batch history */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-bold">Batch History</h2>
          <button onClick={loadBatches} className="text-sm text-pink-500 hover:underline">Refresh</button>
        </div>
        {batches.length === 0 ? (
          <div className="p-10 text-center text-gray-400">No batches yet</div>
        ) : (
          <div className="divide-y divide-gray-50">
            {batches.map(b => (
              <div key={b.id} className="flex items-center justify-between px-5 py-3">
                <div>
                  <p className="text-sm font-medium">{b.name}</p>
                  <p className="text-xs text-gray-400">{(b.categories as any)?.name} · {new Date(b.created_at).toLocaleString()}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-500">{b.generated}/{b.total} ✓ {b.failed > 0 ? `· ${b.failed} ✗` : ''}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[b.status] ?? 'bg-gray-100 text-gray-600'}`}>{b.status}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
