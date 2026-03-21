export interface CartItem {
  id: string
  productId: string
  name: string
  slug: string
  image: string | null
  priceCents: number
  printfulVariantId: number | null
  quantity: number
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

export function addToCart(item: Omit<CartItem, 'id' | 'quantity'>) {
  const cart = getCart()
  const existing = cart.find(i => i.productId === item.productId)
  if (existing) { existing.quantity++; saveCart(cart) }
  else saveCart([...cart, { ...item, id: crypto.randomUUID(), quantity: 1 }])
}

export function removeFromCart(id: string) { saveCart(getCart().filter(i => i.id !== id)) }

export function updateQuantity(id: string, qty: number) {
  if (qty <= 0) return removeFromCart(id)
  saveCart(getCart().map(i => i.id === id ? { ...i, quantity: qty } : i))
}

export function clearCart() { saveCart([]) }
export function getCartTotal(cart: CartItem[]) { return cart.reduce((s, i) => s + i.priceCents * i.quantity, 0) }
export function getCartCount(cart: CartItem[]) { return cart.reduce((s, i) => s + i.quantity, 0) }
