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
    .eq('slug', slug)
    .eq('is_active', true)
    .single()
  return data
}

async function getRelated(categoryId: string, excludeId: string) {
  const { data } = await supabase
    .from('products')
    .select('*')
    .eq('category_id', categoryId)
    .eq('is_active', true)
    .neq('id', excludeId)
    .limit(4)
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

  return (
    <>
      <script type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd(product)) }} />

      <div className="max-w-6xl mx-auto px-4 py-10">
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8 flex-wrap">
          <Link href="/shop" className="hover:text-pink-500">Shop</Link>
          <span>/</span>
          <Link href={`/shop/${(product.categories as any)?.slug}`} className="hover:text-pink-500">
            {(product.categories as any)?.name}
          </Link>
          <span>/</span>
          <span className="text-gray-900">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-4">
            <div className="aspect-square bg-gray-50 rounded-2xl overflow-hidden border border-gray-100">
              {product.images?.[0] ? (
                <Image src={product.images[0]} alt={product.name}
                  width={600} height={600} className="w-full h-full object-contain p-8"
                  priority />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-8xl">🧲</div>
              )}
            </div>
            {product.images?.length > 1 && (
              <div className="flex gap-3">
                {product.images.slice(0, 4).map((img: string, i: number) => (
                  <div key={i} className="w-20 h-20 bg-gray-50 rounded-xl border border-gray-100 overflow-hidden">
                    <Image src={img} alt={`${product.name} ${i + 1}`} width={80} height={80} className="w-full h-full object-contain p-2" />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <p className="text-sm text-pink-500 font-medium mb-2">{(product.categories as any)?.name}</p>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>

            {product.description && (
              <p className="text-gray-600 mb-6 leading-relaxed">{product.description}</p>
            )}

            <div className="bg-gray-50 rounded-2xl p-5 mb-6 space-y-3">
              {[
                ['✂️', 'Die-Cut Shape', 'Precisely cut to your design — no square borders'],
                ['🧲', '20mil Vinyl Magnet', 'Premium flexible vinyl, strong magnetic backing'],
                ['🎨', 'Matte Finish', 'Vibrant full-color print that resists scratches'],
                ['📦', 'Ships Worldwide', 'Printed & fulfilled by Printful'],
              ].map(([icon, title, desc]) => (
                <div key={title} className="flex items-start gap-3">
                  <span className="text-xl">{icon}</span>
                  <div>
                    <span className="font-semibold text-sm">{title}</span>
                    <span className="text-gray-500 text-sm"> — {desc}</span>
                  </div>
                </div>
              ))}
            </div>

            <AddToCartButton product={product} />

            {product.tags?.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-2">
                {product.tags.map((tag: string) => (
                  <span key={tag} className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full">#{tag}</span>
                ))}
              </div>
            )}
          </div>
        </div>

        {related.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-6">You might also like</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
              {related.map((rel: any) => (
                <Link key={rel.id} href={`/product/${rel.slug}`}
                  className="group bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all">
                  <div className="aspect-square bg-gray-50">
                    {rel.images?.[0] ? (
                      <Image src={rel.images[0]} alt={rel.name} width={200} height={200}
                        className="w-full h-full object-contain p-3 group-hover:scale-105 transition-transform" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-4xl">🧲</div>
                    )}
                  </div>
                  <div className="p-3">
                    <p className="text-sm font-medium line-clamp-2">{rel.name}</p>
                    <p className="text-pink-600 font-bold text-sm mt-1">from $11.99</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  )
}
