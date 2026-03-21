export const dynamic = 'force-dynamic'

import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import type { Category } from '@/types/database'
import AnimatedHero from '@/components/store/AnimatedHero'

export const metadata: Metadata = {
  title: 'Magnet Stickers — The World\'s Biggest Die-Cut Magnet Store | Ships Worldwide',
  description: 'Thousands of unique AI-illustrated die-cut magnet stickers. Dog breeds, cats, wildlife, fruits, quotes & more. Premium 20mil vinyl, vivid colors. Ships worldwide.',
  openGraph: {
    title: 'Magnet Stickers — The World\'s Biggest Die-Cut Magnet Store',
    description: 'Thousands of unique designs. Ships worldwide. Premium quality.',
    type: 'website',
  },
}

async function getMainCategories(): Promise<Category[]> {
  const { data } = await supabase.from('categories').select('*').eq('level', 1).eq('is_active', true).order('sort_order').limit(12)
  return data ?? []
}

async function getFeaturedProducts() {
  const { data } = await supabase.from('products').select('*, categories(name,slug)').eq('is_active', true).order('created_at', { ascending: false }).limit(12)
  return data ?? []
}

async function getBannerVideoUrl(): Promise<string | null> {
  // Check if we have a cached banner video stored in the DB settings
  try {
    const { data } = await supabase.from('settings').select('value').eq('key', 'banner_video_url').single()
    return data?.value ?? null
  } catch {
    return null
  }
}

const CAT_CONFIG: Record<string, { emoji: string; gradient: string; text: string }> = {
  animals:       { emoji: '🐾', gradient: 'from-amber-500 to-orange-500',  text: 'text-white' },
  fruits:        { emoji: '🍎', gradient: 'from-red-500 to-rose-500',      text: 'text-white' },
  vegetables:    { emoji: '🥦', gradient: 'from-green-500 to-emerald-500', text: 'text-white' },
  wildlife:      { emoji: '🦁', gradient: 'from-yellow-500 to-amber-500',  text: 'text-white' },
  quotes:        { emoji: '💬', gradient: 'from-blue-500 to-indigo-500',   text: 'text-white' },
  'food-drinks': { emoji: '🍕', gradient: 'from-orange-500 to-red-500',    text: 'text-white' },
  nature:        { emoji: '🌿', gradient: 'from-teal-500 to-green-500',    text: 'text-white' },
  hobbies:       { emoji: '🎮', gradient: 'from-purple-500 to-violet-500', text: 'text-white' },
  spiritual:     { emoji: '🔮', gradient: 'from-violet-500 to-purple-600', text: 'text-white' },
  seasonal:      { emoji: '🎄', gradient: 'from-pink-500 to-rose-500',     text: 'text-white' },
}

export default async function HomePage() {
  const [categories, featured, bannerVideoUrl] = await Promise.all([
    getMainCategories(),
    getFeaturedProducts(),
    getBannerVideoUrl(),
  ])

  const featuredImages = featured.flatMap((p: any) => p.images ?? []).slice(0, 6)

  return (
    <div className="min-h-screen bg-white">

      {/* ── ANIMATED HERO ── */}
      <AnimatedHero bannerVideoUrl={bannerVideoUrl} featuredImages={featuredImages} />

      {/* ── STATS STRIP ── */}
      <section className="bg-gradient-to-r from-pink-600 to-purple-700 text-white py-4">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap items-center justify-center gap-6 md:gap-16 text-center">
          {[
            ['1,000+', 'Unique Designs'],
            ['190+', 'Countries Shipped'],
            ['⭐ 4.9', 'Customer Rating'],
            ['20mil', 'Premium Vinyl'],
            ['24h', 'Production Start'],
          ].map(([num, label]) => (
            <div key={label} className="flex flex-col items-center">
              <div className="text-xl md:text-2xl font-black">{num}</div>
              <div className="text-xs text-white/70 mt-0.5">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      <section className="py-24 px-4 bg-gray-950 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <span className="bg-pink-500/20 text-pink-400 text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-widest">Collections</span>
            <h2 className="text-4xl md:text-5xl font-black mt-4 mb-3">
              Find Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">Perfect Magnet</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-xl mx-auto">From your favorite dog breed to tropical fruits — there&apos;s a magnet for everything</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {categories.map(cat => {
              const cfg = CAT_CONFIG[cat.slug] ?? { emoji: '🏷️', gradient: 'from-gray-600 to-gray-700', text: 'text-white' }
              return (
                <Link key={cat.id} href={`/shop/${cat.slug}`}
                  className="group relative overflow-hidden rounded-2xl aspect-square hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-2xl">
                  <div className={`absolute inset-0 bg-gradient-to-br ${cfg.gradient} opacity-90 group-hover:opacity-100 transition-opacity`} />
                  <div className="relative z-10 h-full flex flex-col items-center justify-center p-4">
                    <div className="text-5xl mb-3 drop-shadow-lg group-hover:scale-110 transition-transform duration-300">{cfg.emoji}</div>
                    <div className={`font-black text-sm text-center ${cfg.text} drop-shadow-md`}>{cat.name}</div>
                    <div className="mt-2 text-white/60 text-xs opacity-0 group-hover:opacity-100 transition-opacity">Shop now →</div>
                  </div>
                </Link>
              )
            })}

            {/* All categories tile */}
            <Link href="/shop"
              className="group relative overflow-hidden rounded-2xl aspect-square hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 border-2 border-dashed border-white/20" />
              <div className="relative z-10 h-full flex flex-col items-center justify-center p-4">
                <div className="text-5xl mb-3">✨</div>
                <div className="font-black text-sm text-center text-white">All Collections</div>
                <div className="mt-1 text-white/50 text-xs">100+ categories</div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ── NEW ARRIVALS ── */}
      {featured.length > 0 && (
        <section className="py-24 px-4 bg-black">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-14">
              <span className="bg-yellow-500/20 text-yellow-400 text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-widest">Just Dropped 🔥</span>
              <h2 className="text-4xl md:text-5xl font-black mt-4 mb-3 text-white">New Arrivals</h2>
              <p className="text-gray-500 text-lg">Fresh AI-illustrated designs — added daily</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {featured.map((product: any) => (
                <Link key={product.id} href={`/product/${product.slug}`}
                  className="group bg-gray-900 rounded-2xl overflow-hidden border border-white/5 hover:border-pink-500/50 hover:shadow-2xl hover:shadow-pink-500/10 hover:-translate-y-2 transition-all duration-300">
                  <div className="aspect-square relative overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900">
                    {product.images?.[0] ? (
                      <Image src={product.images[0]} alt={product.name} fill
                        className="object-contain p-3 group-hover:scale-110 transition-transform duration-500"
                        sizes="(max-width: 640px) 50vw, 20vw" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-5xl">🧲</div>
                    )}
                    <div className="absolute top-2 left-2 bg-pink-500 text-white text-xs font-black px-2 py-0.5 rounded-full">NEW</div>
                  </div>
                  <div className="p-3">
                    <p className="text-xs text-pink-400 font-semibold mb-1 uppercase tracking-wide truncate">{product.categories?.name}</p>
                    <h3 className="font-bold text-white text-xs line-clamp-2 leading-snug">{product.name}</h3>
                    <p className="text-pink-400 font-black text-sm mt-2">$11.99</p>
                  </div>
                </Link>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link href="/shop"
                className="inline-flex items-center gap-2 bg-white text-gray-900 hover:bg-pink-500 hover:text-white font-black py-4 px-10 rounded-2xl text-lg transition-all shadow-xl hover:shadow-pink-500/30">
                View All Products →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── PRINTFUL QUALITY SECTION ── */}
      <section className="py-24 px-4 bg-gray-950 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="bg-white/10 text-white/70 text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-widest">Printful Quality</span>
              <h2 className="text-4xl md:text-5xl font-black mt-4 mb-6 leading-tight">
                Every Magnet is a<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">Work of Art</span>
              </h2>
              <p className="text-gray-400 text-lg leading-relaxed mb-8">
                Our die-cut magnets are produced by Printful — the world&apos;s leading print-on-demand company.
                Every order is printed on demand using professional-grade equipment.
              </p>
              <div className="space-y-4">
                {[
                  { icon: '✂️', title: 'Die-Cut to Exact Shape', desc: 'Precision cut to the exact outline of each design — no rectangular borders' },
                  { icon: '🎨', title: '20mil Premium Vinyl', desc: 'Thick, durable flexible vinyl with strong magnetic backing. Lasts for years.' },
                  { icon: '🖨️', title: '150+ DPI Print Quality', desc: 'Vivid, full-color printing at professional resolution — every detail sharp' },
                  { icon: '📐', title: 'Printful Spec Compliant', desc: 'All designs prepared with 3mm bleed, safe zones, and proper color profiles' },
                ].map(item => (
                  <div key={item.title} className="flex items-start gap-4 bg-white/5 rounded-xl p-4 border border-white/10">
                    <span className="text-2xl flex-shrink-0">{item.icon}</span>
                    <div>
                      <div className="font-bold text-white text-sm">{item.title}</div>
                      <div className="text-gray-500 text-xs mt-0.5">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Visual — magnet showcase */}
            <div className="relative">
              <div className="grid grid-cols-3 gap-3">
                {featured.slice(0, 9).map((p: any, i: number) => (
                  <div key={p.id}
                    className={`rounded-2xl overflow-hidden border border-white/10 aspect-square bg-gray-900 ${i === 4 ? 'border-pink-500 shadow-lg shadow-pink-500/30 scale-110 z-10' : ''}`}>
                    {p.images?.[0] ? (
                      <Image src={p.images[0]} alt={p.name} width={150} height={150} className="w-full h-full object-contain p-2" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-3xl">🧲</div>
                    )}
                  </div>
                ))}
                {featured.length < 9 && Array.from({ length: 9 - featured.length }).map((_, i) => (
                  <div key={`ph-${i}`} className="rounded-2xl bg-white/5 border border-white/5 aspect-square flex items-center justify-center text-3xl text-white/20">🧲</div>
                ))}
              </div>
              {/* Floating label */}
              <div className="absolute -bottom-4 -right-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-black px-4 py-2 rounded-xl text-sm shadow-xl">
                Fulfilled by Printful ✓
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-24 px-4 bg-black text-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="bg-blue-500/20 text-blue-400 text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-widest">How It Works</span>
            <h2 className="text-4xl md:text-5xl font-black mt-4 text-white">From Click to Fridge 🧲</h2>
          </div>
          <div className="relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-10 left-1/8 right-1/8 h-0.5 bg-gradient-to-r from-pink-500 to-purple-500 opacity-30" style={{left: '12.5%', right: '12.5%'}} />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                { step: '01', icon: '🔍', title: 'Browse 1,000+ designs', desc: 'Find the perfect magnet from our massive collection' },
                { step: '02', icon: '🛒', title: 'Add to cart', desc: 'Pick your quantity — order 1 or 100' },
                { step: '03', icon: '💳', title: 'Secure checkout', desc: 'Pay with PayPal or major credit card — 100% secure' },
                { step: '04', icon: '📬', title: 'Delivered to you', desc: 'Printed & shipped by Printful in 3–7 business days' },
              ].map((item) => (
                <div key={item.step} className="relative text-center">
                  <div className="relative inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-pink-500/20 to-purple-500/20 border border-white/10 rounded-2xl mb-4">
                    <span className="text-3xl">{item.icon}</span>
                    <div className="absolute -top-2 -right-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white text-xs font-black w-6 h-6 rounded-full flex items-center justify-center">
                      {item.step}
                    </div>
                  </div>
                  <h3 className="font-bold text-white mb-2 text-sm">{item.title}</h3>
                  <p className="text-gray-600 text-xs leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-24 px-4 bg-gray-950 text-white">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-black mb-3">People Are Obsessed 🧲</h2>
          <p className="text-gray-500 mb-14 text-lg">Thousands of happy customers worldwide</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { quote: 'Ordered the Shih Tzu magnet for my mom and she literally cried. The detail is unreal. Already ordered 12 more designs.', name: 'Jessica M.', country: '🇺🇸 USA', stars: 5 },
              { quote: 'Ships super fast to the Philippines! The die-cut quality is insane — looks exactly like my golden retriever. My fridge is full now lol.', name: 'Carlo R.', country: '🇵🇭 Philippines', stars: 5 },
              { quote: 'I have 40+ on my fridge. My friends always ask where I got them. This store is genuinely the best thing I\'ve found online.', name: 'Sarah K.', country: '🇬🇧 UK', stars: 5 },
            ].map(t => (
              <div key={t.name} className="bg-white/5 border border-white/10 rounded-2xl p-6 text-left hover:bg-white/8 transition-colors">
                <div className="flex gap-0.5 mb-4">
                  {Array(t.stars).fill(0).map((_, i) => <span key={i} className="text-yellow-400 text-lg">★</span>)}
                </div>
                <p className="text-gray-300 text-sm leading-relaxed mb-5">&ldquo;{t.quote}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white font-black text-sm">
                    {t.name[0]}
                  </div>
                  <div>
                    <div className="font-bold text-white text-sm">{t.name}</div>
                    <div className="text-xs text-gray-500">{t.country}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="py-24 px-4 bg-black text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-pink-600/10 via-purple-600/10 to-pink-600/10 animate-pulse" style={{ animationDuration: '4s' }} />
        <div className="relative max-w-3xl mx-auto">
          <div className="text-6xl mb-6">🧲</div>
          <h2 className="text-4xl md:text-6xl font-black mb-4 leading-tight">
            Ready to<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">
              Magnify Your World?
            </span>
          </h2>
          <p className="text-gray-400 text-xl mb-10">Thousands of designs waiting for you. Ships to your door, anywhere on Earth.</p>
          <Link href="/shop"
            className="inline-block bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 text-white font-black py-5 px-14 rounded-2xl text-2xl transition-all shadow-2xl hover:shadow-pink-500/40 hover:-translate-y-1 transform">
            🛍️ Start Shopping
          </Link>
          <p className="text-gray-600 text-sm mt-5">Free shipping on orders over $35 · Ships to 190+ countries</p>
        </div>
      </section>

    </div>
  )
}
