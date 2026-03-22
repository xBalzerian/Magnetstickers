'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { ShoppingBag, Menu, X, Search, ChevronDown } from 'lucide-react'
import { getCartCount, getCart } from '@/lib/cart'

const NAV = [
  { href: '/shop',              label: 'All',         sub: [] },
  { href: '/shop/animals',      label: 'Animals',     sub: [['Dogs','/shop/animals-dogs'],['Cats','/shop/animals-cats'],['Birds','/shop/animals-birds'],['Rabbits','/shop/animals-rabbits']] },
  { href: '/shop/wildlife',     label: 'Wildlife',    sub: [['Big Cats','/shop/wildlife-big-cats'],['Ocean','/shop/wildlife-ocean'],['Reptiles','/shop/wildlife-reptiles']] },
  { href: '/shop/fruits',       label: 'Fruits',      sub: [] },
  { href: '/shop/vegetables',   label: 'Vegetables',  sub: [] },
  { href: '/shop/quotes',       label: 'Quotes',      sub: [] },
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
      {/* Announcement */}
      <div className="text-center py-2 px-4 text-xs font-semibold tracking-wide"
        style={{ background: '#1C1410', color: '#F5F0E8' }}>
        Free shipping on orders over $35 &nbsp;·&nbsp; Ships to 190+ countries &nbsp;·&nbsp; 100% satisfaction guarantee
      </div>

      {/* Main header */}
      <header className={`transition-all duration-200 border-b ${
        scrolled
          ? 'shadow-md bg-[#F0EBE1] border-[#C8341A]/20'
          : 'bg-[#F5F0E8] border-[#DDD7CB]'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-6">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center shadow-sm"
              style={{ background: 'linear-gradient(135deg, #C8341A, #E85A20)' }}>
              <span className="text-white font-black text-xs">M</span>
            </div>
            <span className="font-black text-[#1C1410] text-lg tracking-tight hidden sm:block">
              Magnet<span style={{ color: '#C8341A' }}>Stickers</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-0.5">
            {NAV.map(cat => (
              <div key={cat.href} className="relative group">
                <Link href={cat.href}
                  className="flex items-center gap-1 px-3.5 py-2 text-sm font-semibold text-[#1C1410]/70 hover:text-[#C8341A] rounded-lg transition-colors hover:bg-[#C8341A]/5">
                  {cat.label}
                  {cat.sub.length > 0 && <ChevronDown size={12} className="opacity-40 group-hover:opacity-70" />}
                </Link>
                {cat.sub.length > 0 && (
                  <div className="absolute top-full left-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150">
                    <div className="bg-[#F5F0E8] border border-[#DDD7CB] rounded-2xl shadow-xl py-2 min-w-44">
                      {cat.sub.map(([label, href]) => (
                        <Link key={href} href={href}
                          className="block px-4 py-2.5 text-sm text-[#1C1410]/60 hover:text-[#C8341A] hover:bg-[#C8341A]/5 transition-colors">
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
            <form onSubmit={handleSearch}
              className="hidden lg:flex items-center bg-[#EDE8DE] hover:bg-[#DDD7CB] border border-[#DDD7CB] rounded-xl px-3 py-2 gap-2 transition-colors focus-within:border-[#C8341A]/40">
              <Search size={14} className="text-[#1C1410]/30 shrink-0" />
              <input type="text" placeholder="Search designs…" value={searchQ}
                onChange={e => setSearchQ(e.target.value)}
                className="bg-transparent text-sm outline-none w-36 xl:w-44 text-[#1C1410] placeholder-[#1C1410]/30" />
            </form>

            <button onClick={() => setSearchOpen(!searchOpen)}
              className="lg:hidden p-2 text-[#1C1410]/50 hover:text-[#C8341A] transition-colors">
              <Search size={18} />
            </button>

            {/* Cart */}
            <Link href="/cart"
              className="relative flex items-center gap-2 text-white pl-3.5 pr-4 py-2 rounded-xl text-sm font-bold transition-all hover:opacity-90 shadow-sm"
              style={{ background: 'linear-gradient(135deg, #C8341A, #E85A20)' }}>
              <ShoppingBag size={15} />
              <span className="hidden sm:block">Cart</span>
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#1C1410] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-black border-2 shadow-lg"
                  style={{ borderColor: '#F5F0E8' }}>
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </Link>

            <button onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden p-2 text-[#1C1410]/50 hover:text-[#C8341A] transition-colors">
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile search */}
        {searchOpen && (
          <div className="lg:hidden px-4 pb-3 border-t border-[#DDD7CB]">
            <form onSubmit={handleSearch} className="flex items-center bg-[#EDE8DE] border border-[#DDD7CB] rounded-xl px-4 py-2.5 gap-2 mt-3">
              <Search size={15} className="text-[#1C1410]/30" />
              <input type="text" placeholder="Search designs…" value={searchQ} autoFocus
                onChange={e => setSearchQ(e.target.value)}
                className="bg-transparent text-sm outline-none flex-1 text-[#1C1410] placeholder-[#1C1410]/30" />
            </form>
          </div>
        )}

        {menuOpen && (
          <div className="lg:hidden bg-[#F5F0E8] border-t border-[#DDD7CB] px-4 py-4 space-y-1">
            {NAV.map(cat => (
              <Link key={cat.href} href={cat.href} onClick={() => setMenuOpen(false)}
                className="flex items-center px-4 py-3 text-sm font-semibold text-[#1C1410]/70 hover:text-[#C8341A] hover:bg-[#C8341A]/5 rounded-xl transition-colors">
                {cat.label}
              </Link>
            ))}
          </div>
        )}
      </header>
    </div>
  )
}
