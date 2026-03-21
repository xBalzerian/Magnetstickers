import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-14 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">🧲</span>
            <span className="text-white font-extrabold text-lg">MagnetStickers</span>
          </div>
          <p className="text-sm text-gray-400 leading-relaxed">
            Unique die-cut magnet stickers for every passion. Premium quality, ships worldwide.
          </p>
          <p className="text-xs text-gray-500 mt-4">magnetstickers.art</p>
        </div>

        {/* Shop */}
        <div>
          <h3 className="text-white font-semibold mb-4">Shop</h3>
          <ul className="space-y-2 text-sm">
            {[
              ['All Magnets', '/shop'],
              ['Animals', '/shop/animals'],
              ['Dog Breeds', '/shop/animals-dogs'],
              ['Cat Breeds', '/shop/animals-cats'],
              ['Wildlife', '/shop/wildlife'],
              ['Fruits', '/shop/fruits'],
              ['Quotes', '/shop/quotes'],
            ].map(([label, href]) => (
              <li key={href}><Link href={href} className="hover:text-pink-400 transition-colors">{label}</Link></li>
            ))}
          </ul>
        </div>

        {/* Help */}
        <div>
          <h3 className="text-white font-semibold mb-4">Help</h3>
          <ul className="space-y-2 text-sm">
            {[
              ['Order Tracking', '/order-tracking'],
              ['Shipping Info', '/shipping'],
              ['Returns', '/returns'],
              ['FAQ', '/faq'],
              ['Contact Us', '/contact'],
            ].map(([label, href]) => (
              <li key={href}><Link href={href} className="hover:text-pink-400 transition-colors">{label}</Link></li>
            ))}
          </ul>
        </div>

        {/* Trust */}
        <div>
          <h3 className="text-white font-semibold mb-4">Why Us?</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2"><span>✂️</span><span>Die-cut precision on every magnet</span></li>
            <li className="flex items-start gap-2"><span>🎨</span><span>AI-illustrated unique designs</span></li>
            <li className="flex items-start gap-2"><span>🌍</span><span>Ships worldwide via Printful</span></li>
            <li className="flex items-start gap-2"><span>🔒</span><span>Secure checkout via PayPal</span></li>
            <li className="flex items-start gap-2"><span>📦</span><span>No minimums — order 1 or 100</span></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-800 py-6 px-4 flex flex-col sm:flex-row items-center justify-between gap-3 max-w-7xl mx-auto">
        <p className="text-xs text-gray-500">© {new Date().getFullYear()} MagnetStickers.art — All rights reserved.</p>
        <div className="flex items-center gap-4 text-xs text-gray-500">
          <Link href="/privacy" className="hover:text-gray-300">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-gray-300">Terms</Link>
          <span>Fulfilled by Printful</span>
        </div>
      </div>
    </footer>
  )
}
