export const dynamic = 'force-dynamic'

import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import type { Category } from '@/types/database'
import AnimatedHero from '@/components/store/AnimatedHero'

export const metadata: Metadata = {
  title: "Magnet Stickers — The World's Biggest Die-Cut Magnet Store | Ships Worldwide",
  description: 'Thousands of unique AI-illustrated die-cut magnet stickers. Dog breeds, cats, wildlife, fruits, quotes and more. Premium 20mil vinyl. Ships worldwide.',
  openGraph: {
    title: "Magnet Stickers — The World's Biggest Die-Cut Magnet Store",
    description: 'Thousands of unique designs. Ships worldwide. Premium quality.',
    type: 'website',
    url: 'https://magnetstickers.art',
  },
}

async function getCategories(): Promise<Category[]> {
  const { data } = await supabase.from('categories').select('*').eq('level', 1).eq('is_active', true).order('sort_order').limit(12)
  return data ?? []
}

async function getFeatured() {
  const { data } = await supabase.from('products').select('*, categories(name,slug)').eq('is_active', true).order('created_at', { ascending: false }).limit(12)
  return data ?? []
}

async function getBannerAssets(): Promise<{ videoUrl: string | null; imageUrl: string | null }> {
  try {
    const { data } = await supabase.from('settings').select('key,value').in('key', ['banner_video_url', 'banner_image_url_1'])
    const map = Object.fromEntries((data ?? []).map((r: any) => [r.key, r.value]))
    return { videoUrl: map['banner_video_url'] ?? null, imageUrl: map['banner_image_url_1'] ?? null }
  } catch {
    return { videoUrl: null, imageUrl: null }
  }
}

const CAT_CONFIG: Record<string, { label: string; accent: string; bg: string; border: string }> = {
  animals:       { label: 'Animals',       accent: 'text-amber-400',  bg: 'bg-amber-500/10',  border: 'border-amber-500/20 hover:border-amber-500/40' },
  fruits:        { label: 'Fruits',        accent: 'text-red-400',    bg: 'bg-red-500/10',    border: 'border-red-500/20 hover:border-red-500/40' },
  vegetables:    { label: 'Vegetables',    accent: 'text-green-400',  bg: 'bg-green-500/10',  border: 'border-green-500/20 hover:border-green-500/40' },
  wildlife:      { label: 'Wildlife',      accent: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20 hover:border-yellow-500/40' },
  quotes:        { label: 'Quotes',        accent: 'text-blue-400',   bg: 'bg-blue-500/10',   border: 'border-blue-500/20 hover:border-blue-500/40' },
  'food-drinks': { label: 'Food & Drinks', accent: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20 hover:border-orange-500/40' },
  nature:        { label: 'Nature',        accent: 'text-teal-400',   bg: 'bg-teal-500/10',   border: 'border-teal-500/20 hover:border-teal-500/40' },
  hobbies:       { label: 'Hobbies',       accent: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20 hover:border-purple-500/40' },
  spiritual:     { label: 'Spiritual',     accent: 'text-violet-400', bg: 'bg-violet-500/10', border: 'border-violet-500/20 hover:border-violet-500/40' },
  seasonal:      { label: 'Seasonal',      accent: 'text-pink-400',   bg: 'bg-pink-500/10',   border: 'border-pink-500/20 hover:border-pink-500/40' },
}

export default async function HomePage() {
  const [categories, featured, banner] = await Promise.all([getCategories(), getFeatured(), getBannerAssets()])
  const featuredImages = featured.flatMap((p: any) => p.images ?? []).slice(0, 8)

  return (
    <div className="min-h-screen bg-black text-white">

      {/* HERO */}
      <AnimatedHero
        bannerVideoUrl={banner.videoUrl}
        bannerImageUrl={banner.imageUrl}
        featuredImages={featuredImages}
      />

      {/* STATS BAR */}
      <section className="bg-gray-950 border-y border-white/8 py-4 sm:py-5 overflow-x-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-start sm:justify-center gap-8 sm:gap-16 min-w-max sm:min-w-0 mx-auto">
            {[
              ['1,000+', 'Unique Designs'],
              ['190+', 'Countries Shipped'],
              ['4.9 / 5', 'Customer Rating'],
              ['20mil', 'Premium Vinyl'],
              ['24h', 'Production Start'],
            ].map(([num, label]) => (
              <div key={label} className="flex flex-col items-center shrink-0">
                <span className="text-lg sm:text-2xl font-black text-white">{num}</span>
                <span className="text-xs text-gray-600 mt-0.5 whitespace-nowrap">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 bg-gray-950">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10 sm:mb-14">
            <span className="text-pink-500 text-xs font-black tracking-widest uppercase">Collections</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mt-3 mb-3 leading-tight">
              Find Your{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">
                Perfect Magnet
              </span>
            </h2>
            <p className="text-gray-500 text-sm sm:text-base max-w-lg mx-auto">
              From your favorite dog breed to tropical fruits — there&apos;s a magnet for everything
            </p>
          </div>

          {/* 2 cols mobile, 3 sm, 4 md, 5 lg */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
            {categories.map(cat => {
              const cfg = CAT_CONFIG[cat.slug] ?? { label: cat.name, accent: 'text-gray-400', bg: 'bg-white/5', border: 'border-white/10 hover:border-white/20' }
              return (
                <Link key={cat.id} href={`/shop/${cat.slug}`}
                  className={`group relative rounded-2xl border ${cfg.bg} ${cfg.border} p-5 sm:p-6 text-center transition-all duration-300 hover:scale-[1.03] hover:shadow-lg`}>
                  <div className={`font-black text-sm sm:text-base ${cfg.accent} mb-1 group-hover:scale-105 transition-transform`}>
                    {cfg.label}
                  </div>
                  <div className="text-xs text-gray-700 group-hover:text-gray-500 transition-colors">Explore</div>
                </Link>
              )
            })}

            {/* All tile */}
            <Link href="/shop"
              className="group relative rounded-2xl border border-dashed border-pink-500/30 bg-pink-500/5 p-5 sm:p-6 text-center transition-all duration-300 hover:scale-[1.03] hover:border-pink-500/50">
              <div className="font-black text-sm sm:text-base text-pink-400 mb-1">View All</div>
              <div className="text-xs text-gray-700 group-hover:text-gray-500 transition-colors">100+ categories</div>
            </Link>
          </div>
        </div>
      </section>

      {/* NEW ARRIVALS */}
      {featured.length > 0 && (
        <section className="py-16 sm:py-24 px-4 sm:px-6 bg-black">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-10 sm:mb-14">
              <span className="text-yellow-500 text-xs font-black tracking-widest uppercase">Just Dropped</span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mt-3 mb-3">New Arrivals</h2>
              <p className="text-gray-500 text-sm sm:text-base">Fresh AI-illustrated designs — added daily</p>
            </div>

            {/* Mobile: 2 cols. sm: 3. md: 4. lg: 6 */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
              {featured.map((p: any) => (
                <Link key={p.id} href={`/product/${p.slug}`}
                  className="group bg-gray-950 rounded-2xl overflow-hidden border border-white/5 hover:border-pink-500/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-pink-500/10 active:scale-[0.98]">
                  <div className="aspect-square relative bg-gradient-to-br from-gray-900 to-gray-950 overflow-hidden">
                    {p.images?.[0] ? (
                      <Image src={p.images[0]} alt={p.name} fill
                        className="object-contain p-3 group-hover:scale-110 transition-transform duration-500"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 17vw" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10" />
                      </div>
                    )}
                    <span className="absolute top-2 left-2 bg-pink-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-md">NEW</span>
                  </div>
                  <div className="p-3 sm:p-4">
                    <p className="text-[10px] sm:text-xs text-pink-400 font-semibold mb-1 uppercase tracking-wide truncate">{p.categories?.name}</p>
                    <h3 className="font-bold text-white text-xs sm:text-sm line-clamp-2 leading-snug">{p.name}</h3>
                    <p className="text-pink-400 font-black text-sm sm:text-base mt-2">$11.99</p>
                  </div>
                </Link>
              ))}
            </div>

            <div className="text-center mt-10 sm:mt-14">
              <Link href="/shop"
                className="inline-flex items-center gap-2 bg-white text-gray-950 hover:bg-pink-500 hover:text-white font-black py-4 px-8 sm:px-12 rounded-2xl text-sm sm:text-base transition-all shadow-xl hover:shadow-pink-500/30 active:scale-[0.98]">
                View All Products
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* QUALITY / PRINTFUL SECTION */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 bg-gray-950">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <span className="text-white/40 text-xs font-black tracking-widest uppercase">Printful Quality</span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mt-3 mb-6 leading-tight">
                Every Magnet is a<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">
                  Work of Art
                </span>
              </h2>
              <p className="text-gray-500 text-sm sm:text-base leading-relaxed mb-8 max-w-md">
                Produced by Printful — the world&apos;s leading print-on-demand platform. Professional-grade
                equipment, strict quality control, and global fulfillment on every single order.
              </p>
              <div className="space-y-3">
                {[
                  ['Die-Cut to Exact Shape', 'Precision cut to the outline of each design — no rectangular borders'],
                  ['20mil Premium Vinyl', 'Thick, durable flexible vinyl with strong magnetic backing. Lasts for years'],
                  ['150+ DPI Print Quality', 'Vivid full-color printing — every detail sharp and vibrant'],
                  ['Printful Spec Compliant', '3mm bleed, safe zones, and correct color profiles on every file'],
                ].map(([title, desc]) => (
                  <div key={title} className="flex items-start gap-4 bg-white/4 hover:bg-white/6 rounded-xl p-4 border border-white/6 transition-colors">
                    <div className="w-1 h-full min-h-[40px] rounded-full bg-gradient-to-b from-pink-500 to-purple-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-white text-sm">{title}</div>
                      <div className="text-gray-600 text-xs mt-0.5 leading-relaxed">{desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Product grid */}
            <div className="relative">
              <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
                {featured.slice(0, 9).map((p: any, i: number) => (
                  <Link key={p.id} href={`/product/${p.slug}`}
                    className={`rounded-2xl overflow-hidden border aspect-square bg-gray-900 transition-all ${i === 4 ? 'border-pink-500/60 shadow-lg shadow-pink-500/20 scale-110 z-10' : 'border-white/8 hover:border-white/20'}`}>
                    {p.images?.[0] ? (
                      <Image src={p.images[0]} alt={p.name} width={180} height={180} className="w-full h-full object-contain p-2" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="w-8 h-8 rounded-full bg-white/5" />
                      </div>
                    )}
                  </Link>
                ))}
                {featured.length < 9 && Array.from({ length: 9 - featured.length }).map((_, i) => (
                  <div key={`ph-${i}`} className="rounded-2xl bg-white/3 border border-white/5 aspect-square" />
                ))}
              </div>
              <div className="absolute -bottom-3 -right-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-black px-4 py-2 rounded-xl text-xs shadow-xl">
                Fulfilled by Printful
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 bg-black">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <span className="text-blue-400 text-xs font-black tracking-widest uppercase">How It Works</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mt-3">Click to Doorstep</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            {[
              { step: '01', title: 'Browse 1,000+ designs', desc: 'Find the perfect magnet from our massive collection of categories' },
              { step: '02', title: 'Add to cart', desc: 'Pick your quantity — order 1 or 100, no minimums' },
              { step: '03', title: 'Secure checkout', desc: 'Pay with PayPal or major credit card — 100% encrypted' },
              { step: '04', title: 'Delivered to you', desc: 'Printed & shipped by Printful in 3–7 business days' },
            ].map(item => (
              <div key={item.step} className="relative flex sm:flex-col items-start sm:items-center sm:text-center gap-4 sm:gap-0">
                <div className="relative flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 sm:mb-5 flex items-center justify-center bg-white/5 border border-white/10 rounded-2xl">
                  <span className="font-black text-lg text-white/60">{item.step}</span>
                  <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm sm:text-base mb-1.5">{item.title}</h3>
                  <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 bg-gray-950">
        <div className="max-w-6xl mx-auto text-center">
          <span className="text-yellow-500 text-xs font-black tracking-widest uppercase">Reviews</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mt-3 mb-3">People Are Obsessed</h2>
          <p className="text-gray-500 text-sm sm:text-base mb-12">Thousands of happy customers worldwide</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            {[
              { quote: 'Ordered the Shih Tzu magnet for my mom and she literally cried. The detail is unreal. Already ordered 12 more designs.', name: 'Jessica M.', country: 'United States', stars: 5 },
              { quote: 'Ships super fast to the Philippines! The die-cut quality is insane — looks exactly like my golden retriever. My fridge is full now.', name: 'Carlo R.', country: 'Philippines', stars: 5 },
              { quote: 'I have 40+ on my fridge. My friends always ask where I got them. This store is genuinely the best thing I\'ve found online.', name: 'Sarah K.', country: 'United Kingdom', stars: 5 },
            ].map(t => (
              <div key={t.name} className="bg-white/4 border border-white/8 rounded-2xl p-5 sm:p-6 text-left hover:bg-white/6 transition-colors">
                <div className="flex gap-0.5 mb-4">
                  {Array(t.stars).fill(0).map((_, i) => (
                    <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-300 text-sm leading-relaxed mb-5">&ldquo;{t.quote}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white font-black text-xs sm:text-sm flex-shrink-0">
                    {t.name[0]}
                  </div>
                  <div>
                    <div className="font-bold text-white text-sm">{t.name}</div>
                    <div className="text-xs text-gray-600">{t.country}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 bg-black text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-pink-950/10 to-transparent" />
        <div className="relative max-w-2xl mx-auto">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black mb-4 sm:mb-5 leading-tight">
            Ready to<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">
              Magnify Your World?
            </span>
          </h2>
          <p className="text-gray-500 text-base sm:text-lg mb-10">
            Thousands of designs. Ships to your door, anywhere on Earth.
          </p>
          <Link href="/shop"
            className="inline-block bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 text-white font-black py-4 sm:py-5 px-10 sm:px-16 rounded-2xl text-lg sm:text-xl transition-all duration-300 shadow-2xl shadow-pink-500/30 hover:shadow-pink-500/50 hover:-translate-y-0.5 active:translate-y-0">
            Start Shopping
          </Link>
          <p className="text-gray-700 text-xs mt-5">Free shipping on orders over $35 &nbsp;&middot;&nbsp; Ships to 190+ countries</p>
        </div>
      </section>

    </div>
  )
}
