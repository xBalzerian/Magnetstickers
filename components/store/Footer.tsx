import Link from 'next/link'

export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="bg-gray-950 text-gray-500 border-t border-white/5">

      {/* Main grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-10">

        {/* Brand */}
        <div className="col-span-2 lg:col-span-2">
          <Link href="/" className="flex items-center gap-3 mb-5 group w-fit">
            <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-pink-500/20 group-hover:shadow-pink-500/30 transition-shadow">
              <span className="text-white font-black text-sm tracking-tighter">MS</span>
            </div>
            <div>
              <div className="text-white font-black text-lg tracking-tight">Magnet<span className="text-pink-500">Stickers</span></div>
              <div className="text-xs text-gray-600">magnetstickers.art</div>
            </div>
          </Link>
          <p className="text-sm text-gray-600 leading-relaxed mb-6 max-w-xs">
            The world&apos;s biggest die-cut magnet sticker store. Thousands of unique AI-illustrated designs shipped to 190+ countries worldwide.
          </p>
          <div className="flex flex-wrap gap-2">
            {['Die-Cut Precision', 'AI Illustration', 'Global Shipping', 'Printful Fulfilled'].map(badge => (
              <span key={badge} className="text-xs bg-white/5 border border-white/8 text-gray-500 px-3 py-1 rounded-full font-medium">
                {badge}
              </span>
            ))}
          </div>
        </div>

        {/* Shop */}
        <div>
          <h3 className="text-white font-bold mb-5 text-xs uppercase tracking-widest">Shop</h3>
          <ul className="space-y-3">
            {[
              ['All Magnets', '/shop'],
              ['Animals', '/shop/animals'],
              ['Dog Breeds', '/shop/animals-dogs'],
              ['Cat Breeds', '/shop/animals-cats'],
              ['Wildlife', '/shop/wildlife'],
              ['Fruits', '/shop/fruits'],
              ['Vegetables', '/shop/vegetables'],
              ['Quotes', '/shop/quotes'],
              ['Food & Drinks', '/shop/food-drinks'],
            ].map(([label, href]) => (
              <li key={href}>
                <Link href={href} className="text-xs text-gray-600 hover:text-gray-300 transition-colors leading-relaxed">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Support */}
        <div>
          <h3 className="text-white font-bold mb-5 text-xs uppercase tracking-widest">Support</h3>
          <ul className="space-y-3">
            {[
              ['Track My Order', '/order-tracking'],
              ['Shipping Info', '/shipping'],
              ['Returns & Refunds', '/returns'],
              ['FAQ', '/faq'],
              ['Contact Us', '/contact'],
              ['Size Guide', '/size-guide'],
            ].map(([label, href]) => (
              <li key={href}>
                <Link href={href} className="text-xs text-gray-600 hover:text-gray-300 transition-colors">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Quality */}
        <div>
          <h3 className="text-white font-bold mb-5 text-xs uppercase tracking-widest">Our Promise</h3>
          <ul className="space-y-3">
            {[
              ['Die-cut to exact shape, no square borders'],
              ['20mil premium flexible vinyl'],
              ['Matte UV-resistant full-color print'],
              ['150+ DPI — every detail sharp'],
              ['Printful production & fulfillment'],
              ['Ships within 24–48 hours'],
              ['Satisfaction guaranteed'],
            ].map(([text]) => (
              <li key={text} className="flex items-start gap-2">
                <span className="w-1 h-1 rounded-full bg-pink-500 mt-1.5 flex-shrink-0" />
                <span className="text-xs text-gray-600 leading-relaxed">{text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/5 py-5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-700 text-center sm:text-left">
            &copy; {year} MagnetStickers &mdash; All rights reserved &nbsp;&middot;&nbsp; Fulfilled by Printful
          </p>
          <div className="flex items-center gap-5 text-xs text-gray-700">
            <Link href="/privacy" className="hover:text-gray-400 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-gray-400 transition-colors">Terms of Service</Link>
            <Link href="/sitemap.xml" className="hover:text-gray-400 transition-colors">Sitemap</Link>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
              <span>All systems normal</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
