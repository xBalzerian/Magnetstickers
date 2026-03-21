'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { ShoppingCart, Menu, X, Search, ChevronDown } from 'lucide-react'
import { getCartCount, getCart } from '@/lib/cart'

const CATEGORIES = [
  { href: '/shop/animals',       label: 'Animals',     sub: ['Dogs', 'Cats', 'Birds', 'Fish', 'Rabbits'] },
  { href: '/shop/wildlife',      label: 'Wildlife',    sub: ['Big Cats', 'Primates', 'Reptiles', 'Ocean'] },
  { href: '/shop/fruits',        label: 'Fruits',      sub: [] },
  { href: '/shop/vegetables',    label: 'Vegetables',  sub: [] },
  { href: '/shop/quotes',        label: 'Quotes',      sub: [] },
  { href: '/shop/food-drinks',   label: 'Food & Drinks', sub: [] },
]

export default function Header() {
  const [cartCount, setCartCount] = useState(0)
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQ, setSearchQ] = useState('')
  const [scrolled, setScrolled] = useState(false)
  const [announcementVisible, setAnnouncementVisible] = useState(true)

  useEffect(() => {
    const update = () => setCartCount(getCartCount(getCart()))
    update()
    window.addEventListener('cart-updated', update)
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll)
    return () => {
      window.removeEventListener('cart-updated', update)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (searchQ.trim()) {
      window.location.href = `/shop?q=${encodeURIComponent(searchQ.trim())}`
    }
  }

  return (
    <div className="sticky top-0 z-50">
      {/* Announcement bar */}
      {announcementVisible && (
        <div className="bg-gradient-to-r from-pink-600 to-purple-700 text-white text-xs font-semibold py-2 px-4 flex items-center justify-center gap-2 relative">
          <span>🌍 Free shipping on orders over $35 · Ships to 190+ countries · Die-cut precision on every magnet ✂️</span>
          <button onClick={() => setAnnouncementVisible(false)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white">
            <X size={14} />
          </button>
        </div>
      )}

      {/* Main header */}
      <header className={`bg-white transition-shadow ${scrolled ? 'shadow-lg' : 'border-b border-gray-100'}`}>
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0 group">
            <div className="w-9 h-9 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
              <span className="text-lg">🧲</span>
            </div>
            <div className="hidden sm:block">
              <span className="font-black text-gray-900 text-lg">Magnet</span>
              <span className="font-black text-pink-500 text-lg">Stickers</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            <Link href="/shop"
              className="px-3 py-2 text-sm font-bold text-pink-600 bg-pink-50 rounded-lg hover:bg-pink-100 transition-colors">
              All Magnets
            </Link>
            {CATEGORIES.slice(0, 5).map(cat => (
              <div key={cat.href} className="relative group">
                <Link href={cat.href}
                  className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 hover:text-pink-600 hover:bg-gray-50 rounded-lg transition-colors">
                  {cat.label}
                  {cat.sub.length > 0 && <ChevronDown size={13} className="opacity-50 group-hover:opacity-100" />}
                </Link>
                {cat.sub.length > 0 && (
                  <div className="absolute top-full left-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                    <div className="bg-white rounded-xl shadow-xl border border-gray-100 py-2 min-w-40">
                      {cat.sub.map(s => (
                        <Link key={s} href={`${cat.href}-${s.toLowerCase().replace(/\s+/g,'-')}`}
                          className="block px-4 py-2 text-sm text-gray-700 hover:text-pink-600 hover:bg-pink-50 transition-colors">
                          {s}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            {/* Search */}
            <form onSubmit={handleSearch}
              className={`${searchOpen ? 'flex' : 'hidden lg:flex'} items-center bg-gray-100 hover:bg-gray-200 rounded-full px-3 py-2 gap-2 transition-colors`}>
              <Search size={15} className="text-gray-400 shrink-0" />
              <input type="text" placeholder="Search magnets…" value={searchQ}
                onChange={e => setSearchQ(e.target.value)}
                className="bg-transparent text-sm outline-none w-32 xl:w-44 text-gray-700 placeholder-gray-400" />
            </form>
            <button onClick={() => setSearchOpen(!searchOpen)}
              className="lg:hidden p-2 text-gray-600 hover:text-pink-500 transition-colors">
              <Search size={20} />
            </button>

            {/* Cart */}
            <Link href="/cart"
              className="relative flex items-center gap-1.5 bg-gray-900 hover:bg-pink-600 text-white pl-3 pr-4 py-2 rounded-full transition-all font-semibold text-sm shadow-sm">
              <ShoppingCart size={16} />
              <span className="hidden sm:block">Cart</span>
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-pink-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-black border-2 border-white">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </Link>

            {/* Mobile hamburger */}
            <button onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden p-2 text-gray-600 hover:text-pink-500 transition-colors">
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-100 px-4 py-5 space-y-1 shadow-xl">
            <form onSubmit={handleSearch} className="flex items-center bg-gray-100 rounded-xl px-4 py-2.5 gap-2 mb-4">
              <Search size={16} className="text-gray-400" />
              <input type="text" placeholder="Search magnets…" value={searchQ}
                onChange={e => setSearchQ(e.target.value)}
                className="bg-transparent text-sm outline-none flex-1 text-gray-700" />
            </form>
            <Link href="/shop" onClick={() => setMenuOpen(false)}
              className="flex items-center px-3 py-2.5 text-sm font-bold text-pink-600 bg-pink-50 rounded-xl">
              ✨ All Magnets
            </Link>
            {CATEGORIES.map(cat => (
              <Link key={cat.href} href={cat.href} onClick={() => setMenuOpen(false)}
                className="flex items-center px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-xl transition-colors">
                {cat.label}
              </Link>
            ))}
          </div>
        )}
      </header>
    </div>
  )
}
