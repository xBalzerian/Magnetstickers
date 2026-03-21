'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Image, ShoppingBag, Package, Zap, LogOut } from 'lucide-react'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [authed, setAuthed] = useState(false)
  const [pw, setPw] = useState('')
  const pathname = usePathname()

  useEffect(() => {
    const saved = sessionStorage.getItem('ms_admin')
    if (saved === 'true') setAuthed(true)
  }, [])

  function login(e: React.FormEvent) {
    e.preventDefault()
    if (pw === process.env.NEXT_PUBLIC_ADMIN_PW || pw === 'magnets2025admin') {
      sessionStorage.setItem('ms_admin', 'true')
      setAuthed(true)
    } else alert('Wrong password')
  }

  if (!authed) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 w-full max-w-sm">
        <div className="text-center mb-6">
          <div className="text-4xl mb-2">🧲</div>
          <h1 className="font-bold text-xl">Admin Access</h1>
          <p className="text-gray-500 text-sm">MagnetStickers.art</p>
        </div>
        <form onSubmit={login}>
          <input type="password" value={pw} onChange={e => setPw(e.target.value)}
            placeholder="Enter admin password"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm mb-4 outline-none focus:ring-2 focus:ring-pink-300" />
          <button type="submit" className="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 rounded-xl transition-colors">
            Login
          </button>
        </form>
      </div>
    </div>
  )

  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/designs', label: 'Designs', icon: Image },
    { href: '/admin/batches', label: 'Generate', icon: Zap },
    { href: '/admin/products', label: 'Products', icon: Package },
    { href: '/admin/orders', label: 'Orders', icon: ShoppingBag },
  ]

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className="w-56 bg-white border-r border-gray-100 flex flex-col shrink-0">
        <div className="p-5 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <span className="text-xl">🧲</span>
            <span className="font-extrabold text-sm">MagnetStickers<br /><span className="text-pink-500 text-xs font-normal">Admin Panel</span></span>
          </div>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${pathname === href ? 'bg-pink-50 text-pink-600' : 'text-gray-600 hover:bg-gray-50'}`}>
              <Icon size={16} />
              {label}
            </Link>
          ))}
        </nav>
        <div className="p-3 border-t border-gray-100">
          <button onClick={() => { sessionStorage.removeItem('ms_admin'); setAuthed(false) }}
            className="flex items-center gap-2 text-xs text-gray-400 hover:text-red-500 px-3 py-2">
            <LogOut size={14} /> Sign out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto p-8">{children}</main>
    </div>
  )
}
