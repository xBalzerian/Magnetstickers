'use client'
import { useState } from 'react'
import { ShoppingCart, Check, Plus, Minus } from 'lucide-react'
import { addToCart } from '@/lib/cart'

interface Props {
  product: {
    id: string
    name: string
    slug: string
    images?: string[]
    price?: number
  }
}

export default function AddToCartButton({ product }: Props) {
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)

  function handleAdd() {
    addToCart({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price ?? 11.99,
      image: product.images?.[0] ?? null,
      quantity: qty,
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 2500)
  }

  return (
    <div className="flex flex-col gap-3 w-full">
      {/* Qty + Add to Cart row */}
      <div className="flex items-center gap-3">
        {/* Qty */}
        <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl p-1.5">
          <button onClick={() => setQty(q => Math.max(1, q - 1))}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors text-gray-400 hover:text-white">
            <Minus size={14} />
          </button>
          <span className="font-black text-white text-base min-w-[28px] text-center">{qty}</span>
          <button onClick={() => setQty(q => q + 1)}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors text-gray-400 hover:text-white">
            <Plus size={14} />
          </button>
        </div>

        {/* Add to cart */}
        <button onClick={handleAdd}
          className={`flex-1 flex items-center justify-center gap-2 font-black py-3.5 rounded-2xl transition-all text-sm shadow-lg active:scale-[0.98]
            ${added
              ? 'bg-green-500 text-white shadow-green-500/20'
              : 'bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 text-white shadow-pink-500/20 hover:shadow-pink-500/30'
            }`}>
          {added ? (
            <><Check size={16} /> Added to Cart</>
          ) : (
            <><ShoppingCart size={16} /> Add to Cart</>
          )}
        </button>
      </div>

      {/* Total preview */}
      {qty > 1 && (
        <p className="text-xs text-gray-600 text-center">
          {qty} magnets = <span className="text-white font-bold">${((product.price ?? 11.99) * qty).toFixed(2)}</span>
        </p>
      )}
    </div>
  )
}
