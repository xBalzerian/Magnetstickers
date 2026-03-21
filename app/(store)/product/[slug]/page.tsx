export const dynamic = 'force-dynamic'

import { supabase } from '@/lib/supabase'
import Image from 'next/image'
import Link from 'next/link'
import AddToCartButton from '@/components/store/AddToCartButton'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { buildProductMetadata, productJsonLd } from '@/lib/seo'

interface Props { params: Promise<{ slug: string }> }

async function getProduct(slug: string) {
  const { data } = await supabase
    .from('products')
    .select('*, categories(id, name, slug, parent_id, level)')
    .eq('slug', slug).eq('is_active', true).single()
  return data
}

async function getRelated(categoryId: string, excludeId: string) {
  const { data } = await supabase.from('products')
    .select('*').eq('category_id', categoryId).eq('is_active', true)
    .neq('id', excludeId).limit(8)
  return data ?? []
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const product = await getProduct(slug)
  if (!product) return {}
  return buildProductMetadata(product)
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params
  const product = await getProduct(slug)
  if (!product) notFound()

  const related = await getRelated(product.category_id, product.id)
  const cat = product.categories as any

  return (
    <>
      <script type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd(product)) }} />

      <div className="min-h-screen bg-black text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10">

          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-gray-600 mb-8 flex-wrap">
            <Link href="/shop" className="hover:text-pink-400 transition-colors">Shop</Link>
            <span>/</span>
            {cat && (
              <>
                <Link href={`/shop/${cat.slug}`} className="hover:text-pink-400 transition-colors">{cat.name}</Link>
                <span>/</span>
              </>
            )}
            <span className="text-gray-500 truncate max-w-[200px]">{product.name}</span>
          </nav>

          {/* Product grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16 mb-16">

            {/* Image */}
            <div className="order-1">
              <div className="relative aspect-square bg-gradient-to-br from-gray-900 to-gray-950 rounded-3xl overflow-hidden border border-white/8 shadow-2xl">
                {product.images?.[0] ? (
                  <Image src={product.images[0]} alt={product.name} fill priority
                    className="object-contain p-8 sm:p-12"
                    sizes="(max-width: 768px) 100vw, 50vw" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-700 text-sm">No image yet</div>
                )}
              </div>
              {/* Thumbnail strip */}
              {product.images?.length > 1 && (
                <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
                  {product.images.map((img: string, i: number) => (
                    <div key={i} className="w-16 h-16 rounded-xl overflow-hidden border border-white/10 flex-shrink-0">
                      <Image src={img} alt={`${product.name} ${i+1}`} width={64} height={64} className="object-contain p-1 w-full h-full" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="order-2 flex flex-col justify-start">
              {cat && (
                <Link href={`/shop/${cat.slug}`}
                  className="text-xs font-bold text-pink-400 uppercase tracking-widest mb-3 hover:text-pink-300 transition-colors w-fit">
                  {cat.name}
                </Link>
              )}
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white mb-4 leading-tight">{product.name}</h1>

              {/* Price */}
              <div className="flex items-baseline gap-3 mb-6">
                <span className="text-3xl sm:text-4xl font-black text-white">$11.99</span>
                <span className="text-sm text-gray-600 line-through">$14.99</span>
                <span className="text-xs bg-pink-500/20 text-pink-400 border border-pink-500/30 px-2 py-0.5 rounded-full font-bold">Save 20%</span>
              </div>

              {/* Specs */}
              <div className="grid grid-cols-2 gap-2 mb-6">
                {[
                  ['Material', '20mil Premium Vinyl'],
                  ['Type', 'Die-Cut Magnet'],
                  ['Print', 'Full-Color UV Resistant'],
                  ['Ships', '3-7 Business Days'],
                ].map(([k, v]) => (
                  <div key={k} className="bg-white/4 border border-white/8 rounded-xl p-3">
                    <div className="text-xs text-gray-600 mb-0.5">{k}</div>
                    <div className="text-xs font-semibold text-gray-300">{v}</div>
                  </div>
                ))}
              </div>

              {product.description && (
                <p className="text-gray-500 text-sm leading-relaxed mb-6">{product.description}</p>
              )}

              {/* Add to cart */}
              <AddToCartButton product={product} />

              {/* Trust signals */}
              <div className="mt-6 space-y-2">
                {[
                  'Free shipping on orders over $35',
                  'Fulfilled by Printful — world-class quality',
                  '30-day satisfaction guarantee',
                  'Ships to 190+ countries worldwide',
                ].map(t => (
                  <div key={t} className="flex items-center gap-2.5 text-xs text-gray-600">
                    <div className="w-1 h-1 rounded-full bg-green-500 flex-shrink-0" />
                    {t}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Related */}
          {related.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl sm:text-2xl font-black">More Like This</h2>
                {cat && (
                  <Link href={`/shop/${cat.slug}`} className="text-xs text-pink-400 hover:text-pink-300 transition-colors font-semibold">
                    View all in {cat.name}
                  </Link>
                )}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
                {related.map((p: any) => (
                  <Link key={p.id} href={`/product/${p.slug}`}
                    className="group bg-gray-950 rounded-2xl overflow-hidden border border-white/5 hover:border-pink-500/40 transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-pink-500/10">
                    <div className="aspect-square bg-gradient-to-br from-gray-900 to-gray-950 relative overflow-hidden">
                      {p.images?.[0] ? (
                        <Image src={p.images[0]} alt={p.name} fill
                          className="object-contain p-3 group-hover:scale-110 transition-transform duration-500"
                          sizes="(max-width: 640px) 50vw, 17vw" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="w-8 h-8 rounded-full bg-white/5" />
                        </div>
                      )}
                    </div>
                    <div className="p-3">
                      <p className="font-bold text-white text-xs line-clamp-2 mb-1">{p.name}</p>
                      <p className="text-pink-400 font-black text-sm">$11.99</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
