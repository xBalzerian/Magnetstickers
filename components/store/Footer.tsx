import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-400">
      {/* Top section */}
      <div className="max-w-7xl mx-auto px-4 py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">

        {/* Brand - spans 2 cols */}
        <div className="lg:col-span-2">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-xl">🧲</span>
            </div>
            <div>
              <span className="text-white font-black text-xl">Magnet</span>
              <span className="text-pink-400 font-black text-xl">Stickers</span>
            </div>
          </div>
          <p className="text-sm text-gray-400 leading-relaxed mb-5 max-w-xs">
            The world&apos;s biggest die-cut magnet sticker store. Thousands of unique designs, 
            premium quality, shipped to 190+ countries worldwide.
          </p>
          {/* Trust badges */}
          <div className="flex flex-wrap gap-2">
            {['✂️ Die-Cut', '🎨 AI Art', '🌍 Worldwide', '🔒 Secure'].map(badge => (
              <span key={badge} className="text-xs bg-white/5 border border-white/10 text-gray-400 px-3 py-1 rounded-full">
                {badge}
              </span>
            ))}
          </div>
        </div>

        {/* Shop */}
        <div>
          <h3 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">Shop</h3>
          <ul className="space-y-2.5 text-sm">
            {[
              ['All Magnets', '/shop'],
              ['🐾 Animals', '/shop/animals'],
              ['🐶 Dog Breeds', '/shop/animals-dogs'],
              ['🐱 Cat Breeds', '/shop/animals-cats'],
              ['🦁 Wildlife', '/shop/wildlife'],
              ['🍎 Fruits', '/shop/fruits'],
              ['🥦 Vegetables', '/shop/vegetables'],
              ['💬 Quotes', '/shop/quotes'],
              ['🍕 Food & Drinks', '/shop/food-drinks'],
            ].map(([label, href]) => (
              <li key={href}>
                <Link href={href} className="hover:text-pink-400 transition-colors">{label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Support */}
        <div>
          <h3 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">Support</h3>
          <ul className="space-y-2.5 text-sm">
            {[
              ['Track My Order', '/order-tracking'],
              ['Shipping & Delivery', '/shipping'],
              ['Returns & Refunds', '/returns'],
              ['FAQ', '/faq'],
              ['Contact Us', '/contact'],
              ['Size Guide', '/size-guide'],
            ].map(([label, href]) => (
              <li key={href}>
                <Link href={href} className="hover:text-pink-400 transition-colors">{label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Info + Quality */}
        <div>
          <h3 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">Quality Promise</h3>
          <ul className="space-y-3 text-sm">
            {[
              ['✂️', 'Perfect die-cut edge on every order'],
              ['🧲', '20mil premium flexible vinyl magnet'],
              ['🎨', 'Matte UV-resistant full-color print'],
              ['📦', 'Fulfilled by Printful — trusted worldwide'],
              ['🔄', 'Satisfaction guaranteed'],
              ['⚡', 'Ships within 24–48 hours'],
            ].map(([icon, text]) => (
              <li key={text} className="flex items-start gap-2">
                <span className="flex-shrink-0">{icon}</span>
                <span>{text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/5 py-6 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-600">
            © {new Date().getFullYear()} MagnetStickers — All rights reserved · Fulfilled by Printful
          </p>
          <div className="flex items-center gap-5 text-xs text-gray-600">
            <Link href="/privacy" className="hover:text-gray-400 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-gray-400 transition-colors">Terms of Service</Link>
            <Link href="/sitemap.xml" className="hover:text-gray-400 transition-colors">Sitemap</Link>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full" />
              All systems operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
