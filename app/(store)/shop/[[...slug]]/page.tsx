export const dynamic = 'force-dynamic'

import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import { buildCategoryMetadata, buildMetadata } from '@/lib/seo'
import type { Category } from '@/types/database'

interface PageProps {
  params: Promise<{ slug?: string[] }>
  searchParams: Promise<{ page?: string; q?: string }>
}

async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const { data } = await supabase.from('categories').select('*').eq('slug', slug).single()
  return data
}

async function getSubCategories(parentId: string): Promise<Category[]> {
  const { data } = await supabase.from('categories').select('*')
    .eq('parent_id', parentId).eq('is_active', true).order('sort_order')
  return data ?? []
}

async function getProducts(categoryId: string, page = 1, limit = 24) {
  const from = (page - 1) * limit
  const { data, count } = await supabase.from('products')
    .select('*, categories(name, slug)', { count: 'exact' })
    .eq('category_id', categoryId).eq('is_active', true)
    .order('created_at', { ascending: false })
    .range(from, from + limit - 1)
  return { products: data ?? [], total: count ?? 0 }
}

async function searchProducts(q: string) {
  const { data } = await supabase.from('products')
    .select('*, categories(name, slug)')
    .eq('is_active', true).ilike('name', `%${q}%`).limit(48)
  return data ?? []
}

async function getAllTopCategories(): Promise<Category[]> {
  const { data } = await supabase.from('categories')
    .select('*').eq('level', 1).eq('is_active', true).order('sort_order')
  return data ?? []
}

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const slugPath = slug?.join('/') ?? ''
  if (!slugPath) return buildMetadata({ title: 'Shop All Magnet Stickers', path: '/shop' })
  const category = await getCategoryBySlug(slugPath)
  if (!category) return buildMetadata({ title: 'Shop', path: '/shop' })
  return buildCategoryMetadata(category)
}

export default async function ShopPage({ params, searchParams }: PageProps) {
  const { slug } = await params
  const { page: pageParam, q } = await searchParams
  const slugPath = slug?.join('/') ?? ''
  const page = parseInt(pageParam ?? '1')

  let category: Category | null = null
  let subCategories: Category[] = []
  let products: any[] = []
  let totalProducts = 0
  let searchResults: any[] = []
  let topCategories: Category[] = []

  if (q) {
    searchResults = await searchProducts(q)
  } else if (slugPath) {
    category = await getCategoryBySlug(slugPath)
    if (category) {
      subCategories = await getSubCategories(category.id)
      if (subCategories.length === 0) {
        const result = await getProducts(category.id, page)
        products = result.products
        totalProducts = result.total
      }
    }
  } else {
    topCategories = await getAllTopCategories()
  }

  const totalPages = Math.ceil(totalProducts / 24)
  const isSearch = !!q
  const displayProducts = isSearch ? searchResults : products

  return (
    <div className="min-h-screen bg-black text-white">

      {/* Header strip */}
      <div className="bg-gray-950 border-b border-white/8 px-4 sm:px-6 py-6 sm:py-8">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          {category && (
            <nav className="flex items-center gap-2 text-xs text-gray-600 mb-4 flex-wrap">
              <Link href="/shop" className="hover:text-pink-400 transition-colors">All Categories</Link>
              <span>/</span>
              <span className="text-gray-400">{category.name}</span>
            </nav>
          )}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white">
                {isSearch ? `Search: "${q}"` : (category?.name ?? 'All Magnet Stickers')}
              </h1>
              {!isSearch && (
                <p className="text-gray-600 text-sm mt-1">
                  {category?.description ?? 'Browse our full collection of die-cut magnet stickers'}
                </p>
              )}
            </div>
            {displayProducts.length > 0 && (
              <span className="text-xs text-gray-600 bg-white/5 border border-white/8 px-3 py-1.5 rounded-full shrink-0">
                {isSearch ? searchResults.length : totalProducts} designs
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10">

        {/* All categories view */}
        {!category && !isSearch && topCategories.length > 0 && (
          <div>
            <h2 className="text-lg font-bold text-gray-400 mb-5 uppercase tracking-widest text-xs">Browse Categories</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
              {topCategories.map(cat => (
                <Link key={cat.id} href={`/shop/${cat.slug}`}
                  className="group bg-gray-950 hover:bg-gray-900 border border-white/8 hover:border-pink-500/40 rounded-2xl p-5 text-center transition-all hover:scale-[1.03] hover:shadow-lg hover:shadow-pink-500/10">
                  <div className="font-bold text-white text-sm mb-1 group-hover:text-pink-400 transition-colors">{cat.name}</div>
                  <div className="text-xs text-gray-700">Explore</div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Subcategories */}
        {subCategories.length > 0 && (
          <div>
            <h2 className="text-xs font-bold text-gray-600 mb-4 uppercase tracking-widest">Subcategories in {category?.name}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 mb-10">
              {subCategories.map(sub => (
                <Link key={sub.id} href={`/shop/${sub.slug}`}
                  className="group bg-gray-950 hover:bg-gray-900 border border-white/8 hover:border-pink-500/40 rounded-2xl p-5 text-center transition-all hover:scale-[1.03]">
                  <div className="font-bold text-white text-sm group-hover:text-pink-400 transition-colors">{sub.name}</div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Products grid */}
        {displayProducts.length > 0 && (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
              {displayProducts.map((p: any) => (
                <Link key={p.id} href={`/product/${p.slug}`}
                  className="group bg-gray-950 rounded-2xl overflow-hidden border border-white/5 hover:border-pink-500/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-pink-500/10 active:scale-[0.98]">
                  <div className="aspect-square bg-gradient-to-br from-gray-900 to-gray-950 relative overflow-hidden">
                    {p.images?.[0] ? (
                      <Image src={p.images[0]} alt={p.name} fill
                        className="object-contain p-3 group-hover:scale-110 transition-transform duration-500"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 17vw" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="w-10 h-10 rounded-full bg-white/5 border border-white/8" />
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    {isSearch && p.categories && (
                      <p className="text-[10px] text-pink-400 font-bold uppercase tracking-wide mb-0.5 truncate">{p.categories.name}</p>
                    )}
                    <h3 className="font-bold text-white text-xs sm:text-sm line-clamp-2 leading-snug mb-1.5">{p.name}</h3>
                    <p className="text-pink-400 font-black text-sm">$11.99</p>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-10 sm:mt-14 flex items-center justify-center gap-2">
                {page > 1 && (
                  <Link href={`/shop/${slugPath}?page=${page - 1}`}
                    className="px-4 py-2 bg-white/5 border border-white/10 hover:border-pink-500/40 hover:bg-white/8 rounded-xl text-sm text-gray-400 hover:text-white transition-all">
                    Previous
                  </Link>
                )}
                <div className="flex items-center gap-1.5">
                  {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                    const p_num = i + 1
                    return (
                      <Link key={p_num} href={`/shop/${slugPath}?page=${p_num}`}
                        className={`w-9 h-9 rounded-xl text-sm font-bold flex items-center justify-center transition-all
                          ${p_num === page
                            ? 'bg-pink-500 text-white shadow-lg shadow-pink-500/30'
                            : 'bg-white/5 border border-white/10 text-gray-500 hover:text-white hover:border-white/25'
                          }`}>
                        {p_num}
                      </Link>
                    )
                  })}
                </div>
                {page < totalPages && (
                  <Link href={`/shop/${slugPath}?page=${page + 1}`}
                    className="px-4 py-2 bg-white/5 border border-white/10 hover:border-pink-500/40 hover:bg-white/8 rounded-xl text-sm text-gray-400 hover:text-white transition-all">
                    Next
                  </Link>
                )}
              </div>
            )}
          </>
        )}

        {/* Empty state */}
        {!topCategories.length && displayProducts.length === 0 && subCategories.length === 0 && (
          <div className="text-center py-20 sm:py-32">
            <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl mx-auto mb-6 flex items-center justify-center">
              <div className="w-6 h-6 rounded-full border-2 border-white/20" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              {isSearch ? 'No results found' : 'Coming soon'}
            </h3>
            <p className="text-gray-600 text-sm mb-8">
              {isSearch ? `No designs match "${q}"` : 'This collection is being generated. Check back soon.'}
            </p>
            <Link href="/shop"
              className="inline-flex items-center gap-2 bg-pink-500 hover:bg-pink-400 text-white font-bold py-3 px-8 rounded-xl transition-all text-sm">
              Browse All Magnets
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
