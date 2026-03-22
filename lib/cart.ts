export interface CartItem {
  id: string
  productId: string
  name: string
  slug: string
  image: string | null
  price: number          // dollars (e.g. 11.99)
  priceCents: number     // cents (e.g. 1199) — kept for back-compat
  quantity: number
  size?: string          // e.g. 'Medium'
  sizeDims?: string      // e.g. '4″ × 4″'
  printfulVariantId?: number | null
}

const CART_KEY = 'ms_cart'

export function getCart(): CartItem[] {
  if (typeof window === 'undefined') return []
  try { return JSON.parse(localStorage.getItem(CART_KEY) ?? '[]') }
  catch { return [] }
}

export function saveCart(items: CartItem[]) {
  localStorage.setItem(CART_KEY, JSON.stringify(items))
  window.dispatchEvent(new Event('cart-updated'))
}

export function addToCart(item: Omit<CartItem, 'id'>) {
  const cart = getCart()
  // Match by productId + size
  const existing = cart.find(i => i.productId === item.productId && i.size === item.size)
  if (existing) {
    existing.quantity += item.quantity ?? 1
    saveCart(cart)
  } else {
    saveCart([...cart, {
      ...item,
      id: crypto.randomUUID(),
      priceCents: Math.round((item.price ?? 0) * 100),
    }])
  }
}

// Apply Buy 3 + 1 Free discount
export function applyBogo(cart: CartItem[]): { items: CartItem[]; discount: number } {
  const total = cart.reduce((s, i) => s + i.quantity, 0)
  if (total < 4) return { items: cart, discount: 0 }
  // Find cheapest unit price
  const allPrices: number[] = []
  cart.forEach(i => { for (let q = 0; q < i.quantity; q++) allPrices.push(i.price) })
  allPrices.sort((a, b) => a - b)
  const freePcs = Math.floor(total / 4)
  const discount = allPrices.slice(0, freePcs).reduce((s, p) => s + p, 0)
  return { items: cart, discount }
}

export function removeFromCart(id: string) { saveCart(getCart().filter(i => i.id !== id)) }

export function updateQuantity(id: string, qty: number) {
  if (qty <= 0) return removeFromCart(id)
  saveCart(getCart().map(i => i.id === id ? { ...i, quantity: qty } : i))
}

export function clearCart() { saveCart([]) }
export function getCartTotal(cart: CartItem[]) {
  return cart.reduce((s, i) => s + (i.price ?? i.priceCents / 100) * i.quantity, 0)
}
export function getCartCount(cart: CartItem[]) { return cart.reduce((s, i) => s + i.quantity, 0) }
