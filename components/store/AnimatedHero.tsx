'use client'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface Props {
  bannerVideoUrl?: string | null
  bannerImageUrl?: string | null
  featuredImages?: string[]
}

export default function AnimatedHero({ bannerVideoUrl, bannerImageUrl, featuredImages = [] }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [videoReady, setVideoReady] = useState(false)

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {})
    }
  }, [bannerVideoUrl])

  return (
    <section className="relative min-h-[100svh] flex items-center overflow-hidden bg-black">

      {/* ── VIDEO LAYER (Kling animated banner, when available) ── */}
      {bannerVideoUrl && (
        <video
          ref={videoRef}
          src={bannerVideoUrl}
          autoPlay muted loop playsInline preload="auto"
          onCanPlay={() => setVideoReady(true)}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1500 ${videoReady ? 'opacity-50' : 'opacity-0'}`}
        />
      )}

      {/* ── STATIC BANNER IMAGE (Nano Banana 2, fallback below video) ── */}
      {bannerImageUrl && !videoReady && (
        <Image
          src={bannerImageUrl}
          alt="Magnet Stickers Banner"
          fill
          priority
          className="object-cover opacity-40"
          sizes="100vw"
        />
      )}

      {/* ── ANIMATED GRADIENT BG (always behind everything) ── */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-black" />
        <div className="absolute top-0 left-0 w-full h-full">
          {/* Animated gradient orbs */}
          <div className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] max-w-[700px] max-h-[700px] bg-pink-900/30 rounded-full blur-[120px] animate-pulse-slow" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] bg-purple-900/25 rounded-full blur-[100px] animate-pulse-slower" />
          <div className="absolute top-[30%] right-[20%] w-[30vw] h-[30vw] max-w-[400px] max-h-[400px] bg-indigo-900/20 rounded-full blur-[80px] animate-pulse-slow" />
        </div>
      </div>

      {/* ── OVERLAY ── */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/80" />

      {/* ── FLOATING PRODUCT IMAGES (real magnets when available) ── */}
      {featuredImages.length > 0 && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden hidden md:block">
          {featuredImages.slice(0, 8).map((img, i) => {
            const placements = [
              { top: '8%',  left: '3%',  size: 88, delay: 0,   dur: 7 },
              { top: '60%', left: '2%',  size: 72, delay: 1.5, dur: 8 },
              { top: '20%', right: '3%', size: 80, delay: 0.5, dur: 6 },
              { top: '65%', right: '2%', size: 64, delay: 2,   dur: 9 },
              { top: '40%', left: '1%',  size: 56, delay: 3,   dur: 7 },
              { top: '35%', right: '1%', size: 60, delay: 1,   dur: 8 },
              { top: '80%', left: '15%', size: 52, delay: 2.5, dur: 6 },
              { top: '15%', right: '15%',size: 68, delay: 0.8, dur: 7 },
            ]
            const p = placements[i] ?? placements[0]
            return (
              <div key={i}
                className="absolute rounded-2xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-sm shadow-2xl"
                style={{
                  top: p.top,
                  ...(('left' in p) ? { left: p.left } : {}),
                  ...(('right' in p) ? { right: (p as any).right } : {}),
                  width: p.size,
                  height: p.size,
                  animation: `floatY ${p.dur}s ease-in-out infinite`,
                  animationDelay: `${p.delay}s`,
                }}>
                <Image src={img} alt="magnet" fill className="object-contain p-2" sizes="100px" />
              </div>
            )
          })}
        </div>
      )}

      {/* ── MAIN CONTENT ── */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 py-20 sm:py-28 text-center">

        {/* Eyebrow badge */}
        <div className="inline-flex items-center gap-2.5 bg-white/8 backdrop-blur-md border border-white/12 text-white/80 text-xs sm:text-sm font-semibold px-4 sm:px-5 py-2 rounded-full mb-8 sm:mb-10">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          Ships to 190+ Countries &nbsp;&middot;&nbsp; Premium Die-Cut Quality
        </div>

        {/* Headline — large on desktop, still big on mobile */}
        <h1 className="font-black text-white leading-none tracking-tight mb-6 sm:mb-8
          text-[2.8rem] sm:text-[4rem] md:text-[5.5rem] lg:text-[7rem] xl:text-[8rem]">
          The World&rsquo;s<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-rose-400 to-purple-400">
            Biggest
          </span>
          <br />
          <span>Magnet Store</span>
        </h1>

        {/* Sub headline */}
        <p className="text-white/55 text-base sm:text-lg md:text-xl mb-10 sm:mb-12 max-w-xl sm:max-w-2xl mx-auto leading-relaxed">
          Thousands of unique AI-illustrated die-cut magnet stickers — every breed, animal, fruit, quote and vibe.
          <span className="block mt-1 text-pink-400/80 font-medium">Premium 20mil vinyl. Ships worldwide.</span>
        </p>

        {/* CTAs — stacked on mobile, side-by-side on sm+ */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-12 sm:mb-16">
          <Link href="/shop"
            className="w-full sm:w-auto group relative overflow-hidden bg-gradient-to-r from-pink-500 to-purple-600 text-white font-black py-4 sm:py-5 px-8 sm:px-12 rounded-2xl text-base sm:text-lg transition-all duration-300 shadow-2xl shadow-pink-500/30 hover:shadow-pink-500/50 hover:-translate-y-0.5 active:translate-y-0">
            Shop All Magnets
          </Link>
          <Link href="/shop/animals-dogs"
            className="w-full sm:w-auto bg-white/8 backdrop-blur-md hover:bg-white/15 text-white font-semibold py-4 sm:py-5 px-8 sm:px-12 rounded-2xl text-base sm:text-lg transition-all border border-white/15 hover:border-white/25 hover:-translate-y-0.5 active:translate-y-0">
            Dog Breeds
          </Link>
        </div>

        {/* Trust strip — scrollable on mobile */}
        <div className="flex items-center justify-center gap-6 sm:gap-10 overflow-x-auto pb-1 scrollbar-none">
          {[
            ['Die-Cut Precision', 'Every magnet cut to shape'],
            ['AI-Illustrated Art', 'Exclusive unique designs'],
            ['Printful Fulfilled', 'World-class production'],
            ['4.9 Star Rating', 'Thousands of happy customers'],
          ].map(([title, sub]) => (
            <div key={title} className="flex flex-col items-center gap-0.5 shrink-0">
              <span className="text-white/60 text-xs font-bold tracking-wide whitespace-nowrap">{title}</span>
              <span className="text-white/25 text-xs whitespace-nowrap hidden sm:block">{sub}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1.5 text-white/25">
        <div className="w-px h-8 bg-gradient-to-b from-transparent to-white/30" />
        <span className="text-[10px] tracking-widest uppercase">Scroll</span>
      </div>
    </section>
  )
}
