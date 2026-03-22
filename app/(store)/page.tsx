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

// Category card colors — warm earthy palette that works on cream bg
const CAT_STYLES: Record<string, { bg: string; border: string; text: string }> = {
  animals:       { bg: '#FFF3EB', border: '#F4A87A', text: '#7A2D0D' },
  fruits:        { bg: '#FFF0EE', border: '#F08070', text: '#7A1F15' },
  vegetables:    { bg: '#EDFAF1', border: '#7ACA90', text: '#1A5C2E' },
  wildlife:      { bg: '#FFFBEB', border: '#F0C060', text: '#7A4A05' },
  quotes:        { bg: '#EEF4FF', border: '#80A8F0', text: '#1A3580' },
  'food-drinks': { bg: '#FFF5EE', border: '#F0A060', text: '#7A3510' },
  nature:        { bg: '#EDFAF7', border: '#60C8B0', text: '#0D5040' },
  hobbies:       { bg: '#F5F0FF', border: '#B090F0', text: '#4A1A80' },
  spiritual:     { bg: '#F8F0FF', border: '#C090E0', text: '#5A1A70' },
  seasonal:      { bg: '#FFF0F7', border: '#F090C0', text: '#7A1A50' },
}

export default async function HomePage() {
  const [categories, newArrivals] = await Promise.all([
    getMainCategories(),
    getNewArrivals(),
  ])

  const featuredImages = newArrivals.flatMap((p: any) => p.images ?? []).filter(Boolean).slice(0, 8)

  return (
    <div style={{ background: '#F5F0E8', color: '#1C1410' }}>

      {/* ── HERO (dark bg — white text is correct here) ── */}
      <AnimatedHero bannerVideoUrl={BANNER_VIDEO} featuredImages={featuredImages} />

      {/* ── STATS STRIP ── */}
      <section className="border-y py-5" style={{ borderColor: '#DDD7CB', background: '#EDE8DE' }}>
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          {[
            ['1,000+', 'Unique Designs'],
            ['190+',   'Countries Shipped'],
            ['4.9★',   'Star Rating'],
            ['20mil',  'Premium Vinyl'],
          ].map(([num, label]) => (
            <div key={label}>
              <div className="text-2xl sm:text-3xl font-black" style={{ color: '#C8341A' }}>{num}</div>
              <div className="text-xs mt-0.5 uppercase tracking-widest font-semibold" style={{ color: '#6B5B52' }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      {categories.length > 0 && (
        <section className="py-20 sm:py-28 px-4" style={{ background: '#F5F0E8' }}>
          <div className="max-w-7xl mx-auto">
            <div className="mb-12">
              <p className="text-xs font-bold uppercase tracking-[0.3em] mb-3" style={{ color: '#C8341A' }}>Collections</p>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black" style={{ color: '#1C1410' }}>
                Find Your{' '}
                <span className="text-transparent bg-clip-text"
                  style={{ backgroundImage: 'linear-gradient(135deg, #C8341A, #E85A20)' }}>
                  Perfect Magnet
                </span>
              </h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
              {categories.map((cat: any) => {
                const s = CAT_STYLES[cat.slug] ?? { bg: '#FBF8F3', border: '#DDD7CB', text: '#1C1410' }
                return (
                  <Link key={cat.id} href={`/shop/${cat.slug}`}
                    className="group relative rounded-2xl aspect-[4/3] overflow-hidden border transition-all duration-300 hover:scale-[1.02] hover:shadow-xl active:scale-[0.98]"
                    style={{ background: s.bg, borderColor: s.border }}>
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-5">
                      <div className="font-black text-base sm:text-lg mb-1.5 text-center leading-tight"
                        style={{ color: s.text }}>{cat.name}</div>
                      <div className="text-xs font-semibold opacity-60" style={{ color: s.text }}>Explore →</div>
                    </div>
                  </Link>
                )
              })}

              {/* All collections */}
              <Link href="/shop"
                className="group relative rounded-2xl aspect-[4/3] overflow-hidden border border-dashed transition-all hover:scale-[1.02] active:scale-[0.98]"
                style={{ borderColor: '#C8341A', background: '#FFF5F3' }}>
                <div className="absolute inset-0 flex flex-col items-center justify-center p-5">
                  <div className="font-black text-base sm:text-lg mb-1.5 group-hover:text-[#C8341A] transition-colors"
                    style={{ color: '#7A2D0D' }}>All Collections</div>
                  <div className="text-xs font-semibold" style={{ color: '#C8341A' }}>100+ categories</div>
                </div>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── NEW ARRIVALS ── */}
      {newArrivals.length > 0 && (
        <section className="py-20 sm:py-28 px-4 border-t" style={{ background: '#EDE8DE', borderColor: '#DDD7CB' }}>
          <div className="max-w-7xl mx-auto">
            <div className="flex items-end justify-between mb-12">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.3em] mb-3" style={{ color: '#C8341A' }}>Just Dropped</p>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black" style={{ color: '#1C1410' }}>New Arrivals</h2>
              </div>
              <Link href="/shop"
                className="hidden sm:inline-flex items-center gap-2 text-sm font-semibold border px-4 py-2 rounded-xl transition-all hover:border-[#C8341A] hover:text-[#C8341A]"
                style={{ color: '#6B5B52', borderColor: '#DDD7CB' }}>
                View all →
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
              {newArrivals.map((product: any) => (
                <Link key={product.id} href={`/product/${product.slug}`}
                  className="group rounded-2xl overflow-hidden border transition-all duration-300 hover:-translate-y-1 hover:shadow-lg active:scale-[0.97]"
                  style={{ background: '#FBF8F3', borderColor: '#E5DFD5' }}>
                  <div className="aspect-square relative overflow-hidden"
                    style={{ background: 'linear-gradient(135deg, #EDE8DE, #E5DFD5)' }}>
                    {product.images?.[0] ? (
                      <Image src={product.images[0]} alt={product.name} fill
                        className="object-contain p-3 group-hover:scale-110 transition-transform duration-500"
                        sizes="(max-width: 640px) 50vw, 20vw"
                        unoptimized />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="w-10 h-10 rounded-full border border-[#DDD7CB] bg-[#EDE8DE]" />
                      </div>
                    )}
                    <div className="absolute top-2 left-2 text-white text-[10px] font-black px-2 py-0.5 rounded-full tracking-wide"
                      style={{ background: '#C8341A' }}>NEW</div>
                  </div>
                  <div className="p-3">
                    {product.categories?.name && (
                      <p className="text-[10px] font-bold uppercase tracking-widest mb-1 truncate"
                        style={{ color: '#C8341A' }}>{product.categories.name}</p>
                    )}
                    <h3 className="font-bold text-xs sm:text-sm line-clamp-2 leading-snug mb-2"
                      style={{ color: '#1C1410' }}>{product.name}</h3>
                    <p className="font-black text-sm" style={{ color: '#C8341A' }}>
                      ${((product.price_cents ?? 1199) / 100).toFixed(2)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>

            <div className="text-center mt-10 sm:hidden">
              <Link href="/shop"
                className="inline-flex items-center gap-2 border font-semibold py-3 px-8 rounded-xl transition-all text-sm hover:border-[#C8341A] hover:text-[#C8341A]"
                style={{ color: '#6B5B52', borderColor: '#DDD7CB' }}>
                View all magnets
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── QUALITY SECTION ── */}
      <section className="py-20 sm:py-28 px-4 border-t" style={{ background: '#F5F0E8', borderColor: '#DDD7CB' }}>
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.3em] mb-4" style={{ color: '#C8341A' }}>Printful Quality</p>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight mb-6" style={{ color: '#1C1410' }}>
                Every Magnet is a<br />
                <span className="text-transparent bg-clip-text"
                  style={{ backgroundImage: 'linear-gradient(135deg, #C8341A, #E85A20)' }}>
                  Work of Art
                </span>
              </h2>
              <p className="text-base leading-relaxed mb-8 max-w-md" style={{ color: '#5A4A42' }}>
                Printed on premium 20mil vinyl with UV-resistant ink that stays vivid for years. Die-cut to exact shape, every edge is perfect.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  ['20mil Vinyl', 'Thick, durable premium material'],
                  ['UV Resistant', 'Colors stay vivid for years'],
                  ['Die-Cut',     'Precision-cut to exact shape'],
                  ['Worldwide',   'Ships to 190+ countries'],
                ].map(([title, desc]) => (
                  <div key={title} className="rounded-2xl p-4 border"
                    style={{ background: '#FBF8F3', borderColor: '#DDD7CB' }}>
                    <div className="font-black text-sm mb-1" style={{ color: '#1C1410' }}>{title}</div>
                    <div className="text-xs leading-snug" style={{ color: '#6B5B52' }}>{desc}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Visual stats */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { value: '1,000+',  label: 'Unique designs in store' },
                { value: '$11.99',  label: 'Starting price per magnet' },
                { value: '3–7',     label: 'Business days to your door' },
                { value: '4.9★',    label: 'Average customer rating' },
              ].map(s => (
                <div key={s.label}
                  className="border rounded-3xl p-6 flex flex-col justify-between aspect-square"
                  style={{ background: '#FBF8F3', borderColor: '#DDD7CB' }}>
                  <div className="text-3xl sm:text-4xl font-black" style={{ color: '#C8341A' }}>{s.value}</div>
                  <div className="text-xs leading-snug" style={{ color: '#6B5B52' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="py-20 sm:py-28 px-4 border-t" style={{ background: '#1C1410', borderColor: '#DDD7CB' }}>
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs font-bold uppercase tracking-[0.3em] mb-4" style={{ color: 'rgba(245,240,232,0.4)' }}>Ready to start?</p>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black mb-6 leading-tight" style={{ color: '#F5F0E8' }}>
            Find the perfect magnet<br />
            <span className="text-transparent bg-clip-text"
              style={{ backgroundImage: 'linear-gradient(135deg, #F07030, #C8341A)' }}>
              for every moment
            </span>
          </h2>
          <p className="text-base mb-10" style={{ color: 'rgba(245,240,232,0.45)' }}>
            From refrigerator art to locker decor — something for everyone.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/shop"
              className="group relative overflow-hidden font-black py-4 px-12 rounded-2xl text-base transition-all hover:scale-[1.02] shadow-xl active:scale-[0.98]"
              style={{ background: 'linear-gradient(135deg, #C8341A, #E85A20)', color: '#F5F0E8' }}>
              Shop All Magnets
            </Link>
            <Link href="/shop/animals-dogs"
              className="border font-bold py-4 px-12 rounded-2xl text-base transition-all hover:scale-[1.02] active:scale-[0.98]"
              style={{ borderColor: 'rgba(245,240,232,0.15)', color: 'rgba(245,240,232,0.75)' }}>
              Dog Breeds
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
