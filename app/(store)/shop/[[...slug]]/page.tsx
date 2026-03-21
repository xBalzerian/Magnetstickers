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
    .eq('is_active', true)
    .ilike('name', `%${q}%`)
    .limit(48)
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
    const { data } = await supabase.from('categories')
      .select('*').eq('level', 1).eq('is_active', true).order('sort_order')
    subCategories = data ?? []
  }

  const totalPages = Math.ceil(totalProducts / 24)
  const categoryEmojis: Record<string, string> = {
    animals: '🐾', fruits: '🍎', vegetables: '🥦', wildlife: '🦁',
    quotes: '💬', 'food-drinks': '🍕', nature: '🌿', hobbies: '🎮',
    spiritual: '🔮', seasonal: '🎄', 'animals-dogs': '🐶',
    'animals-cats': '🐱', 'animals-birds': '🐦', 'animals-fish': '🐟',
    'animals-rabbits': '🐰', 'animals-hamsters': '🐹', 'animals-reptiles': '🦎',
  }

  const displayProducts = q ? searchResults : products

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6 flex-wrap">
        <Link href="/shop" className="hover:text-pink-500">Shop</Link>
        {category && (
          <>
            <span>/</span>
            <span className="text-gray-900 font-medium">{category.name}</span>
          </>
        )}
      </nav>

      <div className="flex items-center justify-between mb-2">
        <h1 className="text-3xl font-bold">
          {q ? `Search: "${q}"` : category ? `${category.name} Magnets` : 'All Magnet Stickers'}
        </h1>
        {totalProducts > 0 && (
          <span className="text-sm text-gray-400">{totalProducts} products</span>
        )}
      </div>
      <p className="text-gray-500 mb-8">
        {category?.description ?? 'Browse our unique die-cut magnet sticker collection'}
      </p>

      {/* Search bar */}
      <form method="GET" action="/shop" className="mb-8">
        <div className="flex gap-3 max-w-md">
          <input type="text" name="q" defaultValue={q ?? ''} placeholder="Search magnets…"
            className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-pink-300" />
          <button type="submit"
            className="bg-pink-500 hover:bg-pink-600 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors">
            Search
          </button>
        </div>
      </form>

      {/* Sub-categories grid */}
      {!q && subCategories.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-12">
          {subCategories.map((sub) => (
            <Link key={sub.id} href={`/shop/${sub.slug}`}
              className="group bg-gray-50 hover:bg-pink-50 border border-gray-200 hover:border-pink-300 rounded-2xl p-5 text-center transition-all hover:shadow-md">
              {sub.image_url ? (
                <Image src={sub.image_url} alt={sub.name} width={60} height={60}
                  className="mx-auto mb-3 rounded-xl object-cover" />
              ) : (
                <div className="text-4xl mb-2">{categoryEmojis[sub.slug] ?? '🧲'}</div>
              )}
              <div className="font-semibold text-sm text-gray-800 group-hover:text-pink-600">{sub.name}</div>
            </Link>
          ))}
        </div>
      )}

      {/* Products grid */}
      {displayProducts.length > 0 && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {displayProducts.map((product: any) => (
              <Link key={product.id} href={`/product/${product.slug}`}
                className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all">
                <div className="aspect-square bg-gray-50 relative overflow-hidden">
                  {product.images?.[0] ? (
                    <Image src={product.images[0]} alt={product.name} fill
                      className="object-contain p-3 group-hover:scale-105 transition-transform"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-5xl">🧲</div>
                  )}
                </div>
                <div className="p-4">
                  <p className="text-xs text-pink-500 mb-1">{product.categories?.name}</p>
                  <h3 className="font-semibold text-sm text-gray-800 line-clamp-2">{product.name}</h3>
                  <p className="text-pink-600 font-bold mt-2">from $11.99</p>
                </div>
              </Link>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-12">
              {Array.from({ length: Math.min(totalPages, 10) }, (_, i) => i + 1).map((p) => (
                <Link key={p} href={`/shop/${slugPath}?page=${p}`}
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-medium transition-colors ${
                    p === page ? 'bg-pink-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-pink-100'
                  }`}>{p}</Link>
              ))}
            </div>
          )}
        </>
      )}

      {!q && subCategories.length === 0 && products.length === 0 && (
        <div className="text-center py-20 text-gray-400">
          <div className="text-6xl mb-4">🧲</div>
          <p className="text-xl font-medium">Designs coming soon!</p>
          <p className="mt-2 text-sm">We&apos;re busy creating amazing magnets for this category.</p>
          <Link href="/shop" className="mt-6 inline-block text-pink-500 hover:underline text-sm">← Back to all categories</Link>
        </div>
      )}

      {q && searchResults.length === 0 && (
        <div className="text-center py-20 text-gray-400">
          <div className="text-6xl mb-4">🔍</div>
          <p className="text-xl font-medium">No results for &quot;{q}&quot;</p>
          <Link href="/shop" className="mt-4 inline-block text-pink-500 hover:underline text-sm">Browse all categories</Link>
        </div>
      )}
    </div>
  )
}
