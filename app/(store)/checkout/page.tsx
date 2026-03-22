'use client'
import { useState, useEffect, Suspense } from 'react'
import { useRouter } from 'next/navigation'
import { getCart, clearCart, getCartTotal, type CartItem } from '@/lib/cart'
import Image from 'next/image'

interface ShippingForm {
  fullName: string; email: string; phone: string
  address1: string; address2: string; city: string
  state: string; zip: string; country: string
}
const EMPTY: ShippingForm = {
  fullName: '', email: '', phone: '',
  address1: '', address2: '', city: '',
  state: '', zip: '', country: 'US',
}

const SHIPPING_RATES = [
  { label: 'Standard Shipping (7–14 business days)', price_cents: 499 },
  { label: 'Express Shipping  (3–7 business days)',  price_cents: 899 },
]
const FREE_THRESHOLD = 4000   // $40.00

function PayPalButton({ cart, form, shippingCents, onSuccess }: {
  cart: CartItem[]; form: ShippingForm; shippingCents: number
  onSuccess: (id: string) => void
}) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID

  async function pay() {
    setLoading(true); setError('')
    try {
      const res = await fetch('/api/paypal/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cart, shipping: { ...form, shipping_cents: shippingCents } }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      const url = data.approveUrl ?? `https://www.paypal.com/checkoutnow?token=${data.orderId}`
      window.location.href = url
    } catch (e: any) { setError(e.message) }
    finally { setLoading(false) }
  }

  if (!clientId) return (
    <div className="rounded-2xl p-5 text-center border" style={{ background: '#FFFBEA', borderColor: '#E0C040' }}>
      <p className="font-semibold mb-1" style={{ color: '#9A6500' }}>Payment Setup In Progress</p>
      <p className="text-sm" style={{ color: '#9A6500', opacity: 0.7 }}>PayPal integration coming soon.</p>
    </div>
  )

  return (
    <div>
      {error && <div className="rounded-xl p-3 text-sm mb-4 bg-red-50 text-red-600">{error}</div>}
      <button onClick={pay} disabled={loading}
        className="w-full bg-[#0070ba] hover:bg-[#005ea6] disabled:opacity-60 text-white font-bold py-4 rounded-2xl transition-colors flex items-center justify-center gap-3 text-lg shadow-lg">
        {loading ? 'Connecting to PayPal…' : (
          <><span className="text-2xl font-light">Pay</span><span className="font-black">Pal</span> — Pay Securely</>
        )}
      </button>
      <p className="text-xs text-center mt-2" style={{ color: 'rgba(28,20,16,0.40)' }}>
        Pay with PayPal balance, credit card, or debit card
      </p>
    </div>
  )
}

export default function CheckoutPage() {
  const router = useRouter()
  const [cart, setCart] = useState<CartItem[]>([])
  const [form, setForm] = useState<ShippingForm>(EMPTY)
  const [step, setStep] = useState<'shipping' | 'payment'>('shipping')
  const [errors, setErrors] = useState<Partial<ShippingForm>>({})
  const [shippingIdx, setShippingIdx] = useState(0)

  useEffect(() => { setCart(getCart()) }, [])

  const subtotal     = getCartTotal(cart)
  const isFree       = subtotal >= FREE_THRESHOLD
  const shippingCost = isFree ? 0 : SHIPPING_RATES[shippingIdx].price_cents
  const total        = subtotal + shippingCost

  function validate() {
    const e: Partial<ShippingForm> = {}
    if (!form.fullName.trim())       e.fullName = 'Required'
    if (!form.email.includes('@'))   e.email    = 'Valid email required'
    if (!form.address1.trim())       e.address1 = 'Required'
    if (!form.city.trim())           e.city     = 'Required'
    if (!form.zip.trim())            e.zip      = 'Required'
    if (!form.country.trim())        e.country  = 'Required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function Field({ name, label, half }: { name: keyof ShippingForm; label: string; half?: boolean }) {
    return (
      <div className={half ? 'col-span-1' : 'col-span-2'}>
        <label className="block text-xs font-bold mb-1 uppercase tracking-wider"
          style={{ color: 'rgba(28,20,16,0.50)' }}>{label}</label>
        <input value={form[name]}
          onChange={e => setForm(p => ({ ...p, [name]: e.target.value }))}
          className="w-full rounded-xl px-4 py-3 text-sm outline-none border transition-colors"
          style={{ background: '#F5F0E8', borderColor: errors[name] ? '#C8341A' : '#DDD7CB', color: '#1C1410' }} />
        {errors[name] && <p className="text-xs mt-1" style={{ color: '#C8341A' }}>{errors[name]}</p>}
      </div>
    )
  }

  if (cart.length === 0) return (
    <div style={{ background: '#F5F0E8', color: '#1C1410', minHeight: '80vh' }}
      className="flex flex-col items-center justify-center py-24 px-4 text-center">
      <div className="text-6xl mb-4">🛒</div>
      <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
      <a href="/shop" className="font-semibold hover:underline" style={{ color: '#C8341A' }}>← Browse magnets</a>
    </div>
  )

  return (
    <div style={{ background: '#F5F0E8', color: '#1C1410', minHeight: '100vh' }}>
      <div className="max-w-5xl mx-auto px-4 py-10">

        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        {/* Step indicator */}
        <div className="flex items-center gap-3 mb-8">
          {(['shipping', 'payment'] as const).map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm text-white ${
                step === s ? 'bg-[#C8341A]'
                  : i === 0 && step === 'payment' ? 'bg-green-500'
                  : 'bg-[#DDD7CB]'
              }`}>{i === 0 && step === 'payment' ? '✓' : i + 1}</div>
              <span className={`text-sm font-medium capitalize ${step === s ? 'text-[#C8341A]' : 'text-[#1C1410]/40'}`}>{s}</span>
              {i < 1 && <div className="w-8 h-px bg-[#DDD7CB]" />}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* FORM COLUMN */}
          <div className="lg:col-span-2 space-y-6">

            {step === 'shipping' && (
              <div className="rounded-2xl border p-6" style={{ background: '#FBF8F3', borderColor: '#E5DFD5' }}>
                <h2 className="text-lg font-bold mb-5">Shipping Address</h2>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <Field name="fullName"  label="Full Name" />
                  <Field name="email"     label="Email Address" />
                  <Field name="phone"     label="Phone (optional)" />
                  <Field name="address1"  label="Address Line 1" />
                  <Field name="address2"  label="Address Line 2 (apt, unit…)" />
                  <Field name="city"      label="City" half />
                  <Field name="state"     label="State / Province" half />
                  <Field name="zip"       label="Postal / ZIP Code" half />
                  <div className="col-span-1">
                    <label className="block text-xs font-bold mb-1 uppercase tracking-wider"
                      style={{ color: 'rgba(28,20,16,0.50)' }}>Country</label>
                    <select value={form.country}
                      onChange={e => setForm(p => ({ ...p, country: e.target.value }))}
                      className="w-full rounded-xl px-4 py-3 text-sm border outline-none"
                      style={{ background: '#F5F0E8', borderColor: '#DDD7CB', color: '#1C1410' }}>
                      {['US','CA','GB','AU','PH','SG','MY','NZ','DE','FR','JP','KR','BR','MX','IN'].map(c => (
                        <option key={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Shipping method */}
                <h2 className="text-lg font-bold mb-4">Shipping Method</h2>

                {isFree ? (
                  <div className="rounded-2xl border-2 p-4 flex items-center gap-3 mb-3"
                    style={{ borderColor: '#C8341A', background: '#FFF5F0' }}>
                    <div className="w-5 h-5 rounded-full flex items-center justify-center text-white text-xs flex-shrink-0"
                      style={{ background: '#C8341A' }}>✓</div>
                    <div className="flex-1">
                      <p className="font-bold text-sm">🎉 Free Shipping Unlocked!</p>
                      <p className="text-xs" style={{ color: 'rgba(28,20,16,0.50)' }}>Standard delivery · 7–14 business days</p>
                    </div>
                    <span className="font-black text-green-600 text-sm">FREE</span>
                  </div>
                ) : (
                  <div className="space-y-3 mb-4">
                    {SHIPPING_RATES.map((rate, idx) => (
                      <label key={idx}
                        className={`flex items-center gap-3 rounded-2xl border-2 p-4 cursor-pointer transition-all ${
                          shippingIdx === idx ? 'border-[#C8341A]' : 'border-[#E5DFD5]'
                        }`}
                        style={{ background: shippingIdx === idx ? '#FFF5F0' : '#FBF8F3' }}>
                        <input type="radio" name="ship" checked={shippingIdx === idx}
                          onChange={() => setShippingIdx(idx)} className="hidden" />
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                          shippingIdx === idx ? 'border-[#C8341A]' : 'border-[#DDD7CB]'
                        }`}>
                          {shippingIdx === idx && <div className="w-2.5 h-2.5 rounded-full bg-[#C8341A]" />}
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-sm">{rate.label}</p>
                          <p className="text-xs" style={{ color: 'rgba(28,20,16,0.45)' }}>Fulfilled by Printful</p>
                        </div>
                        <span className="font-black text-sm" style={{ color: '#C8341A' }}>
                          ${(rate.price_cents / 100).toFixed(2)}
                        </span>
                      </label>
                    ))}
                    <p className="text-xs text-center py-1" style={{ color: 'rgba(28,20,16,0.40)' }}>
                      Add <strong style={{ color: '#C8341A' }}>${((FREE_THRESHOLD - subtotal) / 100).toFixed(2)}</strong> more to unlock <strong>FREE shipping!</strong>
                    </p>
                  </div>
                )}

                <button onClick={() => { if (validate()) setStep('payment') }}
                  className="mt-2 w-full text-white font-bold py-4 rounded-2xl transition-all hover:opacity-90 shadow-md"
                  style={{ background: 'linear-gradient(135deg, #C8341A, #E85A20)' }}>
                  Continue to Payment →
                </button>
              </div>
            )}

            {step === 'payment' && (
              <div className="rounded-2xl border p-6" style={{ background: '#FBF8F3', borderColor: '#E5DFD5' }}>
                <h2 className="text-lg font-bold mb-2">Shipping Summary</h2>
                <p className="text-sm mb-5" style={{ color: 'rgba(28,20,16,0.50)' }}>
                  {form.address1}, {form.city}, {form.state} {form.zip}, {form.country}
                </p>
                <h2 className="text-lg font-bold mb-4">Payment</h2>
                <Suspense fallback={<div className="h-16 rounded-2xl animate-pulse" style={{ background: '#EDE8DE' }} />}>
                  <PayPalButton cart={cart} form={form} shippingCents={shippingCost}
                    onSuccess={id => { clearCart(); router.push(`/order-confirmation?order_id=${id}`) }} />
                </Suspense>
                <button onClick={() => setStep('shipping')}
                  className="mt-4 text-sm block mx-auto hover:underline transition-colors"
                  style={{ color: 'rgba(28,20,16,0.40)' }}>
                  ← Back to Shipping
                </button>
              </div>
            )}
          </div>

          {/* ORDER SUMMARY */}
          <div className="rounded-2xl border p-5 sticky top-24 self-start"
            style={{ background: '#FBF8F3', borderColor: '#E5DFD5' }}>
            <h2 className="font-bold text-base mb-4">Order Summary</h2>
            <div className="space-y-3 mb-4">
              {cart.map(item => (
                <div key={`${item.id}-${item.size}`} className="flex gap-3 items-start">
                  {item.image && (
                    <div className="relative w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 border"
                      style={{ borderColor: '#E5DFD5', background: '#EDE8DE' }}>
                      <Image src={item.image} alt={item.name} fill className="object-contain p-1" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold truncate" style={{ color: '#1C1410' }}>{item.name}</p>
                    <p className="text-[10px]" style={{ color: 'rgba(28,20,16,0.45)' }}>
                      {item.size} · Qty {item.quantity}
                    </p>
                  </div>
                  <p className="text-sm font-bold flex-shrink-0" style={{ color: '#C8341A' }}>
                    ${((item.price_cents * item.quantity) / 100).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 space-y-2" style={{ borderColor: '#E5DFD5' }}>
              <div className="flex justify-between text-sm" style={{ color: 'rgba(28,20,16,0.50)' }}>
                <span>Subtotal</span>
                <span>${(subtotal / 100).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span style={{ color: 'rgba(28,20,16,0.50)' }}>Shipping</span>
                <span className={isFree ? 'text-green-600 font-bold' : ''} style={isFree ? {} : { color: 'rgba(28,20,16,0.50)' }}>
                  {isFree ? 'FREE 🎉' : `$${(shippingCost / 100).toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between font-extrabold text-lg border-t pt-3" style={{ borderColor: '#E5DFD5' }}>
                <span>Total</span>
                <span style={{ color: '#C8341A' }}>${(total / 100).toFixed(2)}</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
