import Link from 'next/link'

export default function Footer() {
  return (
    <footer style={{ background: '#1C1410', color: '#F5F0E8' }}>
      {/* Marquee */}
      <div className="border-y border-white/5 py-4 overflow-hidden">
        <div className="flex whitespace-nowrap marquee-track gap-16 text-xs font-bold tracking-widest uppercase select-none opacity-30">
          {Array(4).fill(['Die-Cut Precision','Premium Vinyl','Ships Worldwide','Unique Art','Premium Quality','190+ Countries','Handcrafted Designs','100% Guaranteed']).flat().map((t,i) => (
            <span key={i}>{t}</span>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">
        <div className="lg:col-span-2">
          <Link href="/" className="flex items-center gap-3 mb-5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #C8341A, #E85A20)' }}>
              <span className="text-white font-black text-xs">M</span>
            </div>
            <span className="font-black text-lg">Magnet<span style={{ color: '#E85A20' }}>Stickers</span></span>
          </Link>
          <p className="text-sm leading-relaxed mb-6 max-w-xs opacity-40">
            The world's biggest die-cut magnet sticker store. Thousands of unique designs, premium quality, shipped to 190+ countries.
          </p>
          <div className="flex flex-wrap gap-2">
            {['Die-Cut','Premium Art','Worldwide','Secure Pay'].map(b => (
              <span key={b} className="text-xs border border-white/10 opacity-40 px-3 py-1.5 rounded-full">{b}</span>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-bold mb-4 text-xs uppercase tracking-widest opacity-50">Shop</h3>
          <ul className="space-y-2.5 text-sm">
            {[['All Magnets','/shop'],['Animals','/shop/animals'],['Dog Breeds','/shop/animals-dogs'],['Wildlife','/shop/wildlife'],['Fruits','/shop/fruits'],['Vegetables','/shop/vegetables'],['Quotes','/shop/quotes']].map(([l,h]) => (
              <li key={h}><Link href={h} className="opacity-35 hover:opacity-80 hover:text-[#E85A20] transition-all">{l}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-bold mb-4 text-xs uppercase tracking-widest opacity-50">Support</h3>
          <ul className="space-y-2.5 text-sm">
            {[['About Us','/about'],['Shipping Info','/shipping'],['Returns','/returns'],['FAQ','/faq'],['Contact','/contact'],['Track Order','/order-tracking']].map(([l,h]) => (
              <li key={h}><Link href={h} className="opacity-35 hover:opacity-80 hover:text-[#E85A20] transition-all">{l}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-bold mb-4 text-xs uppercase tracking-widest opacity-50">Quality</h3>
          <ul className="space-y-2.5 text-sm opacity-35">
            {['20mil Premium Vinyl','Full-Color UV Print','Die-Cut Precision','Premium Production','30-Day Guarantee','Ships in 3-7 Days'].map(t => <li key={t}>{t}</li>)}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/5 px-4 sm:px-6 py-5 max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs opacity-25">
        <span>© 2025 MagnetStickers.art — All rights reserved</span>
        <div className="flex gap-5">
          {[['Privacy','/privacy'],['Terms','/terms'],['Sitemap','/sitemap.xml']].map(([l,h]) => (
            <Link key={h} href={h} className="hover:opacity-70 transition-opacity">{l}</Link>
          ))}
        </div>
      </div>
    </footer>
  )
}
