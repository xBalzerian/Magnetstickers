export const dynamic = 'force-dynamic'

import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import { buildCategoryMetadata, buildMetadata } from '@/lib/seo'
import type { Category } from '@/types/database'

interface PageProps {
  params: Promise<{ slug?: string[] }>
  searchParams: Promise<{ page?: string; q?: string; sort?: string }>
}

async function getAllCategories(): Promise<Category[]> {
  const { data } = await supabase.from('categories').select('*').eq('level', 1).eq('is_active', true).order('sort_order')
  return data ?? []
}

async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const { data } = await supabase.from('categories').select('*').eq('slug', slug).single()
  return data
}

async function getSubCategories(parentId: string): Promise<Category[]> {
  const { data } = await supabase.from('categories').select('*').eq('parent_id', parentId).eq('is_active', true).order('sort_order')
  return data ?? []
}

async function getAllProducts(page = 1, limit = 30, sort = 'newest') {
  const from = (page - 1) * limit
  let query = supabase.from('products').select('*, categories(name, slug)', { count: 'exact' }).eq('is_active', true)
  if (sort === 'price_asc') query = query.order('price_cents', { ascending: true })
  else if (sort === 'price_desc') query = query.order('price_cents', { ascending: false })
  else query = query.order('created_at', { ascending: false })
  query = query.range(from, from + limit - 1)
  const { data, count } = await query
  return { products: data ?? [], total: count ?? 0 }
}

async function getCategoryProducts(categoryId: string, page = 1, limit = 30, sort = 'newest') {
  const from = (page - 1) * limit
  let query = supabase.from('products').select('*, categories(name, slug)', { count: 'exact' }).eq('category_id', categoryId).eq('is_active', true)
  if (sort === 'price_asc') query = query.order('price_cents', { ascending: true })
  else if (sort === 'price_desc') query = query.order('price_cents', { ascending: false })
  else query = query.order('created_at', { ascending: false })
  query = query.range(from, from + limit - 1)
  const { data, count } = await query
  return { products: data ?? [], total: count ?? 0 }
}

async function searchProducts(q: string, sort = 'newest') {
  let query = supabase.from('products').select('*, categories(name, slug)').eq('is_active', true).ilike('name', `%${q}%`).limit(60)
  if (sort === 'price_asc') query = query.order('price_cents', { ascending: true })
  else if (sort === 'price_desc') query = query.order('price_cents', { ascending: false })
  else query = query.order('created_at', { ascending: false })
  const { data } = await query
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
  const { page: pageParam, q, sort = 'newest' } = await searchParams
  const slugPath = slug?.join('/') ?? ''
  const page = parseInt(pageParam ?? '1')

  const topCategories = await getAllCategories()

  let category: Category | null = null
  let subCategories: Category[] = []
  let products: any[] = []
  let totalProducts = 0
  let isSearch = !!q

  if (q) {
    products = await searchProducts(q, sort)
    totalProducts = products.length
  } else if (slugPath) {
    category = await getCategoryBySlug(slugPath)
    if (category) {
      subCategories = await getSubCategories(category.id)
      if (subCategories.length > 0) {
        // category has subcategories — load products from all subs
        const subIds = subCategories.map(s => s.id)
        let qr = supabase.from('products').select('*, categories(name, slug)', { count: 'exact' }).eq('is_active', true).in('category_id', subIds)
        if (sort === 'price_asc') qr = qr.order('price_cents', { ascending: true })
        else if (sort === 'price_desc') qr = qr.order('price_cents', { ascending: false })
        else qr = qr.order('created_at', { ascending: false })
        const from = (page - 1) * 30
        qr = qr.range(from, from + 29)
        const { data, count } = await qr
        products = data ?? []
        totalProducts = count ?? 0
      } else {
        const result = await getCategoryProducts(category.id, page, 30, sort)
        products = result.products
        totalProducts = result.total
      }
    }
  } else {
    const result = await getAllProducts(page, 30, sort)
    products = result.products
    totalProducts = result.total
  }

  const totalPages = Math.ceil(totalProducts / 30)
  const pageTitle = isSearch ? `Search: "${q}"` : (category?.name ?? 'All Magnet Stickers')
  const pageDesc = category?.description ?? 'Browse our full collection of premium die-cut magnet stickers'

  return (
    <div style={{ background: '#F5F0E8', color: '#1C1410', minHeight: '100vh' }}>

      {/* PAGE HEADER */}
      <div className="border-b px-4 sm:px-6 py-6 sm:py-8" style={{ background: '#EDE8DE', borderColor: '#DDD7CB' }}>
        <div className="max-w-7xl mx-auto">
          <nav className="flex items-center gap-2 text-xs mb-3 flex-wrap" style={{ color: '#1C1410', opacity: 0.4 }}>
            <Link href="/shop" className="hover:opacity-80 transition-opacity" style={{ color: '#C8341A', opacity: 1 }}>All</Link>
            {category && <><span>/</span><span>{category.name}</span></>}
            {isSearch && <><span>/</span><span>Search</span></>}
          </nav>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black" style={{ color: '#1C1410' }}>{pageTitle}</h1>
              {!isSearch && <p className="text-sm mt-1 opacity-40">{pageDesc}</p>}
            </div>
            <div className="flex items-center gap-3">
              {totalProducts > 0 && (
                <span className="text-xs border px-3 py-1.5 rounded-full shrink-0 opacity-50"
                  style={{ borderColor: '#DDD7CB' }}>
                  {totalProducts} design{totalProducts !== 1 ? 's' : ''}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">

        {/* FILTERS ROW */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-8 items-start sm:items-center justify-between">

          {/* Category filter pills */}
          <div className="flex flex-wrap gap-2">
            <Link href="/shop"
              className="px-3.5 py-1.5 rounded-full text-xs font-bold border transition-all"
              style={!slugPath && !isSearch
                ? { background: '#C8341A', color: '#F5F0E8', borderColor: '#C8341A' }
                : { background: 'transparent', color: '#1C1410', borderColor: '#DDD7CB', opacity: 0.6 }}>
              All
            </Link>
            {topCategories.map(cat => (
              <Link key={cat.id} href={`/shop/${cat.slug}`}
                className="px-3.5 py-1.5 rounded-full text-xs font-bold border transition-all"
                style={slugPath === cat.slug || slugPath.startsWith(cat.slug)
                  ? { background: '#C8341A', color: '#F5F0E8', borderColor: '#C8341A' }
                  : { background: 'transparent', color: '#1C1410', borderColor: '#DDD7CB', opacity: 0.6 }}>
                {cat.name}
              </Link>
            ))}
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs opacity-40 hidden sm:block">Sort:</span>
            <div className="flex gap-1.5">
              {[['newest','New First'],['price_asc','$ Low-High'],['price_desc','$ High-Low']].map(([val, label]) => {
                const base = slugPath ? `/shop/${slugPath}` : '/shop'
                const href = `${base}?sort=${val}${q ? `&q=${q}` : ''}`
                return (
                  <Link key={val} href={href}
                    className="px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all"
                    style={sort === val
                      ? { background: '#1C1410', color: '#F5F0E8', borderColor: '#1C1410' }
                      : { background: 'transparent', color: '#1C1410', borderColor: '#DDD7CB', opacity: 0.5 }}>
                    {label}
                  </Link>
                )
              })}
            </div>
          </div>
        </div>

        {/* Sub-category pills (if parent cat has subs) */}
        {subCategories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6 pb-5 border-b" style={{ borderColor: '#DDD7CB' }}>
            {subCategories.map(sub => (
              <Link key={sub.id} href={`/shop/${sub.slug}`}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all hover:opacity-80"
                style={{ background: '#EDE8DE', color: '#1C1410', borderColor: '#DDD7CB' }}>
                {sub.name}
              </Link>
            ))}
          </div>
        )}

        {/* PRODUCTS GRID */}
        {products.length > 0 ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
              {products.map((p: any) => (
                <Link key={p.id} href={`/product/${p.slug}`}
                  className="group rounded-2xl overflow-hidden border transition-all duration-300 hover:-translate-y-1 hover:shadow-lg active:scale-[0.98]"
                  style={{ background: '#FBF8F3', borderColor: '#E5DFD5' }}>
                  <div className="aspect-square relative overflow-hidden"
                    style={{ background: 'linear-gradient(135deg, #EDE8DE 0%, #E5DFD5 100%)' }}>
                    {p.images?.[0] ? (
                      <Image src={p.images[0]} alt={p.name} fill
                        className="object-contain p-3 group-hover:scale-108 transition-transform duration-500"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 17vw" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="w-10 h-10 rounded-full border" style={{ borderColor: '#DDD7CB' }} />
                      </div>
                    )}
                    <div className="absolute top-2 left-2 text-white text-[9px] font-black px-2 py-0.5 rounded-full tracking-wide"
                      style={{ background: '#C8341A' }}>
                      NEW
                    </div>
                  </div>
                  <div className="p-3">
                    {(isSearch || !category) && p.categories && (
                      <p className="text-[9px] font-bold uppercase tracking-widest mb-0.5 truncate" style={{ color: '#C8341A' }}>{p.categories.name}</p>
                    )}
                    <h3 className="font-bold text-xs sm:text-sm line-clamp-2 leading-snug mb-2" style={{ color: '#1C1410' }}>{p.name}</h3>
                    <div className="flex items-center justify-between">
                      <p className="font-black text-sm" style={{ color: '#C8341A' }}>${((p.price_cents ?? 1199)/100).toFixed(2)}</p>
                      <span className="text-[9px] border px-1.5 py-0.5 rounded-full opacity-50" style={{ borderColor: '#DDD7CB', color: '#1C1410' }}>3 sizes</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12 flex items-center justify-center gap-2">
                {page > 1 && (
                  <Link href={`/shop${slugPath ? `/${slugPath}` : ''}?page=${page - 1}&sort=${sort}`}
                    className="px-4 py-2 border rounded-xl text-sm font-semibold transition-all hover:opacity-80"
                    style={{ borderColor: '#DDD7CB', color: '#1C1410' }}>
                    ← Prev
                  </Link>
                )}
                {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                  const pn = i + 1
                  return (
                    <Link key={pn} href={`/shop${slugPath ? `/${slugPath}` : ''}?page=${pn}&sort=${sort}`}
                      className="w-9 h-9 rounded-xl text-sm font-bold flex items-center justify-center transition-all"
                      style={pn === page
                        ? { background: '#C8341A', color: '#F5F0E8' }
                        : { border: '1px solid #DDD7CB', color: '#1C1410', opacity: 0.5 }}>
                      {pn}
                    </Link>
                  )
                })}
                {page < totalPages && (
                  <Link href={`/shop${slugPath ? `/${slugPath}` : ''}?page=${page + 1}&sort=${sort}`}
                    className="px-4 py-2 border rounded-xl text-sm font-semibold transition-all hover:opacity-80"
                    style={{ borderColor: '#DDD7CB', color: '#1C1410' }}>
                    Next →
                  </Link>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="py-20 text-center">
            <p className="text-4xl mb-4">🔍</p>
            <h2 className="font-black text-xl mb-2" style={{ color: '#1C1410' }}>
              {isSearch ? `No results for "${q}"` : 'No products yet'}
            </h2>
            <p className="opacity-40 text-sm mb-6">
              {isSearch ? 'Try a different search term' : 'Check back soon — new designs drop daily'}
            </p>
            <Link href="/shop"
              className="inline-flex items-center gap-2 font-bold py-3 px-8 rounded-xl text-sm transition-all hover:opacity-90"
              style={{ background: '#C8341A', color: '#F5F0E8' }}>
              Browse all magnets
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
