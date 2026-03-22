'use client'
import { useState } from 'react'
import { addToCart, type CartItem } from '@/lib/cart'

interface Size {
  id: string
  label: string
  dims: string
  cents: number
  note: string
  popular?: boolean
}

interface Props {
  product: {
    id: string
    name: string
    slug: string
    images?: string[]
    price_cents?: number
    price?: number
  }
  sizes?: readonly Size[]
}

const DEFAULT_SIZES: Size[] = [
  { id: 'sm',  label: 'Small',  dims: '3″ × 3″',  cents: 899,  note: 'Perfect for laptops & books' },
  { id: 'md',  label: 'Medium', dims: '4″ × 4″',  cents: 1199, note: 'Most popular size', popular: true },
  { id: 'lg',  label: 'Large',  dims: '6″ × 6″',  cents: 1599, note: 'Statement piece for the fridge' },
]

export default function AddToCartButton({ product, sizes }: Props) {
  const sizeOptions = (sizes ?? DEFAULT_SIZES) as Size[]
  const [selectedSize, setSelectedSize] = useState(sizeOptions.find(s => s.popular)?.id ?? sizeOptions[0]?.id ?? 'md')
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)

  const activeSize = sizeOptions.find(s => s.id === selectedSize) ?? sizeOptions[0]
  const unitPrice = (activeSize?.cents ?? 1199) / 100
  const total = unitPrice * qty

  function handleAdd() {
    const item: CartItem = {
      productId: product.id,
      name: product.name,
      slug: product.slug,
      image: product.images?.[0] ?? '',
      price: unitPrice,
      quantity: qty,
      size: activeSize?.label ?? 'Medium',
      sizeDims: activeSize?.dims ?? '4″ × 4″',
    }
    addToCart(item)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div>
      {/* SIZE OPTIONS */}
      <div className="space-y-2 mb-5">
        {sizeOptions.map(s => (
          <button key={s.id} onClick={() => setSelectedSize(s.id)}
            className="w-full flex items-center justify-between p-3.5 rounded-xl border text-left transition-all"
            style={{
              background: selectedSize === s.id ? '#FFF8F0' : '#EDE8DE',
              borderColor: selectedSize === s.id ? '#C8341A' : '#DDD7CB',
              borderWidth: selectedSize === s.id ? 2 : 1,
            }}>
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-5 h-5 rounded-full border-2"
                style={{ borderColor: selectedSize === s.id ? '#C8341A' : '#DDD7CB' }}>
                {selectedSize === s.id && <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#C8341A' }} />}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold" style={{ color: '#1C1410' }}>{s.label}</span>
                  <span className="text-xs opacity-40">{s.dims}</span>
                  {s.popular && (
                    <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-full text-white"
                      style={{ background: '#C8341A' }}>Popular</span>
                  )}
                </div>
                <span className="text-[10px] opacity-35">{s.note}</span>
              </div>
            </div>
            <span className="font-black text-sm" style={{ color: selectedSize === s.id ? '#C8341A' : '#1C1410' }}>
              ${(s.cents / 100).toFixed(2)}
            </span>
          </button>
        ))}
      </div>

      {/* QTY + ADD TO CART */}
      <div className="flex gap-3 items-stretch">
        <div className="flex items-center border rounded-xl overflow-hidden" style={{ borderColor: '#DDD7CB' }}>
          <button onClick={() => setQty(Math.max(1, qty - 1))}
            className="px-3.5 py-3 text-sm font-bold transition-colors hover:opacity-70"
            style={{ color: '#1C1410' }}>
            −
          </button>
          <span className="px-3 text-sm font-black" style={{ color: '#1C1410', minWidth: '2rem', textAlign: 'center' }}>{qty}</span>
          <button onClick={() => setQty(qty + 1)}
            className="px-3.5 py-3 text-sm font-bold transition-colors hover:opacity-70"
            style={{ color: '#1C1410' }}>
            +
          </button>
        </div>

        <button onClick={handleAdd}
          className="flex-1 font-black py-3 px-6 rounded-xl text-base transition-all hover:opacity-90 active:scale-[0.98] shadow-md text-white"
          style={added
            ? { background: '#2E8B57' }
            : { background: 'linear-gradient(135deg, #C8341A, #E85A20)', boxShadow: '0 4px 16px rgba(200,52,26,0.3)' }}>
          {added ? '✓ Added!' : `Add to Cart — $${total.toFixed(2)}`}
        </button>
      </div>
    </div>
  )
}
