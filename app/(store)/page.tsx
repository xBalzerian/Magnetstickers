export const dynamic = 'force-dynamic'

import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import type { Category } from '@/types/database'

export const metadata: Metadata = {
  title: 'Magnet Stickers — Premium Die-Cut Magnet Stickers, Ships Worldwide',
  description: 'Shop thousands of unique die-cut magnet stickers. Dog breeds, cats, wildlife, fruits, quotes & more. Premium 20mil vinyl, vivid colors. Free shipping on orders $35+.',
  openGraph: {
    title: 'Magnet Stickers — Premium Die-Cut Magnet Stickers',
    description: 'Thousands of unique designs. Ships worldwide. Premium quality.',
    type: 'website',
  },
}

async function getMainCategories(): Promise<Category[]> {
  const { data } = await supabase.from('categories').select('*').eq('level', 1).eq('is_active', true).order('sort_order').limit(12)
  return data ?? []
}

async function getFeaturedProducts() {
  const { data } = await supabase.from('products').select('*, categories(name,slug)').eq('is_active', true).order('created_at', { ascending: false }).limit(8)
  return data ?? []
}

const CAT_CONFIG: Record<string, { emoji: string; color: string; bg: string }> = {
  animals:        { emoji: '🐾', color: 'text-amber-600',  bg: 'bg-amber-50 hover:bg-amber-100 border-amber-200' },
  fruits:         { emoji: '🍎', color: 'text-red-600',    bg: 'bg-red-50 hover:bg-red-100 border-red-200' },
  vegetables:     { emoji: '🥦', color: 'text-green-600',  bg: 'bg-green-50 hover:bg-green-100 border-green-200' },
  wildlife:       { emoji: '🦁', color: 'text-yellow-600', bg: 'bg-yellow-50 hover:bg-yellow-100 border-yellow-200' },
  quotes:         { emoji: '💬', color: 'text-blue-600',   bg: 'bg-blue-50 hover:bg-blue-100 border-blue-200' },
  'food-drinks':  { emoji: '🍕', color: 'text-orange-600', bg: 'bg-orange-50 hover:bg-orange-100 border-orange-200' },
  nature:         { emoji: '🌿', color: 'text-emerald-600',bg: 'bg-emerald-50 hover:bg-emerald-100 border-emerald-200' },
  hobbies:        { emoji: '🎮', color: 'text-purple-600', bg: 'bg-purple-50 hover:bg-purple-100 border-purple-200' },
  spiritual:      { emoji: '🔮', color: 'text-violet-600', bg: 'bg-violet-50 hover:bg-violet-100 border-violet-200' },
  seasonal:       { emoji: '🎄', color: 'text-pink-600',   bg: 'bg-pink-50 hover:bg-pink-100 border-pink-200' },
}

export default async function HomePage() {
  const [categories, featured] = await Promise.all([getMainCategories(), getFeaturedProducts()])

  return (
    <div className="min-h-screen">

      {/* ── HERO ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-pink-600 via-rose-500 to-purple-700 text-white">
        {/* Decorative blobs */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-20 w-96 h-96 bg-purple-300 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-64 h-64 bg-yellow-300 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-6xl mx-auto px-4 py-20 md:py-28 flex flex-col md:flex-row items-center gap-12">
          {/* Left copy */}
          <div className="flex-1 text-center md:text-left">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              🌍 Ships to 190+ Countries
            </div>

            <h1 className="text-5xl md:text-6xl font-black leading-tight mb-5">
              The World&apos;s Biggest<br />
              <span className="text-yellow-300">Magnet Sticker</span><br />
              Store
            </h1>

            <p className="text-white/85 text-lg md:text-xl mb-8 max-w-lg leading-relaxed">
              Thousands of unique die-cut magnet stickers — dog breeds, cats, wildlife, fruits, quotes &amp; more.
              Premium 20mil vinyl, vivid full-color print.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
              <Link href="/shop"
                className="bg-white text-pink-600 hover:bg-yellow-300 hover:text-pink-700 font-black py-4 px-8 rounded-2xl text-lg transition-all shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transform">
                🛍️ Shop All Magnets
              </Link>
              <Link href="/shop/animals-dogs"
                className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-bold py-4 px-8 rounded-2xl text-lg transition-all border border-white/30">
                🐶 Dog Breeds
              </Link>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-4 mt-8 justify-center md:justify-start">
              {[
                ['✂️', 'Die-Cut Precision'],
                ['🎨', 'Unique AI Art'],
                ['📦', 'Printed by Printful'],
                ['🔒', 'Secure PayPal Checkout'],
              ].map(([icon, label]) => (
                <div key={label} className="flex items-center gap-1.5 text-sm text-white/80">
                  <span>{icon}</span><span>{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right floating magnet grid */}
          <div className="hidden md:grid grid-cols-3 gap-3 flex-shrink-0">
            {featured.slice(0, 9).map((p: any, i: number) => (
              <Link key={p.id} href={`/product/${p.slug}`}
                className={`w-24 h-24 bg-white rounded-2xl shadow-xl flex items-center justify-center overflow-hidden border-2 border-white/50 hover:scale-110 transition-transform ${i === 4 ? 'scale-110' : ''}`}>
                {p.images?.[0]
                  ? <Image src={p.images[0]} alt={p.name} width={96} height={96} className="w-full h-full object-contain p-2" />
                  : <span className="text-3xl">🧲</span>}
              </Link>
            ))}
            {featured.length < 9 && Array.from({ length: 9 - featured.length }).map((_, i) => (
              <div key={`ph-${i}`} className="w-24 h-24 bg-white/20 rounded-2xl border-2 border-white/20 flex items-center justify-center">
                <span className="text-2xl opacity-50">🧲</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS STRIP ── */}
      <section className="bg-gray-900 text-white py-5">
        <div className="max-w-6xl mx-auto px-4 flex flex-wrap items-center justify-center gap-8 md:gap-16 text-center">
          {[
            ['1,000+', 'Unique Designs'],
            ['190+', 'Countries Shipped'],
            ['⭐ 4.9', 'Customer Rating'],
            ['3–7 days', 'Avg Delivery'],
          ].map(([num, label]) => (
            <div key={label}>
              <div className="text-2xl font-black text-pink-400">{num}</div>
              <div className="text-xs text-gray-400 mt-0.5">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="bg-pink-100 text-pink-600 text-sm font-bold px-4 py-1 rounded-full">Browse Collections</span>
            <h2 className="text-4xl font-black mt-3 mb-3 text-gray-900">Shop by Category</h2>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">From your favorite pet breeds to motivational quotes — there&apos;s a magnet for everyone</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {categories.map(cat => {
              const cfg = CAT_CONFIG[cat.slug] ?? { emoji: '🏷️', color: 'text-gray-600', bg: 'bg-gray-50 hover:bg-gray-100 border-gray-200' }
              return (
                <Link key={cat.id} href={`/shop/${cat.slug}`}
                  className={`group border-2 ${cfg.bg} rounded-2xl p-5 text-center transition-all hover:shadow-lg hover:-translate-y-1 transform`}>
                  <div className="text-4xl mb-3">{cfg.emoji}</div>
                  <div className={`font-bold text-sm ${cfg.color}`}>{cat.name}</div>
                  <div className="text-xs text-gray-400 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">Browse →</div>
                </Link>
              )
            })}

            {/* All Categories CTA */}
            <Link href="/shop"
              className="border-2 border-dashed border-pink-300 bg-pink-50 hover:bg-pink-100 rounded-2xl p-5 text-center transition-all hover:shadow-lg hover:-translate-y-1 transform group">
              <div className="text-4xl mb-3">✨</div>
              <div className="font-bold text-sm text-pink-600">View All</div>
              <div className="text-xs text-pink-400 mt-1">100+ categories</div>
            </Link>
          </div>
        </div>
      </section>

      {/* ── NEW ARRIVALS ── */}
      {featured.length > 0 && (
        <section className="py-20 px-4 bg-gradient-to-b from-gray-50 to-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <span className="bg-yellow-100 text-yellow-700 text-sm font-bold px-4 py-1 rounded-full">Just Dropped 🔥</span>
              <h2 className="text-4xl font-black mt-3 mb-3 text-gray-900">New Arrivals</h2>
              <p className="text-gray-500 text-lg">Fresh designs added daily — be the first to grab them</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
              {featured.map((product: any) => (
                <Link key={product.id} href={`/product/${product.slug}`}
                  className="group bg-white rounded-3xl overflow-hidden border border-gray-100 hover:shadow-2xl hover:-translate-y-1 transform transition-all duration-300">
                  <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
                    {product.images?.[0] ? (
                      <Image src={product.images[0]} alt={product.name} fill
                        className="object-contain p-4 group-hover:scale-110 transition-transform duration-500"
                        sizes="(max-width: 640px) 50vw, 25vw" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-6xl">🧲</div>
                    )}
                    {/* NEW badge */}
                    <div className="absolute top-2 left-2 bg-pink-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">NEW</div>
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-pink-500 font-semibold mb-1 uppercase tracking-wide">{product.categories?.name}</p>
                    <h3 className="font-bold text-gray-800 text-sm line-clamp-2 leading-snug">{product.name}</h3>
                    <div className="flex items-center justify-between mt-3">
                      <p className="text-pink-600 font-black text-base">from $11.99</p>
                      <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">Die-Cut</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link href="/shop"
                className="inline-flex items-center gap-2 bg-gray-900 hover:bg-pink-600 text-white font-bold py-4 px-10 rounded-2xl transition-all shadow-lg hover:shadow-xl">
                View All Products
                <span className="text-lg">→</span>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── HOW IT WORKS ── */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <span className="bg-blue-100 text-blue-600 text-sm font-bold px-4 py-1 rounded-full">Simple Process</span>
            <h2 className="text-4xl font-black mt-3 text-gray-900">From Click to Fridge</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { step: '01', icon: '🔍', title: 'Browse & Pick', desc: 'Find the perfect design from thousands of categories' },
              { step: '02', icon: '🛒', title: 'Add to Cart', desc: 'Select quantity and add to your cart' },
              { step: '03', icon: '💳', title: 'Secure Checkout', desc: 'Pay safely via PayPal — credit card accepted' },
              { step: '04', icon: '📬', title: 'Delivered to You', desc: 'Printed by Printful, shipped to your door in 3–7 days' },
            ].map((item) => (
              <div key={item.step} className="text-center relative">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-pink-50 border-2 border-pink-200 rounded-2xl mb-4 text-3xl">
                  {item.icon}
                </div>
                <div className="absolute top-0 right-0 md:right-4 bg-pink-500 text-white text-xs font-black w-6 h-6 rounded-full flex items-center justify-center">
                  {item.step}
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY US ── */}
      <section className="py-20 px-4 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-black mb-3">Why Customers Love Us</h2>
            <p className="text-gray-400 text-lg">Premium quality with every order — guaranteed</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: '✂️', title: 'Die-Cut Precision', desc: 'Every magnet is precisely cut to the exact shape of the design — no boring square borders.', badge: 'Signature Feature' },
              { icon: '🎨', title: 'AI-Illustrated Art', desc: 'Every design is custom-illustrated — not generic stock art. Thousands of unique options.', badge: 'Exclusive Designs' },
              { icon: '🧲', title: 'Premium Vinyl Magnet', desc: '20mil flexible vinyl with strong magnetic backing. Works on fridges, lockers, cars & more.', badge: 'Top Quality' },
              { icon: '🌍', title: 'Ships Worldwide', desc: 'We deliver to 190+ countries. International shipping via Printful\'s global fulfillment network.', badge: 'Global Reach' },
              { icon: '⚡', title: 'Fast Production', desc: 'Orders enter production within 24 hours. Most customers receive their magnets in 3–7 days.', badge: 'Quick Delivery' },
              { icon: '🔒', title: 'Secure & Easy Checkout', desc: 'Pay with PayPal or major credit cards. Your data is always encrypted and protected.', badge: 'Safe Payments' },
            ].map(item => (
              <div key={item.title} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="text-3xl flex-shrink-0">{item.icon}</div>
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-bold text-white">{item.title}</h3>
                      <span className="text-xs bg-pink-500/30 text-pink-300 px-2 py-0.5 rounded-full">{item.badge}</span>
                    </div>
                    <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SOCIAL PROOF / TESTIMONIALS ── */}
      <section className="py-20 px-4 bg-pink-50">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-4xl font-black mb-3 text-gray-900">People Are Obsessed 🧲</h2>
          <p className="text-gray-500 mb-12 text-lg">Join thousands of happy customers worldwide</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { quote: 'Ordered the Shih Tzu magnet for my mom and she cried! The detail is incredible. Already ordered 5 more.', name: 'Jessica M.', country: '🇺🇸 USA', stars: 5 },
              { quote: 'Ships super fast to the Philippines! The die-cut quality is insane. Looks exactly like my golden retriever.', name: 'Carlo R.', country: '🇵🇭 Philippines', stars: 5 },
              { quote: 'I have 30+ on my fridge now. My friends always ask where I got them. This store is the real deal.', name: 'Sarah K.', country: '🇬🇧 UK', stars: 5 },
            ].map(t => (
              <div key={t.name} className="bg-white rounded-2xl p-6 shadow-sm text-left border border-pink-100">
                <div className="flex gap-0.5 mb-3">
                  {Array(t.stars).fill(0).map((_, i) => <span key={i} className="text-yellow-400">★</span>)}
                </div>
                <p className="text-gray-700 text-sm leading-relaxed mb-4">&ldquo;{t.quote}&rdquo;</p>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center text-pink-500 font-bold text-sm">
                    {t.name[0]}
                  </div>
                  <div>
                    <div className="font-bold text-sm text-gray-900">{t.name}</div>
                    <div className="text-xs text-gray-400">{t.country}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="py-20 px-4 bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 text-white text-center">
        <div className="max-w-3xl mx-auto">
          <div className="text-5xl mb-4">🧲</div>
          <h2 className="text-4xl md:text-5xl font-black mb-4">Ready to Magnify Your World?</h2>
          <p className="text-white/80 text-xl mb-8">Shop thousands of designs — perfect for gifts, home decor, or just treating yourself.</p>
          <Link href="/shop"
            className="inline-block bg-white text-pink-600 hover:bg-yellow-300 hover:text-pink-700 font-black py-5 px-12 rounded-2xl text-xl transition-all shadow-2xl hover:-translate-y-1 transform">
            🛍️ Start Shopping
          </Link>
          <p className="text-white/60 text-sm mt-4">Free shipping on orders over $35 · Ships to 190+ countries</p>
        </div>
      </section>

    </div>
  )
}
