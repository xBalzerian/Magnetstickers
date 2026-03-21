'use client'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface Props {
  bannerVideoUrl?: string | null
  featuredImages?: string[]
}

// Floating sticker data — positions and animations
const FLOATERS = [
  { emoji: '🐶', size: 72, top: '8%',  left: '4%',  delay: 0,   duration: 6,  rotate: -15 },
  { emoji: '🐱', size: 56, top: '15%', left: '88%', delay: 0.8, duration: 7,  rotate: 12 },
  { emoji: '🦁', size: 80, top: '68%', left: '6%',  delay: 1.2, duration: 8,  rotate: -8 },
  { emoji: '🍎', size: 52, top: '72%', left: '85%', delay: 0.4, duration: 6.5,rotate: 20 },
  { emoji: '🦋', size: 44, top: '35%', left: '92%', delay: 2,   duration: 9,  rotate: -5 },
  { emoji: '🐸', size: 60, top: '82%', left: '45%', delay: 1.6, duration: 7.5,rotate: 15 },
  { emoji: '🌸', size: 48, top: '10%', left: '50%', delay: 0.6, duration: 8,  rotate: -20 },
  { emoji: '🦊', size: 64, top: '55%', left: '2%',  delay: 2.4, duration: 6,  rotate: 10 },
  { emoji: '🐼', size: 58, top: '25%', left: '78%', delay: 1,   duration: 7,  rotate: -12 },
  { emoji: '🍕', size: 50, top: '48%', left: '95%', delay: 3,   duration: 8.5,rotate: 25 },
  { emoji: '🐬', size: 55, top: '88%', left: '15%', delay: 1.8, duration: 6.5,rotate: -18 },
  { emoji: '🌺', size: 42, top: '5%',  left: '70%', delay: 2.2, duration: 9,  rotate: 8  },
]

export default function AnimatedHero({ bannerVideoUrl, featuredImages = [] }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [videoLoaded, setVideoLoaded] = useState(false)

  useEffect(() => {
    if (videoRef.current && bannerVideoUrl) {
      videoRef.current.play().catch(() => {})
    }
  }, [bannerVideoUrl])

  return (
    <section className="relative min-h-[92vh] flex items-center overflow-hidden bg-black">

      {/* ── VIDEO BACKGROUND (Kling 3.0 — when available) ── */}
      {bannerVideoUrl && (
        <video
          ref={videoRef}
          src={bannerVideoUrl}
          autoPlay muted loop playsInline
          onLoadedData={() => setVideoLoaded(true)}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${videoLoaded ? 'opacity-40' : 'opacity-0'}`}
        />
      )}

      {/* ── ANIMATED GRADIENT BACKGROUND (fallback / always shown) ── */}
      <div className={`absolute inset-0 transition-opacity duration-1000 ${videoLoaded ? 'opacity-0' : 'opacity-100'}`}>
        <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-black to-purple-950" />
        {/* Animated orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-pink-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }} />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '6s', animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-yellow-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '5s', animationDelay: '1s' }} />
      </div>

      {/* ── DARK OVERLAY on video ── */}
      {bannerVideoUrl && <div className="absolute inset-0 bg-black/50" />}

      {/* ── FLOATING STICKERS ── */}
      {FLOATERS.map((f, i) => (
        <div
          key={i}
          className="absolute select-none pointer-events-none"
          style={{
            top: f.top,
            left: f.left,
            fontSize: `${f.size}px`,
            animation: `float ${f.duration}s ease-in-out infinite`,
            animationDelay: `${f.delay}s`,
            transform: `rotate(${f.rotate}deg)`,
            filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.5))',
            zIndex: 2,
          }}
        >
          {f.emoji}
        </div>
      ))}

      {/* ── PRODUCT IMAGE FLOATERS (if we have real product images) ── */}
      {featuredImages.slice(0, 6).map((img, i) => {
        const positions = [
          { top: '12%', left: '8%' }, { top: '65%', left: '12%' },
          { top: '18%', left: '82%' }, { top: '70%', left: '80%' },
          { top: '45%', left: '4%' }, { top: '40%', left: '90%' },
        ]
        const pos = positions[i] ?? { top: '50%', left: '50%' }
        return (
          <div
            key={`img-${i}`}
            className="absolute w-16 h-16 md:w-20 md:h-20 rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl"
            style={{
              top: pos.top,
              left: pos.left,
              animation: `float ${6 + i}s ease-in-out infinite`,
              animationDelay: `${i * 0.5}s`,
              zIndex: 3,
            }}
          >
            <Image src={img} alt="magnet" fill className="object-contain p-1 bg-white/10" />
          </div>
        )
      })}

      {/* ── MAIN CONTENT ── */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-20 text-center w-full">

        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md text-white/90 text-sm font-bold px-5 py-2 rounded-full mb-8 border border-white/20 shadow-xl">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          🌍 Ships to 190+ Countries · Premium Die-Cut Quality
        </div>

        {/* Headline */}
        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white leading-none mb-6 tracking-tight">
          The World&apos;s
          <br />
          <span className="relative inline-block">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-pink-400 to-purple-400">
              Biggest
            </span>
          </span>
          <br />
          <span className="text-white">Magnet Store</span>
        </h1>

        {/* Sub */}
        <p className="text-white/70 text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
          Thousands of unique die-cut magnet stickers — every breed, animal, fruit, quote &amp; vibe.
          <br className="hidden md:block" />
          <span className="text-pink-400 font-semibold"> Premium 20mil vinyl · Vivid full-color · Ships worldwide.</span>
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link href="/shop"
            className="group relative overflow-hidden bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 text-white font-black py-5 px-10 rounded-2xl text-xl transition-all shadow-2xl hover:shadow-pink-500/50 hover:-translate-y-1 transform">
            <span className="relative z-10">🛍️ Shop All Magnets</span>
            <div className="absolute inset-0 bg-white/20 translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
          </Link>
          <Link href="/shop/animals-dogs"
            className="bg-white/10 backdrop-blur-md hover:bg-white/20 text-white font-bold py-5 px-10 rounded-2xl text-xl transition-all border border-white/20 hover:-translate-y-1 transform shadow-xl">
            🐶 Dog Breeds
          </Link>
        </div>

        {/* Trust strip */}
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-white/50">
          {[
            ['✂️', 'Die-Cut Precision'],
            ['🎨', 'AI-Illustrated Art'],
            ['📦', 'Fulfilled by Printful'],
            ['⭐', '4.9 Star Rating'],
            ['🔒', 'Secure Checkout'],
          ].map(([icon, text]) => (
            <span key={text} className="flex items-center gap-1.5">
              <span>{icon}</span>
              <span>{text}</span>
            </span>
          ))}
        </div>
      </div>

      {/* ── SCROLL INDICATOR ── */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-white/40 animate-bounce">
        <span className="text-xs tracking-widest uppercase">Scroll</span>
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {/* ── CSS ANIMATIONS ── */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(var(--r, 0deg)); }
          33%       { transform: translateY(-18px) rotate(calc(var(--r, 0deg) + 3deg)); }
          66%       { transform: translateY(-8px) rotate(calc(var(--r, 0deg) - 3deg)); }
        }
      `}</style>
    </section>
  )
}
