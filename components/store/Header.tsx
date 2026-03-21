'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { ShoppingCart, Menu, X, Search } from 'lucide-react'
import { getCartCount, getCart } from '@/lib/cart'

export default function Header() {
  const [cartCount, setCartCount] = useState(0)
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQ, setSearchQ] = useState('')

  useEffect(() => {
    const update = () => setCartCount(getCartCount(getCart()))
    update()
    window.addEventListener('cart-updated', update)
    return () => window.removeEventListener('cart-updated', update)
  }, [])

  const navLinks = [
    { href: '/shop', label: 'All Magnets' },
    { href: '/shop/animals', label: '🐾 Animals' },
    { href: '/shop/fruits', label: '🍎 Fruits' },
    { href: '/shop/wildlife', label: '🦁 Wildlife' },
    { href: '/shop/quotes', label: '💬 Quotes' },
  ]

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-extrabold text-xl text-gray-900 shrink-0">
          <span className="text-2xl">🧲</span>
          <span className="hidden sm:block">Magnet<span className="text-pink-500">Stickers</span></span>
        </Link>

        {/* Nav — desktop */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map(l => (
            <Link key={l.href} href={l.href} className="text-sm font-medium text-gray-600 hover:text-pink-500 transition-colors">
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-3">
          {/* Search bar */}
          <div className={`${searchOpen ? 'flex' : 'hidden'} md:flex items-center bg-gray-100 rounded-full px-3 py-1.5 gap-2`}>
            <Search size={15} className="text-gray-400" />
            <input
              type="text"
              placeholder="Search magnets…"
              value={searchQ}
              onChange={e => setSearchQ(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && searchQ) window.location.href = `/shop?q=${encodeURIComponent(searchQ)}` }}
              className="bg-transparent text-sm outline-none w-36 text-gray-700 placeholder-gray-400"
            />
          </div>
          <button onClick={() => setSearchOpen(!searchOpen)} className="md:hidden p-2 text-gray-600 hover:text-pink-500">
            <Search size={20} />
          </button>

          {/* Cart */}
          <Link href="/cart" className="relative p-2 text-gray-700 hover:text-pink-500 transition-colors">
            <ShoppingCart size={22} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                {cartCount > 9 ? '9+' : cartCount}
              </span>
            )}
          </Link>

          {/* Mobile menu toggle */}
          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 text-gray-600">
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-3">
          {navLinks.map(l => (
            <Link key={l.href} href={l.href} onClick={() => setMenuOpen(false)}
              className="block text-base font-medium text-gray-700 hover:text-pink-500 py-1">
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  )
}
