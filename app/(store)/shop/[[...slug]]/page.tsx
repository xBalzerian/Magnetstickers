import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import Image from 'next/image'
import type { Category, Product } from '@/types/database'

interface PageProps {
  params: { slug?: string[] }
  searchParams: { page?: string }
}

async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const { data } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .single()
  return data
}

async function getSubCategories(parentId: string): Promise<Category[]> {
  const { data } = await supabase
    .from('categories')
    .select('*')
    .eq('parent_id', parentId)
    .eq('is_active', true)
    .order('sort_order')
  return data ?? []
}

async function getProducts(categoryId: string, page = 1, limit = 24) {
  const from = (page - 1) * limit
  const { data, count } = await supabase
    .from('products')
    .select('*, categories(name, slug)', { count: 'exact' })
    .eq('category_id', categoryId)
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .range(from, from + limit - 1)
  return { products: data ?? [], total: count ?? 0 }
}

export default async function ShopPage({ params, searchParams }: PageProps) {
  const slugPath = params.slug?.join('/') ?? ''
  const page = parseInt(searchParams.page ?? '1')

  let category: Category | null = null
  let subCategories: Category[] = []
  let products: Product[] = []
  let totalProducts = 0

  if (slugPath) {
    category = await getCategoryBySlug(slugPath)
    if (category) {
      subCategories = await getSubCategories(category.id)
      if (subCategories.length === 0) {
        // leaf category — show products
        const result = await getProducts(category.id, page)
        products = result.products as any
        totalProducts = result.total
      }
    }
  } else {
    // Top-level shop — show main categories
    const { data } = await supabase
      .from('categories')
      .select('*')
      .eq('level', 1)
      .eq('is_active', true)
      .order('sort_order')
    subCategories = data ?? []
  }

  const totalPages = Math.ceil(totalProducts / 24)

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/shop" className="hover:text-pink-500">Shop</Link>
        {category && (
          <>
            <span>/</span>
            <span className="text-gray-900 font-medium">{category.name}</span>
          </>
        )}
      </nav>

      <h1 className="text-3xl font-bold mb-2">
        {category ? category.name : 'All Magnet Stickers'}
      </h1>
      <p className="text-gray-500 mb-8">
        {category?.description ?? 'Browse our full collection of unique die-cut magnet stickers'}
      </p>

      {/* Sub-categories grid */}
      {subCategories.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-12">
          {subCategories.map((sub) => (
            <Link
              key={sub.id}
              href={`/shop/${sub.slug}`}
              className="group bg-gray-50 hover:bg-pink-50 border border-gray-200 hover:border-pink-300 rounded-2xl p-5 text-center transition-all hover:shadow-md"
            >
              {sub.image_url ? (
                <Image src={sub.image_url} alt={sub.name} width={80} height={80} className="mx-auto mb-3 rounded-xl" />
              ) : (
                <div className="text-4xl mb-2">🧲</div>
              )}
              <div className="font-semibold text-sm text-gray-800 group-hover:text-pink-600">{sub.name}</div>
            </Link>
          ))}
        </div>
      )}

      {/* Products grid */}
      {products.length > 0 && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {products.map((product: any) => (
              <Link
                key={product.id}
                href={`/product/${product.slug}`}
                className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all"
              >
                <div className="aspect-square bg-gray-50 relative overflow-hidden">
                  {product.images?.[0] ? (
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      className="object-contain p-3 group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-5xl">🧲</div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-sm text-gray-800 line-clamp-2">{product.name}</h3>
                  <p className="text-pink-600 font-bold mt-2">${(product.price_cents / 100).toFixed(2)}</p>
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-12">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <Link
                  key={p}
                  href={`/shop/${slugPath}?page=${p}`}
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-medium transition-colors ${
                    p === page
                      ? 'bg-pink-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-pink-100'
                  }`}
                >
                  {p}
                </Link>
              ))}
            </div>
          )}
        </>
      )}

      {subCategories.length === 0 && products.length === 0 && (
        <div className="text-center py-20 text-gray-400">
          <div className="text-6xl mb-4">🧲</div>
          <p className="text-xl">Designs coming soon!</p>
          <p className="mt-2">We&apos;re busy creating amazing magnets for this category.</p>
        </div>
      )}
    </div>
  )
}
