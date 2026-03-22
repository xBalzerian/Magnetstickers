export const dynamic = 'force-dynamic'

import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import type { Category } from '@/types/database'
import AnimatedHero from '@/components/store/AnimatedHero'

export const metadata: Metadata = {
  title: "MagnetStickers — World's Largest Die-Cut Magnet Store | Ships Worldwide",
  description: 'Thousands of unique AI-illustrated die-cut magnet stickers. Dog breeds, cats, wildlife, fruits, quotes & more. Premium 20mil vinyl, vivid colors. Ships worldwide.',
}

// Hardcoded banner assets — Nano Banana 2 + Kling 2.6 animated
const BANNER_VIDEO = "https://base44.app/api/apps/69bd2ede6bb1b2abf1f6b9ff/files/mp/public/69bd2ede6bb1b2abf1f6b9ff/3d42b7524_banner_video_1.mp4"
const BANNER_IMAGE = "https://base44.app/api/apps/69bd2ede6bb1b2abf1f6b9ff/files/mp/public/69bd2ede6bb1b2abf1f6b9ff/3013a08c5_banner_1.jpg"

async function getMainCategories(): Promise<Category[]> {
  const { data } = await supabase.from('categories').select('*').eq('level', 1).eq('is_active', true).order('sort_order').limit(12)
  return data ?? []
}

async function getNewArrivals() {
  const { data } = await supabase.from('products').select('*, categories(name,slug)').eq('is_active', true).order('created_at', { ascending: false }).limit(18)
  return data ?? []
}

const CAT_ACCENTS: Record<string, string> = {
  animals:       'from-orange-900/40 to-amber-900/20 border-orange-500/20',
  fruits:        'from-red-900/40 to-rose-900/20 border-red-500/20',
  vegetables:    'from-green-900/40 to-emerald-900/20 border-green-500/20',
  wildlife:      'from-yellow-900/40 to-amber-900/20 border-yellow-500/20',
  quotes:        'from-blue-900/40 to-indigo-900/20 border-blue-500/20',
  'food-drinks': 'from-orange-900/40 to-red-900/20 border-orange-500/20',
  nature:        'from-teal-900/40 to-green-900/20 border-teal-500/20',
  hobbies:       'from-purple-900/40 to-violet-900/20 border-purple-500/20',
  spiritual:     'from-violet-900/40 to-purple-900/20 border-violet-500/20',
  seasonal:      'from-pink-900/40 to-rose-900/20 border-pink-500/20',
}

export default async function HomePage() {
  const [categories, newArrivals] = await Promise.all([
    getMainCategories(),
    getNewArrivals(),
  ])

  const featuredImages = newArrivals.flatMap((p: any) => p.images ?? []).filter(Boolean).slice(0, 8)

  return (
    <div style={{ background: '#F5F0E8', color: '#1C1410' }}>

      {/* HERO */}
      <AnimatedHero bannerVideoUrl={BANNER_VIDEO} featuredImages={featuredImages} />

      {/* STATS STRIP */}
      <section className="border-y py-5" style={{ borderColor: '#DDD7CB', background: '#EDE8DE' }}>
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          {[
            ['1,000+', 'Unique Designs'],
            ['190+', 'Countries Shipped'],
            ['4.9', 'Star Rating'],
            ['20mil', 'Premium Vinyl'],
          ].map(([num, label]) => (
            <div key={label}>
              <div className="text-2xl sm:text-3xl font-black" style={{ color: '#1C1410' }}>{num}</div>
              <div className="text-xs mt-0.5 uppercase tracking-widest font-medium opacity-40">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CATEGORIES */}
      {categories.length > 0 && (
        <section className="py-20 sm:py-28 px-4" style={{ background: '#F5F0E8' }}>
          <div className="max-w-7xl mx-auto">
            <div className="mb-12">
              <p className="text-xs font-bold text-white/30 uppercase tracking-[0.3em] mb-3">Collections</p>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black">
                Find Your{' '}
                <span className="text-transparent bg-clip-text"
                  style={{ backgroundImage: 'linear-gradient(135deg, #f472b6, #a855f7)' }}>
                  Perfect Magnet
                </span>
              </h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
              {categories.map(cat => {
                const accent = CAT_ACCENTS[cat.slug] ?? 'border-[#DDD7CB]'
                return (
                  <Link key={cat.id} href={`/shop/${cat.slug}`}
                    className={`group relative rounded-2xl aspect-[4/3] overflow-hidden border bg-gradient-to-br ${accent} hover:border-pink-500/40 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-pink-500/10 active:scale-[0.98]`}>
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-5">
                      <div className="font-black text-base sm:text-lg text-white mb-1.5 text-center leading-tight">{cat.name}</div>
                      <div className="text-xs text-white/30 font-medium">Explore</div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                  </Link>
                )
              })}

              {/* All collections */}
              <Link href="/shop"
                className="group relative rounded-2xl aspect-[4/3] overflow-hidden border border-dashed border-white/10 hover:border-pink-500/30 bg-white/2 transition-all hover:scale-[1.02] active:scale-[0.98]">
                <div className="absolute inset-0 flex flex-col items-center justify-center p-5">
                  <div className="font-black text-base sm:text-lg text-white/60 group-hover:text-white mb-1.5 transition-colors">All Collections</div>
                  <div className="text-xs text-white/25">100+ categories</div>
                </div>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* NEW ARRIVALS */}
      {newArrivals.length > 0 && (
        <section className="py-20 sm:py-28 px-4 border-t" style={{ background: '#EDE8DE', borderColor: '#DDD7CB' }}>
          <div className="max-w-7xl mx-auto">
            <div className="flex items-end justify-between mb-12">
              <div>
                <p className="text-xs font-bold text-white/30 uppercase tracking-[0.3em] mb-3">Just Dropped</p>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white">New Arrivals</h2>
              </div>
              <Link href="/shop"
                className="hidden sm:inline-flex items-center gap-2 text-sm text-white/40 hover:text-white border border-white/10 hover:border-white/25 px-4 py-2 rounded-xl transition-all">
                View all
                <span className="text-white/20">→</span>
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
              {newArrivals.map((product: any) => (
                <Link key={product.id} href={`/product/${product.slug}`}
                  className="group rounded-2xl overflow-hidden border transition-all duration-300 hover:-translate-y-1 hover:shadow-lg active:scale-[0.97]" style={{ background: '#FBF8F3', borderColor: '#E5DFD5' }}>
                  <div className="aspect-square relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #EDE8DE, #E5DFD5)' }}>
                    {product.images?.[0] ? (
                      <Image src={product.images[0]} alt={product.name} fill
                        className="object-contain p-3 group-hover:scale-108 transition-transform duration-500"
                        sizes="(max-width: 640px) 50vw, 20vw" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="w-10 h-10 rounded-full border border-white/8 bg-white/3" />
                      </div>
                    )}
                    <div className="absolute top-2 left-2 bg-pink-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full tracking-wide">NEW</div>
                  </div>
                  <div className="p-3">
                    {product.categories?.name && (
                      <p className="text-[10px] text-pink-400/70 font-bold uppercase tracking-widest mb-1 truncate">{product.categories.name}</p>
                    )}
                    <h3 className="font-bold text-xs sm:text-sm line-clamp-2 leading-snug mb-2" style={{ color: '#1C1410' }}>{product.name}</h3>
                    <p className="font-black text-sm" style={{ color: '#C8341A' }}>${((product.price_cents ?? 1199)/100).toFixed(2)}</p>
                  </div>
                </Link>
              ))}
            </div>

            <div className="text-center mt-10 sm:hidden">
              <Link href="/shop"
                className="inline-flex items-center gap-2 border border-white/10 text-white/60 hover:text-white hover:border-white/25 font-semibold py-3 px-8 rounded-xl transition-all text-sm">
                View all magnets
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* QUALITY SECTION */}
      <section className="py-20 sm:py-28 px-4 border-t" style={{ background: '#EDE8DE', borderColor: '#DDD7CB' }}>
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <p className="text-xs font-bold text-white/30 uppercase tracking-[0.3em] mb-4">Printful Quality</p>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight mb-6">
                Every Magnet is a<br />
                <span className="text-transparent bg-clip-text"
                  style={{ backgroundImage: 'linear-gradient(135deg, #f472b6, #a855f7)' }}>
                  Work of Art
                </span>
              </h2>
              <p className="text-white/40 text-base leading-relaxed mb-8 max-w-md">
                Printed on premium 20mil vinyl with UV-resistant ink that stays vivid for years. Die-cut to exact shape, every edge is perfect.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  ['20mil Vinyl', 'Thick, durable premium material'],
                  ['UV Resistant', 'Colors stay vivid for years'],
                  ['Die-Cut', 'Precision-cut to exact shape'],
                  ['Worldwide', 'Ships to 190+ countries'],
                ].map(([title, desc]) => (
                  <div key={title} className="bg-white/3 border border-white/8 rounded-2xl p-4">
                    <div className="font-black text-white text-sm mb-1">{title}</div>
                    <div className="text-xs text-white/30 leading-snug">{desc}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Visual stats */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { value: '1,000+', label: 'Unique designs in store' },
                { value: '$11.99', label: 'Starting price per magnet' },
                { value: '3-7', label: 'Business days to your door' },
                { value: '4.9★', label: 'Average customer rating' },
              ].map(s => (
                <div key={s.label}
                  className="bg-white/3 border border-white/8 rounded-3xl p-6 flex flex-col justify-between aspect-square">
                  <div className="text-3xl sm:text-4xl font-black text-white">{s.value}</div>
                  <div className="text-xs text-white/30 leading-snug">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="py-20 sm:py-28 px-4 border-t" style={{ background: '#EDE8DE', borderColor: '#DDD7CB' }}>
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs font-bold text-white/30 uppercase tracking-[0.3em] mb-4">Ready to start?</p>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black mb-6 leading-tight">
            Find the perfect magnet<br />
            <span className="text-transparent bg-clip-text"
              style={{ backgroundImage: 'linear-gradient(135deg, #f472b6, #a855f7, #6366f1)' }}>
              for every moment
            </span>
          </h2>
          <p className="text-white/30 text-base mb-10">From refrigerator art to locker decor — something for everyone.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/shop"
              className="group relative overflow-hidden bg-white text-black font-black py-4 px-12 rounded-2xl text-base transition-all hover:scale-[1.02] shadow-2xl active:scale-[0.98]">
              <span className="relative z-10 group-hover:text-white transition-colors duration-300">Shop All Magnets</span>
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-600 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </Link>
            <Link href="/shop/animals-dogs"
              className="border border-white/10 hover:border-white/25 text-white/70 hover:text-white font-bold py-4 px-12 rounded-2xl text-base transition-all hover:scale-[1.02] hover:bg-white/5 active:scale-[0.98]">
              Dog Breeds
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
