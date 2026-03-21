'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { ShoppingCart, Menu, X, Search, ChevronDown } from 'lucide-react'
import { getCartCount, getCart } from '@/lib/cart'

const NAV = [
  {
    label: 'Animals',
    href: '/shop/animals',
    subs: [
      { label: 'Dog Breeds', href: '/shop/animals-dogs' },
      { label: 'Cat Breeds', href: '/shop/animals-cats' },
      { label: 'Birds', href: '/shop/animals-birds' },
      { label: 'Rabbits', href: '/shop/animals-rabbits' },
    ],
  },
  {
    label: 'Wildlife',
    href: '/shop/wildlife',
    subs: [
      { label: 'Big Cats', href: '/shop/wildlife-big-cats' },
      { label: 'Ocean Life', href: '/shop/wildlife-ocean' },
      { label: 'Primates', href: '/shop/wildlife-primates' },
    ],
  },
  { label: 'Fruits', href: '/shop/fruits', subs: [] },
  { label: 'Vegetables', href: '/shop/vegetables', subs: [] },
  { label: 'Quotes', href: '/shop/quotes', subs: [] },
  { label: 'Food & Drinks', href: '/shop/food-drinks', subs: [] },
]

export default function Header() {
  const [cartCount, setCartCount] = useState(0)
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQ, setSearchQ] = useState('')
  const [scrolled, setScrolled] = useState(false)
  const [openSub, setOpenSub] = useState<string | null>(null)

  useEffect(() => {
    const update = () => setCartCount(getCartCount(getCart()))
    update()
    window.addEventListener('cart-updated', update)
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => {
      window.removeEventListener('cart-updated', update)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  function submitSearch(e: React.FormEvent) {
    e.preventDefault()
    if (searchQ.trim()) window.location.href = `/shop?q=${encodeURIComponent(searchQ.trim())}`
  }

  return (
    <div className="sticky top-0 z-50">
      {/* Announcement bar */}
      <div className="bg-gray-950 text-gray-400 text-xs font-medium py-2 px-4 text-center border-b border-white/5 hidden sm:block">
        Free shipping on orders over $35 &nbsp;·&nbsp; Ships to 190+ countries &nbsp;·&nbsp; Die-cut precision on every order &nbsp;·&nbsp; Fulfilled by Printful
      </div>

      {/* Main nav */}
      <header className={`bg-gray-950 border-b border-white/10 transition-all duration-300 ${scrolled ? 'shadow-2xl shadow-black/50' : ''}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-pink-500/20 group-hover:shadow-pink-500/40 transition-shadow">
              <span className="text-white font-black text-xs tracking-tighter">MS</span>
            </div>
            <div className="hidden sm:flex flex-col leading-none">
              <span className="font-black text-white text-base tracking-tight">Magnet<span className="text-pink-500">Stickers</span></span>
              <span className="text-gray-600 text-xs">magnetstickers.art</span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            <Link href="/shop"
              className="px-3 py-2 text-xs font-bold text-pink-400 bg-pink-500/10 border border-pink-500/20 rounded-lg hover:bg-pink-500/20 transition-all tracking-wide uppercase">
              All Magnets
            </Link>
            {NAV.map(item => (
              <div key={item.href} className="relative group"
                onMouseEnter={() => setOpenSub(item.href)}
                onMouseLeave={() => setOpenSub(null)}>
                <Link href={item.href}
                  className="flex items-center gap-1 px-3 py-2 text-xs font-medium text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-white/5">
                  {item.label}
                  {item.subs.length > 0 && <ChevronDown size={12} className="opacity-50" />}
                </Link>
                {item.subs.length > 0 && openSub === item.href && (
                  <div className="absolute top-full left-0 pt-1 z-50">
                    <div className="bg-gray-900 border border-white/10 rounded-xl shadow-2xl shadow-black/50 py-2 min-w-44 overflow-hidden">
                      {item.subs.map(s => (
                        <Link key={s.href} href={s.href}
                          className="block px-4 py-2.5 text-xs text-gray-400 hover:text-white hover:bg-white/5 transition-colors">
                          {s.label}
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
            {/* Desktop search */}
            <form onSubmit={submitSearch}
              className="hidden lg:flex items-center bg-white/5 border border-white/10 hover:border-white/20 rounded-xl px-3 py-2 gap-2 transition-all">
              <Search size={14} className="text-gray-500 shrink-0" />
              <input type="text" placeholder="Search designs…" value={searchQ}
                onChange={e => setSearchQ(e.target.value)}
                className="bg-transparent text-xs outline-none w-36 xl:w-48 text-gray-300 placeholder-gray-600" />
            </form>

            {/* Mobile search toggle */}
            <button onClick={() => setSearchOpen(!searchOpen)}
              className="lg:hidden p-2 text-gray-500 hover:text-white transition-colors">
              <Search size={18} />
            </button>

            {/* Cart */}
            <Link href="/cart"
              className="relative flex items-center gap-1.5 bg-pink-500 hover:bg-pink-400 text-white px-3 py-2 rounded-xl transition-all font-bold text-xs shadow-lg shadow-pink-500/20 hover:shadow-pink-500/40">
              <ShoppingCart size={15} />
              <span className="hidden sm:block">Cart</span>
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-yellow-400 text-gray-900 text-xs w-4.5 h-4.5 min-w-[18px] min-h-[18px] rounded-full flex items-center justify-center font-black border-2 border-gray-950 text-[10px]">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </Link>

            {/* Mobile menu */}
            <button onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden p-2 text-gray-400 hover:text-white transition-colors">
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile search bar */}
        {searchOpen && (
          <div className="lg:hidden px-4 pb-3">
            <form onSubmit={submitSearch}
              className="flex items-center bg-white/5 border border-white/10 rounded-xl px-4 py-3 gap-2">
              <Search size={16} className="text-gray-500" />
              <input type="text" placeholder="Search magnet designs…" value={searchQ}
                onChange={e => setSearchQ(e.target.value)} autoFocus
                className="bg-transparent text-sm outline-none flex-1 text-gray-300 placeholder-gray-600" />
            </form>
          </div>
        )}

        {/* Mobile menu */}
        {menuOpen && (
          <div className="lg:hidden bg-gray-950 border-t border-white/10 px-4 py-4 space-y-0.5 max-h-[75vh] overflow-y-auto">
            <Link href="/shop" onClick={() => setMenuOpen(false)}
              className="flex items-center justify-between px-4 py-3 text-sm font-bold text-pink-400 bg-pink-500/10 border border-pink-500/20 rounded-xl mb-2">
              All Magnets
              <span className="text-xs text-pink-500/50">Shop All</span>
            </Link>
            {NAV.map(item => (
              <div key={item.href}>
                <Link href={item.href} onClick={() => setMenuOpen(false)}
                  className="flex items-center px-4 py-3 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-xl transition-colors">
                  {item.label}
                </Link>
                {item.subs.length > 0 && (
                  <div className="ml-4 space-y-0.5 mb-1">
                    {item.subs.map(s => (
                      <Link key={s.href} href={s.href} onClick={() => setMenuOpen(false)}
                        className="flex items-center px-4 py-2 text-xs text-gray-500 hover:text-gray-300 hover:bg-white/5 rounded-xl transition-colors">
                        {s.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </header>
    </div>
  )
}
