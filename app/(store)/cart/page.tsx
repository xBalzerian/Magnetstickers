'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from 'lucide-react'
import { getCart, updateQuantity, removeFromCart, getCartTotal, type CartItem } from '@/lib/cart'

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
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <div className="text-center max-w-sm">
        <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-3xl mx-auto mb-6 flex items-center justify-center">
          <ShoppingBag size={32} className="text-gray-600" />
        </div>
        <h1 className="text-2xl font-black mb-3">Your cart is empty</h1>
        <p className="text-gray-600 text-sm mb-8 leading-relaxed">You haven&apos;t added any magnets yet. Browse our collection to find your perfect design.</p>
        <Link href="/shop"
          className="inline-flex items-center gap-2 bg-pink-500 hover:bg-pink-400 text-white font-black py-4 px-8 rounded-2xl transition-all shadow-lg shadow-pink-500/20 text-sm">
          Browse Magnets
        </Link>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">

        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/shop" className="text-gray-600 hover:text-gray-300 transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-2xl sm:text-3xl font-black">
            Shopping Cart
            <span className="text-base font-normal text-gray-600 ml-3">({cart.length} item{cart.length !== 1 ? 's' : ''})</span>
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">

          {/* Items */}
          <div className="lg:col-span-2 space-y-3">
            {cart.map(item => (
              <div key={item.id} className="bg-gray-950 border border-white/8 rounded-2xl p-4 sm:p-5 flex gap-4">
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl overflow-hidden flex-shrink-0 relative border border-white/5">
                  {item.image ? (
                    <Image src={item.image} alt={item.name} fill className="object-contain p-2" sizes="96px" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="w-8 h-8 rounded-full bg-white/5" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-white text-sm sm:text-base leading-snug line-clamp-2 mb-0.5">{item.name}</h3>
                  <p className="text-xs text-gray-600 mb-3">Die-Cut Magnet Sticker</p>
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl p-1">
                      <button onClick={() => { updateQuantity(item.id, item.quantity - 1); setCart(getCart()) }}
                        className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors text-gray-400 hover:text-white">
                        <Minus size={13} />
                      </button>
                      <span className="text-sm font-bold text-white min-w-[20px] text-center">{item.quantity}</span>
                      <button onClick={() => { updateQuantity(item.id, item.quantity + 1); setCart(getCart()) }}
                        className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors text-gray-400 hover:text-white">
                        <Plus size={13} />
                      </button>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-black text-white text-base">${(item.price * item.quantity).toFixed(2)}</span>
                      <button onClick={() => { removeFromCart(item.id); setCart(getCart()) }}
                        className="p-1.5 text-gray-700 hover:text-red-400 transition-colors rounded-lg hover:bg-red-500/10">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-gray-950 border border-white/8 rounded-2xl p-5 sm:p-6 sticky top-20">
              <h2 className="font-black text-lg mb-5">Order Summary</h2>
              <div className="space-y-3 mb-5 text-sm">
                <div className="flex justify-between text-gray-500">
                  <span>Subtotal ({cart.reduce((a, c) => a + c.quantity, 0)} items)</span>
                  <span className="text-white">${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Shipping</span>
                  <span className="text-green-400 font-semibold">{total >= 35 ? 'FREE' : 'Calculated at checkout'}</span>
                </div>
                {total >= 35 && (
                  <div className="bg-green-500/10 border border-green-500/20 rounded-xl px-3 py-2 text-xs text-green-400 font-semibold">
                    You qualify for free shipping!
                  </div>
                )}
              </div>
              <div className="border-t border-white/8 pt-4 mb-5">
                <div className="flex justify-between font-black text-lg">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
              <Link href="/checkout"
                className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 text-white font-black py-4 rounded-2xl text-center block transition-all shadow-xl shadow-pink-500/20 hover:shadow-pink-500/30 active:scale-[0.98]">
                Checkout with PayPal
              </Link>
              <Link href="/shop" className="w-full mt-3 bg-white/5 hover:bg-white/8 border border-white/10 text-gray-400 hover:text-white font-semibold py-3 rounded-2xl text-center block transition-all text-sm">
                Continue Shopping
              </Link>
              <div className="mt-5 space-y-2">
                {['Secure PayPal checkout', 'Free returns within 30 days', 'Printful quality guarantee'].map(t => (
                  <div key={t} className="flex items-center gap-2 text-xs text-gray-700">
                    <div className="w-1 h-1 rounded-full bg-green-500 flex-shrink-0" />
                    {t}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
