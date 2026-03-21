'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js'
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

export default function CheckoutPage() {
  const router = useRouter()
  const [cart, setCart] = useState<CartItem[]>([])
  const [form, setForm] = useState<ShippingForm>(EMPTY_FORM)
  const [step, setStep] = useState<'shipping' | 'payment'>('shipping')
  const [errors, setErrors] = useState<Partial<ShippingForm>>({})
  const [processing, setProcessing] = useState(false)

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

  async function createPayPalOrder() {
    const res = await fetch('/api/paypal/create-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cart, shipping: form }),
    })
    const data = await res.json()
    return data.orderId
  }

  async function onPayPalApprove(data: { orderID: string }) {
    setProcessing(true)
    try {
      const res = await fetch('/api/paypal/capture-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: data.orderID, cart, shipping: form }),
      })
      const result = await res.json()
      if (result.success) {
        clearCart()
        router.push(`/order-confirmation?id=${result.dbOrderId}`)
      }
    } finally {
      setProcessing(false)
    }
  }

  if (cart.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center">
        <div className="text-6xl mb-4">🛒</div>
        <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
        <a href="/shop" className="text-pink-500 font-semibold hover:underline">← Back to shop</a>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      {/* Steps indicator */}
      <div className="flex items-center gap-3 mb-8">
        {(['shipping', 'payment'] as const).map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step === s || (i === 1 && step === 'payment') ? 'bg-pink-500 text-white' : 'bg-gray-100 text-gray-400'}`}>{i + 1}</div>
            <span className={`text-sm font-medium capitalize ${step === s ? 'text-pink-600' : 'text-gray-400'}`}>{s}</span>
            {i < 1 && <div className="w-8 h-px bg-gray-200 mx-1" />}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-2">
          {step === 'shipping' && (
            <div className="bg-white border border-gray-100 rounded-2xl p-6">
              <h2 className="font-bold text-xl mb-6">Shipping Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {([
                  ['fullName', 'Full Name', 'text', 'col-span-2'],
                  ['email', 'Email Address', 'email', 'col-span-2'],
                  ['phone', 'Phone (optional)', 'tel', 'col-span-2'],
                  ['address1', 'Address Line 1', 'text', 'col-span-2'],
                  ['address2', 'Address Line 2 (optional)', 'text', 'col-span-2'],
                  ['city', 'City', 'text', ''],
                  ['state', 'State / Province', 'text', ''],
                  ['zip', 'ZIP / Postal Code', 'text', ''],
                  ['country', 'Country Code (e.g. US, PH)', 'text', ''],
                ] as [keyof ShippingForm, string, string, string][]).map(([field, label, type, span]) => (
                  <div key={field} className={span || ''}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                    <input
                      type={type}
                      value={form[field]}
                      onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))}
                      className={`w-full border rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-pink-300 ${errors[field] ? 'border-red-400' : 'border-gray-200'}`}
                    />
                    {errors[field] && <p className="text-red-500 text-xs mt-1">{errors[field]}</p>}
                  </div>
                ))}
              </div>
              <button
                onClick={() => { if (validateShipping()) setStep('payment') }}
                className="mt-6 w-full bg-pink-500 hover:bg-pink-600 text-white font-bold py-4 rounded-2xl transition-colors"
              >
                Continue to Payment →
              </button>
            </div>
          )}

          {step === 'payment' && (
            <div className="bg-white border border-gray-100 rounded-2xl p-6">
              <h2 className="font-bold text-xl mb-2">Payment</h2>
              <p className="text-sm text-gray-500 mb-6">Pay securely via PayPal. You can also pay with a credit or debit card.</p>

              {processing && (
                <div className="text-center py-8 text-gray-500">
                  <div className="animate-spin text-3xl mb-3">⏳</div>
                  <p>Processing your order…</p>
                </div>
              )}

              {!processing && (
                <PayPalScriptProvider options={{ clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!, currency: 'USD' }}>
                  <PayPalButtons
                    style={{ layout: 'vertical', color: 'gold', shape: 'rect', label: 'pay' }}
                    createOrder={createPayPalOrder}
                    onApprove={onPayPalApprove}
                    onError={(err) => { console.error('PayPal error', err); alert('Payment failed. Please try again.') }}
                  />
                </PayPalScriptProvider>
              )}

              <button onClick={() => setStep('shipping')} className="mt-4 text-sm text-gray-500 hover:text-pink-500 block mx-auto">
                ← Edit shipping
              </button>
            </div>
          )}
        </div>

        {/* Order summary */}
        <div>
          <div className="bg-gray-50 rounded-2xl p-5 sticky top-24">
            <h2 className="font-bold mb-4">Your Order</h2>
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
                    <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-sm font-semibold shrink-0">${((item.priceCents * item.quantity) / 100).toFixed(2)}</p>
                </div>
              ))}
            </div>
            <div className="border-t pt-4 flex justify-between font-extrabold text-lg">
              <span>Total</span>
              <span className="text-pink-600">${(total / 100).toFixed(2)}</span>
            </div>
            <p className="text-xs text-gray-400 mt-2 text-center">+ shipping calculated at payment</p>
          </div>
        </div>
      </div>
    </div>
  )
}
