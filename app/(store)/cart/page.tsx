'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { getCart, saveCart, updateQuantity, removeFromCart, getCartTotal, applyBogo, type CartItem } from '@/lib/cart'

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const load = () => setCart(getCart())
    load()
    window.addEventListener('cart-updated', load)
    return () => window.removeEventListener('cart-updated', load)
  }, [])

  if (!mounted) return <div className="min-h-screen" style={{ background: '#F5F0E8' }} />

  const subtotal = getCartTotal(cart)
  const totalQty = cart.reduce((s, i) => s + i.quantity, 0)
  const { discount } = applyBogo(cart)
  const afterDiscount = subtotal - discount
  const shipping = afterDiscount >= 35 ? 0 : 4.95
  const orderTotal = afterDiscount + shipping

  return (
    <div style={{ background: '#F5F0E8', color: '#1C1410', minHeight: '100vh' }}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">

        <h1 className="text-2xl sm:text-3xl font-black mb-8">Your Cart</h1>

        {cart.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">🛒</p>
            <h2 className="font-black text-xl mb-2">Your cart is empty</h2>
            <p className="opacity-40 text-sm mb-6">Add some magnets to get started!</p>
            <Link href="/shop" className="inline-flex font-bold py-3 px-8 rounded-xl text-sm text-white transition-all hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, #C8341A, #E85A20)' }}>
              Shop All Magnets
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Cart items */}
            <div className="lg:col-span-2 space-y-3">

              {/* BOGO banner */}
              {totalQty >= 4 && discount > 0 ? (
                <div className="rounded-2xl p-4 border flex items-center gap-3 mb-4" style={{ background: '#FFF8F0', borderColor: '#F0C090' }}>
                  <div className="text-2xl">🎉</div>
                  <div>
                    <p className="font-black text-sm" style={{ color: '#C8341A' }}>Buy 3 Get 1 Free — Applied!</p>
                    <p className="text-xs opacity-50">You saved ${discount.toFixed(2)} on your cheapest item{Math.floor(totalQty/4) > 1 ? 's' : ''}</p>
                  </div>
                </div>
              ) : totalQty < 4 ? (
                <div className="rounded-2xl p-4 border mb-4" style={{ background: '#EDE8DE', borderColor: '#DDD7CB' }}>
                  <p className="text-sm font-bold" style={{ color: '#C8341A' }}>
                    Add {4 - totalQty} more magnet{4 - totalQty !== 1 ? 's' : ''} to get 1 FREE! 🎁
                  </p>
                  <Link href="/shop" className="text-xs opacity-50 hover:opacity-80 transition-opacity">Browse more →</Link>
                </div>
              ) : null}

              {cart.map(item => (
                <div key={item.id} className="flex gap-4 p-4 rounded-2xl border"
                  style={{ background: '#FBF8F3', borderColor: '#E5DFD5' }}>
                  <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 border"
                    style={{ background: 'linear-gradient(135deg, #EDE8DE, #E5DFD5)', borderColor: '#DDD7CB' }}>
                    {item.image && (
                      <Image src={item.image} alt={item.name} width={80} height={80}
                        className="object-contain p-1.5 w-full h-full" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-sm leading-snug mb-0.5 truncate">{item.name}</h3>
                    {item.size && (
                      <p className="text-xs opacity-40 mb-2">{item.size} ({item.sizeDims})</p>
                    )}
                    <div className="flex items-center gap-3">
                      <div className="flex items-center border rounded-lg overflow-hidden" style={{ borderColor: '#DDD7CB' }}>
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-2.5 py-1.5 text-sm font-bold hover:opacity-60 transition-opacity">−</button>
                        <span className="px-2 text-sm font-black" style={{ minWidth: '1.5rem', textAlign: 'center' }}>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-2.5 py-1.5 text-sm font-bold hover:opacity-60 transition-opacity">+</button>
                      </div>
                      <button onClick={() => removeFromCart(item.id)}
                        className="text-xs opacity-30 hover:opacity-60 transition-opacity">Remove</button>
                    </div>
                  </div>
                  <div className="flex flex-col items-end justify-between shrink-0">
                    <p className="font-black text-sm" style={{ color: '#C8341A' }}>
                      ${((item.price ?? item.priceCents / 100) * item.quantity).toFixed(2)}
                    </p>
                    <p className="text-[10px] opacity-30">${(item.price ?? item.priceCents / 100).toFixed(2)} each</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Order summary */}
            <div>
              <div className="rounded-2xl p-6 border sticky top-20" style={{ background: '#FBF8F3', borderColor: '#E5DFD5' }}>
                <h2 className="font-black text-base mb-5">Order Summary</h2>
                <div className="space-y-3 text-sm mb-5">
                  <div className="flex justify-between">
                    <span className="opacity-50">Subtotal ({totalQty} item{totalQty !== 1 ? 's' : ''})</span>
                    <span className="font-semibold">${subtotal.toFixed(2)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between" style={{ color: '#C8341A' }}>
                      <span className="font-bold">Buy 3 Get 1 Free</span>
                      <span className="font-black">−${discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="opacity-50">Shipping</span>
                    <span className="font-semibold">{shipping === 0 ? <span style={{ color: '#2E8B57' }}>FREE</span> : `$${shipping.toFixed(2)}`}</span>
                  </div>
                  {shipping > 0 && (
                    <p className="text-[10px] opacity-35">Add ${(35 - afterDiscount).toFixed(2)} more for free shipping</p>
                  )}
                  <div className="border-t pt-3 flex justify-between font-black text-base" style={{ borderColor: '#DDD7CB' }}>
                    <span>Total</span>
                    <span style={{ color: '#C8341A' }}>${orderTotal.toFixed(2)}</span>
                  </div>
                </div>
                <Link href="/checkout"
                  className="w-full flex items-center justify-center font-black py-4 rounded-xl text-white transition-all hover:opacity-90 shadow-md"
                  style={{ background: 'linear-gradient(135deg, #C8341A, #E85A20)', boxShadow: '0 4px 16px rgba(200,52,26,0.3)' }}>
                  Checkout →
                </Link>
                <Link href="/shop" className="block text-center text-xs opacity-35 hover:opacity-60 mt-3 transition-opacity">
                  Continue shopping
                </Link>
                <div className="mt-4 pt-4 border-t space-y-1.5" style={{ borderColor: '#DDD7CB' }}>
                  {['Premium production guarantee','Secure checkout','Ships in 3-7 business days','30-day returns'].map(t => (
                    <div key={t} className="flex items-center gap-2 text-[10px] opacity-30">
                      <div className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: '#C8341A' }} />
                      {t}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
