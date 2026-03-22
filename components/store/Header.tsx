'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { ShoppingBag, Menu, X, Search, ChevronDown } from 'lucide-react'
import { getCartCount, getCart } from '@/lib/cart'

const NAV = [
  { href: '/shop/animals',     label: 'Animals',     sub: [['Dogs','/shop/animals-dogs'],['Cats','/shop/animals-cats'],['Birds','/shop/animals-birds'],['Rabbits','/shop/animals-rabbits']] },
  { href: '/shop/wildlife',    label: 'Wildlife',    sub: [['Big Cats','/shop/wildlife-big-cats'],['Ocean','/shop/wildlife-ocean'],['Reptiles','/shop/wildlife-reptiles']] },
  { href: '/shop/fruits',      label: 'Fruits',      sub: [] },
  { href: '/shop/vegetables',  label: 'Vegetables',  sub: [] },
  { href: '/shop/quotes',      label: 'Quotes',      sub: [] },
]

export default function Header() {
  const [cartCount, setCartCount] = useState(0)
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQ, setSearchQ] = useState('')
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const update = () => setCartCount(getCartCount(getCart()))
    update()
    window.addEventListener('cart-updated', update)
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => {
      window.removeEventListener('cart-updated', update)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (searchQ.trim()) window.location.href = `/shop?q=${encodeURIComponent(searchQ.trim())}`
  }

  return (
    <div className="sticky top-0 z-50">
      {/* Announcement bar */}
      <div className="bg-white/5 backdrop-blur-sm border-b border-white/5 text-center py-2 px-4">
        <p className="text-xs text-white/50 tracking-widest uppercase font-medium">
          Free shipping on orders over $35 &nbsp;·&nbsp; Ships to 190+ countries &nbsp;·&nbsp; Die-cut precision on every magnet
        </p>
      </div>

      {/* Main nav */}
      <header className={`transition-all duration-300 ${
        scrolled
          ? 'bg-black/90 backdrop-blur-xl border-b border-white/8 shadow-2xl shadow-black/50'
          : 'bg-black/60 backdrop-blur-md border-b border-white/5'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-6">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 shrink-0 group">
            <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg shadow-lg shadow-pink-500/20 group-hover:shadow-pink-500/40 transition-shadow" />
            <span className="font-black text-white text-lg tracking-tight hidden sm:block">
              Magnet<span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">Stickers</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            <Link href="/shop"
              className="px-4 py-2 text-sm font-bold text-white bg-white/8 hover:bg-white/12 rounded-lg transition-colors tracking-wide">
              All
            </Link>
            {NAV.map(cat => (
              <div key={cat.href} className="relative group">
                <Link href={cat.href}
                  className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                  {cat.label}
                  {cat.sub.length > 0 && <ChevronDown size={12} className="opacity-40 group-hover:opacity-80 transition-opacity" />}
                </Link>
                {cat.sub.length > 0 && (
                  <div className="absolute top-full left-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150">
                    <div className="bg-gray-950 border border-white/10 rounded-2xl shadow-2xl shadow-black/80 py-2 min-w-44 overflow-hidden">
                      {cat.sub.map(([label, href]) => (
                        <Link key={href} href={href}
                          className="block px-4 py-2.5 text-sm text-white/60 hover:text-white hover:bg-white/5 transition-colors">
                          {label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Right */}
          <div className="flex items-center gap-2">
            {/* Search desktop */}
            <form onSubmit={handleSearch}
              className="hidden lg:flex items-center bg-white/5 hover:bg-white/8 border border-white/10 rounded-xl px-3 py-2 gap-2 transition-colors focus-within:border-pink-500/40">
              <Search size={14} className="text-white/30 shrink-0" />
              <input type="text" placeholder="Search designs…" value={searchQ}
                onChange={e => setSearchQ(e.target.value)}
                className="bg-transparent text-sm outline-none w-36 xl:w-48 text-white placeholder-white/25" />
            </form>

            {/* Search mobile */}
            <button onClick={() => setSearchOpen(!searchOpen)}
              className="lg:hidden p-2 text-white/50 hover:text-white transition-colors">
              <Search size={18} />
            </button>

            {/* Cart */}
            <Link href="/cart"
              className="relative flex items-center gap-2 bg-white/8 hover:bg-white/12 border border-white/10 hover:border-white/20 text-white pl-3 pr-4 py-2 rounded-xl transition-all text-sm font-semibold group">
              <ShoppingBag size={15} className="group-hover:text-pink-400 transition-colors" />
              <span className="hidden sm:block">Cart</span>
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-pink-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-black border-2 border-black shadow-lg shadow-pink-500/30">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </Link>

            {/* Mobile menu btn */}
            <button onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden p-2 text-white/50 hover:text-white transition-colors">
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile search */}
        {searchOpen && (
          <div className="lg:hidden px-4 pb-3 border-t border-white/5">
            <form onSubmit={handleSearch} className="flex items-center bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 gap-2 mt-3">
              <Search size={15} className="text-white/30" />
              <input type="text" placeholder="Search designs…" value={searchQ} autoFocus
                onChange={e => setSearchQ(e.target.value)}
                className="bg-transparent text-sm outline-none flex-1 text-white placeholder-white/25" />
            </form>
          </div>
        )}

        {/* Mobile menu */}
        {menuOpen && (
          <div className="lg:hidden bg-black border-t border-white/5 px-4 py-4 space-y-1">
            <Link href="/shop" onClick={() => setMenuOpen(false)}
              className="flex items-center px-4 py-3 text-sm font-bold text-white bg-white/5 rounded-xl">
              All Magnets
            </Link>
            {NAV.map(cat => (
              <Link key={cat.href} href={cat.href} onClick={() => setMenuOpen(false)}
                className="flex items-center px-4 py-3 text-sm text-white/70 hover:text-white hover:bg-white/5 rounded-xl transition-colors">
                {cat.label}
              </Link>
            ))}
          </div>
        )}
      </header>
    </div>
  )
}
