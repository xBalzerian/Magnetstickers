'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react'
import { getCart, updateQuantity, removeFromCart, getCartTotal, type CartItem } from '@/lib/cart'
import { buildMetadata } from '@/lib/seo'

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([])

  useEffect(() => {
    const update = () => setCart(getCart())
    update()
    window.addEventListener('cart-updated', update)
    return () => window.removeEventListener('cart-updated', update)
  }, [])

  const total = getCartTotal(cart)

  if (cart.length === 0) return (
    <div className="max-w-2xl mx-auto px-4 py-24 text-center">
      <div className="text-7xl mb-6">🛒</div>
      <h1 className="text-2xl font-bold mb-3">Your cart is empty</h1>
      <p className="text-gray-500 mb-8">Looks like you haven't added any magnets yet!</p>
      <Link href="/shop" className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 px-8 rounded-full transition-colors">
        Start Shopping
      </Link>
    </div>
  )

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
        <ShoppingBag size={28} /> Shopping Cart
        <span className="text-base font-normal text-gray-400">({cart.length} item{cart.length !== 1 ? 's' : ''})</span>
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map(item => (
            <div key={item.id} className="flex gap-4 bg-white border border-gray-100 rounded-2xl p-4 hover:shadow-md transition-shadow">
              <div className="w-20 h-20 bg-gray-50 rounded-xl overflow-hidden shrink-0">
                {item.image
                  ? <Image src={item.image} alt={item.name} width={80} height={80} className="w-full h-full object-contain p-1" />
                  : <div className="w-full h-full flex items-center justify-center text-3xl">🧲</div>}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm text-gray-800 line-clamp-2">{item.name}</h3>
                <p className="text-pink-600 font-bold mt-1">${(item.priceCents / 100).toFixed(2)}</p>
                <div className="flex items-center gap-3 mt-2">
                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-7 h-7 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200">
                    <Minus size={13} />
                  </button>
                  <span className="font-semibold text-sm w-6 text-center">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-7 h-7 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200">
                    <Plus size={13} />
                  </button>
                  <span className="text-xs text-gray-400 ml-2">= ${((item.priceCents * item.quantity) / 100).toFixed(2)}</span>
                </div>
              </div>
              <button onClick={() => removeFromCart(item.id)} className="text-gray-300 hover:text-red-400 transition-colors self-start">
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>

        {/* Order summary */}
        <div className="lg:col-span-1">
          <div className="bg-gray-50 rounded-2xl p-6 sticky top-24">
            <h2 className="font-bold text-lg mb-4">Order Summary</h2>
            <div className="space-y-2 text-sm mb-4">
              {cart.map(item => (
                <div key={item.id} className="flex justify-between text-gray-600">
                  <span className="truncate mr-2">{item.name} × {item.quantity}</span>
                  <span className="shrink-0">${((item.priceCents * item.quantity) / 100).toFixed(2)}</span>
                </div>
              ))}
              <div className="border-t pt-2 mt-2 flex justify-between text-gray-500">
                <span>Shipping</span>
                <span className="text-green-600 font-medium">Calculated at checkout</span>
              </div>
            </div>
            <div className="border-t pt-4 flex justify-between font-extrabold text-xl mb-6">
              <span>Total</span>
              <span className="text-pink-600">${(total / 100).toFixed(2)}</span>
            </div>
            <Link
              href="/checkout"
              className="block w-full bg-pink-500 hover:bg-pink-600 text-white font-bold py-4 rounded-2xl text-center transition-colors shadow-lg"
            >
              Proceed to Checkout
            </Link>
            <Link href="/shop" className="block text-center text-sm text-gray-500 mt-4 hover:text-pink-500">
              ← Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
