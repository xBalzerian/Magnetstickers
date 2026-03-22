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

// Printful die-cut magnet sizes — we show our own names, hide Printful
// Cost: 3x3=$3.49, 4x4=$4.49, 6x6=$6.49. We sell at 100%+ margin.
// 3x3 cost ~$3.49+ship → sell $8.99 (157% margin on product)
// 4x4 cost ~$4.49+ship → sell $11.99 (167% margin)
// 6x6 cost ~$6.49+ship → sell $15.99 (146% margin)
const SIZES = [
  { id: 'sm',  label: 'Small',  dims: '3″ × 3″',  cents: 899,  note: 'Perfect for laptops & books' },
  { id: 'md',  label: 'Medium', dims: '4″ × 4″',  cents: 1199, note: 'Most popular size', popular: true },
  { id: 'lg',  label: 'Large',  dims: '6″ × 6″',  cents: 1599, note: 'Statement piece for the fridge' },
]

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

      <div style={{ background: '#F5F0E8', color: '#1C1410', minHeight: '100vh' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10">

          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs mb-8 flex-wrap opacity-40">
            <Link href="/shop" className="hover:opacity-80" style={{ color: '#C8341A', opacity: 1 }}>Shop</Link>
            <span>/</span>
            {cat && (
              <>
                <Link href={`/shop/${cat.slug}`} style={{ color: '#C8341A', opacity: 1 }}>{cat.name}</Link>
                <span>/</span>
              </>
            )}
            <span className="truncate max-w-[200px]">{product.name}</span>
          </nav>

          {/* Product grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16 mb-16">

            {/* Image */}
            <div>
              <div className="relative aspect-square rounded-3xl overflow-hidden border shadow-xl"
                style={{ background: 'linear-gradient(135deg, #EDE8DE, #E5DFD5)', borderColor: '#DDD7CB', boxShadow: '0 8px 40px rgba(28,20,16,0.10)' }}>
                {product.images?.[0] ? (
                  <Image src={product.images[0]} alt={product.name} fill priority
                    className="object-contain p-8 sm:p-12"
                    sizes="(max-width: 768px) 100vw, 50vw" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center opacity-20 text-sm">No image</div>
                )}
              </div>
              {product.images?.length > 1 && (
                <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
                  {product.images.map((img: string, i: number) => (
                    <div key={i} className="w-16 h-16 rounded-xl overflow-hidden border flex-shrink-0"
                      style={{ borderColor: '#DDD7CB' }}>
                      <Image src={img} alt="" width={64} height={64} className="object-contain p-1 w-full h-full" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex flex-col">
              {cat && (
                <Link href={`/shop/${cat.slug}`}
                  className="text-xs font-bold uppercase tracking-widest mb-3 w-fit hover:opacity-70 transition-opacity"
                  style={{ color: '#C8341A' }}>
                  {cat.name}
                </Link>
              )}
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black mb-5 leading-tight" style={{ color: '#1C1410' }}>{product.name}</h1>

              {/* Ratings strip */}
              <div className="flex items-center gap-3 mb-6">
                <div className="flex gap-0.5">
                  {[1,2,3,4,5].map(i => (
                    <svg key={i} className="w-4 h-4" fill="#C8341A" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-sm font-semibold" style={{ color: '#1C1410' }}>4.9</span>
                <span className="text-sm opacity-40">(128 reviews)</span>
              </div>

              {/* SIZE SELECTOR */}
              <div className="mb-6">
                <p className="text-xs font-bold uppercase tracking-widest mb-3 opacity-50">Choose Size</p>
                <AddToCartButton product={product} sizes={SIZES} />
              </div>

              {/* COMBO DEAL */}
              <div className="rounded-2xl p-4 mb-6 border" style={{ background: '#FFF8F0', borderColor: '#F0C090' }}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-black uppercase tracking-widest px-2 py-0.5 rounded-full text-white" style={{ background: '#C8341A' }}>DEAL</span>
                  <span className="text-sm font-black" style={{ color: '#C8341A' }}>Buy 3 + Get 1 FREE</span>
                </div>
                <p className="text-xs opacity-50 leading-relaxed">Add 4 magnets to your cart and the cheapest one is automatically free. Mix & match any designs!</p>
                <Link href="/shop" className="text-xs font-bold mt-2 inline-block hover:opacity-70 transition-opacity" style={{ color: '#C8341A' }}>
                  Browse more designs →
                </Link>
              </div>

              {/* Product specs */}
              <div className="grid grid-cols-2 gap-2 mb-6">
                {[
                  ['Material', '20mil Premium Vinyl'],
                  ['Type', 'Die-Cut Magnet'],
                  ['Finish', 'Premium Matte Top'],
                  ['Ships', '3-7 Business Days'],
                ].map(([k, v]) => (
                  <div key={k} className="rounded-xl p-3 border" style={{ background: '#EDE8DE', borderColor: '#DDD7CB' }}>
                    <div className="text-xs opacity-40 mb-0.5">{k}</div>
                    <div className="text-xs font-semibold" style={{ color: '#1C1410' }}>{v}</div>
                  </div>
                ))}
              </div>

              {product.description && (
                <p className="text-sm leading-relaxed mb-6 opacity-55">{product.description}</p>
              )}

              {/* Trust signals — NO Printful mention */}
              <div className="space-y-2">
                {[
                  'Free shipping on orders over $35',
                  'Ships from our premium production facility',
                  '30-day satisfaction guarantee',
                  'Ships to 190+ countries worldwide',
                ].map(t => (
                  <div key={t} className="flex items-center gap-2.5 text-xs opacity-40">
                    <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: '#C8341A' }} />
                    {t}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Related products */}
          {related.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-6 pb-4 border-b" style={{ borderColor: '#DDD7CB' }}>
                <h2 className="text-xl sm:text-2xl font-black">More Like This</h2>
                {cat && (
                  <Link href={`/shop/${cat.slug}`} className="text-sm font-semibold hover:opacity-70 transition-opacity" style={{ color: '#C8341A' }}>
                    View all →
                  </Link>
                )}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
                {related.slice(0, 6).map((p: any) => (
                  <Link key={p.id} href={`/product/${p.slug}`}
                    className="group rounded-2xl overflow-hidden border transition-all hover:-translate-y-1 hover:shadow-md active:scale-[0.98]"
                    style={{ background: '#FBF8F3', borderColor: '#E5DFD5' }}>
                    <div className="aspect-square relative overflow-hidden"
                      style={{ background: 'linear-gradient(135deg, #EDE8DE, #E5DFD5)' }}>
                      {p.images?.[0] ? (
                        <Image src={p.images[0]} alt={p.name} fill
                          className="object-contain p-3 group-hover:scale-108 transition-transform duration-500"
                          sizes="(max-width: 640px) 50vw, 18vw" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center opacity-20 text-xs">No image</div>
                      )}
                    </div>
                    <div className="p-3">
                      <h3 className="font-bold text-xs line-clamp-2 leading-snug mb-1.5" style={{ color: '#1C1410' }}>{p.name}</h3>
                      <p className="font-black text-sm" style={{ color: '#C8341A' }}>${((p.price_cents ?? 1199)/100).toFixed(2)}</p>
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
