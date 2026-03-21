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

const EMPTY_FORM: ShippingForm = {
  fullName: '', email: '', phone: '',
  address1: '', address2: '', city: '',
  state: '', zip: '', country: 'US',
}

function PayPalSection({ cart, form, onSuccess }: { 
  cart: CartItem[]
  form: ShippingForm
  onSuccess: (orderId: string) => void 
}) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID

  async function handlePayPal() {
    setLoading(true); setError('')
    try {
      const res = await fetch('/api/paypal/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cart, shipping: form }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      // Redirect to PayPal hosted page
      const approveLink = data.approveUrl
      if (approveLink) {
        window.location.href = approveLink
      } else if (data.orderId) {
        // Use SDK approach - open PayPal popup/redirect
        window.location.href = `https://www.${clientId?.startsWith('test') ? 'sandbox.' : ''}paypal.com/checkoutnow?token=${data.orderId}`
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (!clientId) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-5 text-center">
        <p className="text-yellow-800 font-semibold mb-1">Payment Setup In Progress</p>
        <p className="text-yellow-700 text-sm">PayPal integration coming soon. Your order details are saved.</p>
      </div>
    )
  }

  return (
    <div>
      {error && <div className="bg-red-50 text-red-600 rounded-xl p-3 text-sm mb-4">{error}</div>}
      <button onClick={handlePayPal} disabled={loading}
        className="w-full bg-[#0070ba] hover:bg-[#005ea6] disabled:opacity-60 text-white font-bold py-4 rounded-2xl transition-colors flex items-center justify-center gap-3 text-lg shadow-lg">
        {loading ? 'Connecting to PayPal…' : (
          <><span className="text-2xl font-light">Pay</span><span className="font-black">Pal</span> — Pay Securely</>
        )}
      </button>
      <p className="text-xs text-gray-400 text-center mt-2">You can also pay with credit/debit card through PayPal</p>
    </div>
  )
}

export default function CheckoutPage() {
  const router = useRouter()
  const [cart, setCart] = useState<CartItem[]>([])
  const [form, setForm] = useState<ShippingForm>(EMPTY_FORM)
  const [step, setStep] = useState<'shipping' | 'payment'>('shipping')
  const [errors, setErrors] = useState<Partial<ShippingForm>>({})

  useEffect(() => { setCart(getCart()) }, [])
  const total = getCartTotal(cart)

  function validateShipping() {
    const e: Partial<ShippingForm> = {}
    if (!form.fullName.trim()) e.fullName = 'Required'
    if (!form.email.includes('@')) e.email = 'Valid email required'
    if (!form.address1.trim()) e.address1 = 'Required'
    if (!form.city.trim()) e.city = 'Required'
    if (!form.zip.trim()) e.zip = 'Required'
    if (!form.country.trim()) e.country = 'Required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  if (cart.length === 0) return (
    <div className="max-w-xl mx-auto px-4 py-24 text-center">
      <div className="text-6xl mb-4">🛒</div>
      <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
      <a href="/shop" className="text-pink-500 font-semibold hover:underline">← Browse magnets</a>
    </div>
  )

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="flex items-center gap-4 mb-8">
        {(['shipping', 'payment'] as const).map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
              step === s ? 'bg-pink-500 text-white' : i === 0 && step === 'payment' ? 'bg-green-400 text-white' : 'bg-gray-100 text-gray-400'
            }`}>{i === 0 && step === 'payment' ? '✓' : i + 1}</div>
            <span className={`text-sm font-medium capitalize ${step === s ? 'text-pink-600' : 'text-gray-400'}`}>{s}</span>
            {i < 1 && <div className="w-8 h-px bg-gray-200" />}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {step === 'shipping' && (
            <div className="bg-white border border-gray-100 rounded-2xl p-6">
              <h2 className="font-bold text-xl mb-6">Shipping Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {([
                  ['fullName', 'Full Name', 'text', 'sm:col-span-2'],
                  ['email', 'Email Address', 'email', 'sm:col-span-2'],
                  ['phone', 'Phone (optional)', 'tel', 'sm:col-span-2'],
                  ['address1', 'Address Line 1', 'text', 'sm:col-span-2'],
                  ['address2', 'Address Line 2 (optional)', 'text', 'sm:col-span-2'],
                  ['city', 'City', 'text', ''],
                  ['state', 'State / Province', 'text', ''],
                  ['zip', 'ZIP / Postal Code', 'text', ''],
                  ['country', 'Country (e.g. US, PH, GB)', 'text', ''],
                ] as [keyof ShippingForm, string, string, string][]).map(([field, label, type, cls]) => (
                  <div key={field} className={cls}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                    <input type={type} value={form[field]} onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))}
                      className={`w-full border rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-pink-300 transition-shadow ${errors[field] ? 'border-red-400 bg-red-50' : 'border-gray-200'}`} />
                    {errors[field] && <p className="text-red-500 text-xs mt-1">{errors[field]}</p>}
                  </div>
                ))}
              </div>
              <button onClick={() => { if (validateShipping()) setStep('payment') }}
                className="mt-6 w-full bg-pink-500 hover:bg-pink-600 text-white font-bold py-4 rounded-2xl transition-colors shadow-md">
                Continue to Payment →
              </button>
            </div>
          )}

          {step === 'payment' && (
            <div className="bg-white border border-gray-100 rounded-2xl p-6">
              <h2 className="font-bold text-xl mb-2">Payment</h2>
              <p className="text-sm text-gray-500 mb-6">
                Shipping to: <strong>{form.fullName}</strong>, {form.city}, {form.country}
              </p>
              <Suspense fallback={<div className="h-16 bg-gray-100 animate-pulse rounded-2xl" />}>
                <PayPalSection cart={cart} form={form}
                  onSuccess={(id) => { clearCart(); router.push(`/order-confirmation?id=${id}`) }} />
              </Suspense>
              <button onClick={() => setStep('shipping')}
                className="mt-4 text-sm text-gray-400 hover:text-pink-500 block mx-auto transition-colors">
                ← Edit shipping info
              </button>
            </div>
          )}
        </div>

        <div>
          <div className="bg-gray-50 rounded-2xl p-5 sticky top-24">
            <h2 className="font-bold mb-4">Order Summary</h2>
            <div className="space-y-3 mb-4">
              {cart.map(item => (
                <div key={item.id} className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white rounded-lg border border-gray-100 overflow-hidden shrink-0">
                    {item.image
                      ? <Image src={item.image} alt={item.name} width={48} height={48} className="w-full h-full object-contain p-1" />
                      : <div className="w-full h-full flex items-center justify-center text-xl">🧲</div>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate">{item.name}</p>
                    <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-sm font-semibold shrink-0">${((item.priceCents * item.quantity) / 100).toFixed(2)}</p>
                </div>
              ))}
            </div>
            <div className="border-t pt-4">
              <div className="flex justify-between text-sm text-gray-500 mb-2">
                <span>Subtotal</span><span>${(total / 100).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-500 mb-3">
                <span>Shipping</span><span className="text-green-600">Calculated by PayPal</span>
              </div>
              <div className="flex justify-between font-extrabold text-lg border-t pt-3">
                <span>Total</span>
                <span className="text-pink-600">${(total / 100).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
