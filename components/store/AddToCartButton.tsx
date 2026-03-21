'use client'
import { useState } from 'react'
import { addToCart } from '@/lib/cart'
import { ShoppingCart, Check } from 'lucide-react'
import { PRINTFUL_VARIANTS, type MagnetSize } from '@/lib/printful'

interface Props {
  product: {
    id: string
    name: string
    slug: string
    images: string[]
    price_cents: number
    printful_variant_id?: number | null
  }
}

export default function AddToCartButton({ product }: Props) {
  const [added, setAdded] = useState(false)
  const [size, setSize] = useState<MagnetSize>('3x3')

  const selectedVariant = PRINTFUL_VARIANTS[size]
  // Selling price = cost + markup (~3.5x markup for healthy margin)
  const prices: Record<MagnetSize, number> = { '3x3': 1199, '4x4': 1499, '6x6': 1999 }

  function handleAdd() {
    addToCart({
      productId: product.id,
      name: `${product.name} (${selectedVariant.label})`,
      slug: product.slug,
      image: product.images?.[0] ?? null,
      priceCents: prices[size],
      printfulVariantId: selectedVariant.id,
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div className="space-y-4">
      {/* Size selector */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Size</label>
        <div className="flex gap-3">
          {(Object.entries(PRINTFUL_VARIANTS) as [MagnetSize, typeof PRINTFUL_VARIANTS[MagnetSize]][]).map(([key, v]) => (
            <button
              key={key}
              onClick={() => setSize(key)}
              className={`flex-1 border-2 rounded-xl py-3 px-2 text-center transition-all ${
                size === key
                  ? 'border-pink-500 bg-pink-50 text-pink-700'
                  : 'border-gray-200 text-gray-600 hover:border-gray-300'
              }`}
            >
              <div className="font-bold text-sm">{v.label}</div>
              <div className="text-xs text-gray-500">{v.sizeCm}</div>
              <div className="text-sm font-semibold mt-1">${(prices[key] / 100).toFixed(2)}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Add to cart */}
      <button
        onClick={handleAdd}
        className={`w-full py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all ${
          added
            ? 'bg-green-500 text-white'
            : 'bg-pink-500 hover:bg-pink-600 text-white shadow-lg hover:shadow-pink-200'
        }`}
      >
        {added ? <><Check size={22} /> Added to Cart!</> : <><ShoppingCart size={22} /> Add to Cart</>}
      </button>

      {/* Buy now */}
      {!added && (
        <a
          href="/checkout"
          onClick={handleAdd}
          className="block w-full py-4 rounded-2xl font-bold text-lg text-center border-2 border-gray-200 text-gray-700 hover:border-pink-300 hover:text-pink-600 transition-all"
        >
          Buy Now
        </a>
      )}
    </div>
  )
}
