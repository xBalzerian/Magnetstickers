'use client'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface Props {
  bannerVideoUrl?: string | null
  featuredImages?: string[]
}

// Real sticker floating positions — show actual product images, no emojis
const POSITIONS = [
  { top: '8%',  left: '3%',   size: 100, delay: 0,   dur: 7,   rot: -12 },
  { top: '22%', left: '88%',  size: 88,  delay: 1.2, dur: 8.5, rot: 15  },
  { top: '62%', left: '5%',   size: 92,  delay: 0.6, dur: 6.5, rot: -8  },
  { top: '70%', left: '84%',  size: 96,  delay: 2,   dur: 9,   rot: 10  },
  { top: '40%', left: '91%',  size: 78,  delay: 0.3, dur: 7.5, rot: -18 },
  { top: '50%', left: '1%',   size: 82,  delay: 1.8, dur: 6,   rot: 20  },
  { top: '12%', left: '55%',  size: 70,  delay: 2.5, dur: 8,   rot: -5  },
  { top: '82%', left: '42%',  size: 76,  delay: 0.9, dur: 7,   rot: 12  },
]

export default function AnimatedHero({ bannerVideoUrl, featuredImages = [] }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [videoReady, setVideoReady] = useState(false)

  useEffect(() => {
    if (videoRef.current && bannerVideoUrl) {
      videoRef.current.play().catch(() => {})
    }
  }, [bannerVideoUrl])

  const displayImages = featuredImages.slice(0, 8)

  return (
    <section className="relative min-h-[95vh] flex items-center overflow-hidden bg-black">

      {/* VIDEO BG — Kling animated banner */}
      {bannerVideoUrl && (
        <video ref={videoRef} src={bannerVideoUrl} autoPlay muted loop playsInline
          onLoadedData={() => setVideoReady(true)}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-2000 ${videoReady ? 'opacity-35' : 'opacity-0'}`}
        />
      )}

      {/* Gradient overlays — always visible */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/20 to-black/90 pointer-events-none z-[1]" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/60 pointer-events-none z-[1]" />

      {/* Ambient glow orbs */}
      <div className="absolute top-1/3 left-1/4 w-[600px] h-[600px] rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(236,72,153,0.08) 0%, transparent 70%)', animation: 'glow 6s ease-in-out infinite' }} />
      <div className="absolute bottom-1/3 right-1/4 w-[500px] h-[500px] rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)', animation: 'glow 8s ease-in-out infinite', animationDelay: '3s' }} />

      {/* FLOATING STICKER IMAGES */}
      {displayImages.map((img, i) => {
        const pos = POSITIONS[i] ?? POSITIONS[0]
        return (
          <div key={i} className="absolute pointer-events-none z-[2]"
            style={{
              top: pos.top, left: pos.left,
              width: pos.size, height: pos.size,
              animation: `float ${pos.dur}s ease-in-out infinite`,
              animationDelay: `${pos.delay}s`,
              '--rot': `${pos.rot}deg`,
            } as any}>
            <div className="relative w-full h-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-black/60 bg-white/5 backdrop-blur-sm">
              <Image src={img} alt="magnet sticker" fill className="object-contain p-2" sizes="120px" />
            </div>
          </div>
        )
      })}

      {/* Empty floating placeholder rings when no images yet */}
      {displayImages.length === 0 && POSITIONS.slice(0, 6).map((pos, i) => (
        <div key={i} className="absolute pointer-events-none z-[2] rounded-2xl border border-white/5"
          style={{
            top: pos.top, left: pos.left,
            width: pos.size, height: pos.size,
            background: 'rgba(255,255,255,0.02)',
            animation: `float ${pos.dur}s ease-in-out infinite`,
            animationDelay: `${pos.delay}s`,
          }} />
      ))}

      {/* MAIN CONTENT */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 text-center py-24">

        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm">
          <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
          <span className="text-xs font-semibold text-white/60 tracking-widest uppercase">New designs added daily</span>
        </div>

        {/* Headline */}
        <h1 className="text-[clamp(3rem,8vw,7rem)] font-black leading-[0.9] tracking-tight text-white mb-6">
          <span className="block">The World's</span>
          <span className="block text-transparent bg-clip-text"
            style={{ backgroundImage: 'linear-gradient(135deg, #f472b6 0%, #a855f7 50%, #6366f1 100%)' }}>
            Biggest
          </span>
          <span className="block">Magnet Store</span>
        </h1>

        {/* Subtitle */}
        <p className="text-white/50 text-base sm:text-lg md:text-xl mb-10 max-w-xl mx-auto leading-relaxed">
          Thousands of unique die-cut magnet stickers. Every breed, animal, fruit, quote and vibe.
        </p>

        {/* Feature tags */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {['Premium 20mil Vinyl', 'Vivid Full-Color Print', 'Ships to 190+ Countries', 'Die-Cut Precision'].map(f => (
            <span key={f}
              className="text-xs font-semibold text-white/50 border border-white/10 px-3 py-1.5 rounded-full bg-white/3 backdrop-blur-sm">
              {f}
            </span>
          ))}
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/shop"
            className="group relative overflow-hidden bg-white text-black font-black py-4 px-10 rounded-2xl text-base transition-all hover:scale-[1.02] shadow-2xl shadow-black/50 active:scale-[0.98]">
            <span className="relative z-10">Shop All Magnets</span>
            <div className="absolute inset-0 bg-gradient-to-r from-pink-400 to-purple-500 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            <span className="absolute inset-0 flex items-center justify-center z-20 text-white font-black opacity-0 group-hover:opacity-100 transition-opacity duration-300">Shop All Magnets</span>
          </Link>
          <Link href="/shop/animals-dogs"
            className="group bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white font-bold py-4 px-10 rounded-2xl text-base transition-all hover:scale-[1.02] backdrop-blur-sm active:scale-[0.98]">
            Dog Breeds
          </Link>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1.5 text-white/20">
        <span className="text-[10px] tracking-[0.3em] uppercase font-medium">Scroll</span>
        <div className="w-px h-8 bg-gradient-to-b from-white/20 to-transparent" />
      </div>
    </section>
  )
}
