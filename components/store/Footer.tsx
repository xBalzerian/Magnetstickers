import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-black border-t border-white/5 text-white/40">

      {/* Marquee strip */}
      <div className="border-y border-white/5 py-4 overflow-hidden">
        <div className="flex whitespace-nowrap marquee-track gap-16 text-xs font-bold text-white/20 tracking-widest uppercase select-none">
          {Array(4).fill(['Die-Cut Precision', 'Premium 20mil Vinyl', 'Ships Worldwide', 'AI-Illustrated Art', 'Printful Quality', '190+ Countries', 'Unique Designs', 'Free Returns']).flat().map((t, i) => (
            <span key={i}>{t}</span>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">

        {/* Brand */}
        <div className="lg:col-span-2">
          <Link href="/" className="flex items-center gap-3 mb-5 w-fit group">
            <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg" />
            <span className="font-black text-white text-lg tracking-tight">
              Magnet<span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">Stickers</span>
            </span>
          </Link>
          <p className="text-sm text-white/30 leading-relaxed mb-6 max-w-xs">
            The world's biggest die-cut magnet sticker store. Thousands of unique designs, premium quality, shipped worldwide.
          </p>
          <div className="flex flex-wrap gap-2">
            {['Die-Cut', 'AI Art', 'Worldwide', 'Secure'].map(b => (
              <span key={b} className="text-xs border border-white/8 text-white/25 px-3 py-1.5 rounded-full">{b}</span>
            ))}
          </div>
        </div>

        {/* Shop */}
        <div>
          <h3 className="text-white/60 font-bold mb-4 text-xs uppercase tracking-widest">Shop</h3>
          <ul className="space-y-2.5 text-sm">
            {[['All Magnets','/shop'],['Animals','/shop/animals'],['Dog Breeds','/shop/animals-dogs'],['Wildlife','/shop/wildlife'],['Fruits','/shop/fruits'],['Vegetables','/shop/vegetables'],['Quotes','/shop/quotes']].map(([l,h]) => (
              <li key={h}><Link href={h} className="text-white/35 hover:text-white transition-colors">{l}</Link></li>
            ))}
          </ul>
        </div>

        {/* Info */}
        <div>
          <h3 className="text-white/60 font-bold mb-4 text-xs uppercase tracking-widest">Info</h3>
          <ul className="space-y-2.5 text-sm">
            {[['About Us','/about'],['Shipping Info','/shipping'],['Returns','/returns'],['FAQ','/faq'],['Contact','/contact'],['Track Order','/order-tracking']].map(([l,h]) => (
              <li key={h}><Link href={h} className="text-white/35 hover:text-white transition-colors">{l}</Link></li>
            ))}
          </ul>
        </div>

        {/* Quality */}
        <div>
          <h3 className="text-white/60 font-bold mb-4 text-xs uppercase tracking-widest">Quality</h3>
          <ul className="space-y-2.5 text-sm text-white/35">
            {['20mil Premium Vinyl','Full-Color UV Print','Die-Cut Precision','Printful Production','30-Day Guarantee','Ships in 3-7 Days'].map(t => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-white/5 px-4 sm:px-6 py-5 max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/20">
        <span>© 2025 MagnetStickers.art — All rights reserved</span>
        <div className="flex gap-5">
          {[['Privacy','/privacy'],['Terms','/terms'],['Sitemap','/sitemap.xml']].map(([l,h]) => (
            <Link key={h} href={h} className="hover:text-white/50 transition-colors">{l}</Link>
          ))}
        </div>
      </div>
    </footer>
  )
}
