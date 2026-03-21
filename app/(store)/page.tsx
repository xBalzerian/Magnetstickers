export const dynamic = 'force-dynamic'

import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import { buildMetadata, websiteJsonLd } from '@/lib/seo'
import type { Category } from '@/types/database'

export const metadata: Metadata = buildMetadata({
  title: 'Magnet Stickers — Unique Die-Cut Magnet Stickers',
  description: 'Shop thousands of unique die-cut magnet stickers — dog breeds, cats, wildlife, fruits, quotes & more. Premium quality, ships worldwide from MagnetStickers.art.',
  path: '/',
})

async function getMainCategories(): Promise<Category[]> {
  const { data } = await supabase.from('categories').select('*').eq('level', 1).eq('is_active', true).order('sort_order').limit(10)
  return data ?? []
}

async function getFeaturedProducts() {
  const { data } = await supabase.from('products').select('*, categories(name,slug)').eq('is_active', true).order('created_at', { ascending: false }).limit(8)
  return data ?? []
}

export default async function HomePage() {
  const [categories, featured] = await Promise.all([getMainCategories(), getFeaturedProducts()])

  const categoryEmojis: Record<string, string> = {
    animals: '🐾', fruits: '🍎', vegetables: '🥦', wildlife: '🦁',
    quotes: '💬', 'food-drinks': '🍕', nature: '🌿', hobbies: '🎮',
    spiritual: '🔮', seasonal: '🎄',
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org', '@type': 'WebPage',
        name: 'Magnet Stickers', url: 'https://magnetstickers.art',
        description: 'Unique die-cut magnet stickers for every passion',
        breadcrumb: { '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: 'https://magnetstickers.art' }] },
      })}} />

      {/* Hero */}
      <section className="bg-gradient-to-br from-pink-50 via-white to-purple-50 py-20 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <div className="text-6xl mb-6">🧲</div>
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6 leading-tight">
            Magnets for<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">Every Passion</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Thousands of unique die-cut magnet stickers — your favorite breeds, animals, fruits, quotes and more.
            Premium quality, ships worldwide.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/shop" className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-4 px-10 rounded-full text-lg transition-colors shadow-lg">
              Shop All Magnets
            </Link>
            <Link href="/shop/animals-dogs" className="border-2 border-pink-500 text-pink-500 hover:bg-pink-50 font-bold py-4 px-10 rounded-full text-lg transition-colors">
              Browse Dog Breeds 🐶
            </Link>
          </div>
          <div className="flex items-center justify-center gap-6 mt-8 text-sm text-gray-500">
            <span>✂️ Die-cut precision</span>
            <span>🌍 Ships worldwide</span>
            <span>🎨 Unique designs</span>
            <span>🔒 Secure checkout</span>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-3">Shop by Category</h2>
          <p className="text-gray-500 text-center mb-10">Find the perfect magnet for any interest</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {categories.map(cat => (
              <Link key={cat.id} href={`/shop/${cat.slug}`}
                className="group bg-gray-50 hover:bg-pink-50 border border-gray-200 hover:border-pink-200 rounded-2xl p-5 text-center transition-all hover:shadow-md">
                <div className="text-4xl mb-2">{categoryEmojis[cat.slug] ?? '🏷️'}</div>
                <div className="font-semibold text-gray-800 group-hover:text-pink-600 text-sm">{cat.name}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured */}
      {featured.length > 0 && (
        <section className="py-16 px-4 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-3">New Arrivals</h2>
            <p className="text-gray-500 text-center mb-10">Fresh designs just dropped 🔥</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
              {featured.map((product: any) => (
                <Link key={product.id} href={`/product/${product.slug}`}
                  className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all">
                  <div className="aspect-square bg-gray-100 relative overflow-hidden">
                    {product.images?.[0] ? (
                      <Image src={product.images[0]} alt={product.name} fill className="object-contain p-4 group-hover:scale-105 transition-transform" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-5xl">🧲</div>
                    )}
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-pink-500 font-medium mb-1">{product.categories?.name}</p>
                    <h3 className="font-semibold text-gray-800 text-sm line-clamp-2">{product.name}</h3>
                    <p className="text-pink-600 font-bold mt-2">from $11.99</p>
                  </div>
                </Link>
              ))}
            </div>
            <div className="text-center mt-10">
              <Link href="/shop" className="inline-block bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 px-8 rounded-full transition-colors">
                View All Products
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Why Us */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Why Magnet Stickers?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: '🎨', title: 'Unique AI Designs', desc: 'Every design is custom-illustrated — not stock art. Thousands of designs across hundreds of categories.' },
              { icon: '✂️', title: 'Die-Cut Precision', desc: 'Perfect edge-to-edge cuts on premium 20mil flexible vinyl with a matte finish. Built to last.' },
              { icon: '🌍', title: 'Ships Worldwide', desc: 'Printed and fulfilled by Printful — delivered to your door anywhere in the world.' },
            ].map(item => (
              <div key={item.title} className="text-center p-6 bg-gray-50 rounded-2xl">
                <div className="text-5xl mb-4">{item.icon}</div>
                <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SEO text block */}
      <section className="py-10 px-4 bg-gray-50">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">The Best Die-Cut Magnet Stickers Online</h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            MagnetStickers.art is your one-stop shop for premium die-cut magnet stickers. 
            Whether you&apos;re looking for <Link href="/shop/animals-dogs" className="text-pink-500 hover:underline">dog breed magnets</Link>,{' '}
            <Link href="/shop/animals-cats" className="text-pink-500 hover:underline">cat magnets</Link>,{' '}
            <Link href="/shop/wildlife" className="text-pink-500 hover:underline">wildlife magnets</Link>, or{' '}
            <Link href="/shop/quotes" className="text-pink-500 hover:underline">quote magnets</Link>,{' '}
            we have thousands of unique designs to choose from. All magnets are made from premium 20mil flexible vinyl 
            with a strong magnetic backing — perfect for fridges, lockers, whiteboards, and more.
          </p>
        </div>
      </section>
    </>
  )
}
