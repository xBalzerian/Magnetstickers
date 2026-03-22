'use client'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface Props {
  bannerVideoUrl?: string | null
  featuredImages?: string[]
}

const POSITIONS = [
  { top: '8%',  left: '3%',   size: 100, delay: 0,   dur: 7,   rot: -12 },
  { top: '22%', left: '87%',  size: 88,  delay: 1.2, dur: 8.5, rot: 15  },
  { top: '62%', left: '5%',   size: 92,  delay: 0.6, dur: 6.5, rot: -8  },
  { top: '70%', left: '83%',  size: 96,  delay: 2,   dur: 9,   rot: 10  },
  { top: '42%', left: '91%',  size: 78,  delay: 0.3, dur: 7.5, rot: -18 },
  { top: '50%', left: '1%',   size: 82,  delay: 1.8, dur: 6,   rot: 20  },
  { top: '14%', left: '55%',  size: 70,  delay: 2.5, dur: 8,   rot: -5  },
  { top: '80%', left: '42%',  size: 76,  delay: 0.9, dur: 7,   rot: 12  },
]

export default function AnimatedHero({ bannerVideoUrl, featuredImages = [] }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [videoReady, setVideoReady] = useState(false)

  useEffect(() => {
    if (videoRef.current && bannerVideoUrl) {
      videoRef.current.play().catch(() => {})
    }
  }, [bannerVideoUrl])

  const imgs = featuredImages.slice(0, 8)

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #2E1810 0%, #1C1410 40%, #200E0A 100%)' }}>

      {/* Video BG */}
      {bannerVideoUrl && (
        <video ref={videoRef} src={bannerVideoUrl} autoPlay muted loop playsInline
          onLoadedData={() => setVideoReady(true)}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-2000 ${videoReady ? 'opacity-25' : 'opacity-0'}`}
        />
      )}

      {/* Gradient overlays */}
      <div className="absolute inset-0 pointer-events-none z-[1]"
        style={{ background: 'linear-gradient(to bottom, rgba(28,20,16,0.7) 0%, rgba(28,20,16,0.1) 40%, rgba(28,20,16,0.85) 100%)' }} />
      <div className="absolute inset-0 pointer-events-none z-[1]"
        style={{ background: 'linear-gradient(to right, rgba(28,20,16,0.5) 0%, transparent 30%, transparent 70%, rgba(28,20,16,0.5) 100%)' }} />

      {/* Ambient orbs */}
      <div className="absolute top-1/3 left-1/5 w-[500px] h-[500px] rounded-full pointer-events-none z-[1]"
        style={{ background: 'radial-gradient(circle, rgba(200,52,26,0.12) 0%, transparent 70%)', animation: 'glow 6s ease-in-out infinite' }} />
      <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] rounded-full pointer-events-none z-[1]"
        style={{ background: 'radial-gradient(circle, rgba(232,90,32,0.10) 0%, transparent 70%)', animation: 'glow 8s ease-in-out infinite', animationDelay: '3s' }} />

      {/* Floating stickers */}
      {imgs.map((img, i) => {
        const pos = POSITIONS[i] ?? POSITIONS[0]
        return (
          <div key={i} className="absolute pointer-events-none z-[2]"
            style={{ top: pos.top, left: pos.left, width: pos.size, height: pos.size,
              animation: `float ${pos.dur}s ease-in-out infinite`,
              animationDelay: `${pos.delay}s`,
              '--rot': `${pos.rot}deg`,
            } as any}>
            <div className="relative w-full h-full rounded-2xl overflow-hidden border shadow-2xl backdrop-blur-sm"
              style={{ borderColor: 'rgba(245,240,232,0.12)', background: 'rgba(245,240,232,0.06)', boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}>
              <Image src={img} alt="" fill className="object-contain p-2" sizes="120px" />
            </div>
          </div>
        )
      })}

      {/* Empty rings */}
      {imgs.length === 0 && POSITIONS.slice(0, 6).map((pos, i) => (
        <div key={i} className="absolute pointer-events-none z-[2] rounded-2xl border"
          style={{ top: pos.top, left: pos.left, width: pos.size, height: pos.size,
            borderColor: 'rgba(245,240,232,0.05)',
            background: 'rgba(245,240,232,0.02)',
            animation: `float ${pos.dur}s ease-in-out infinite`,
            animationDelay: `${pos.delay}s` }} />
      ))}

      {/* Content */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 text-center py-24">

        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full border backdrop-blur-sm"
          style={{ borderColor: 'rgba(245,240,232,0.12)', background: 'rgba(245,240,232,0.06)' }}>
          <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
          <span className="text-xs font-semibold tracking-widest uppercase opacity-60" style={{ color: '#F5F0E8' }}>New designs added daily</span>
        </div>

        {/* Headline */}
        <h1 className="font-black leading-[0.9] tracking-tight mb-6" style={{
          fontSize: 'clamp(3rem, 8vw, 7rem)',
          color: '#F5F0E8'
        }}>
          <span className="block">The World's</span>
          <span className="block" style={{
            background: 'linear-gradient(135deg, #F07030 0%, #C8341A 50%, #E85A20 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
          }}>Biggest</span>
          <span className="block">Magnet Store</span>
        </h1>

        {/* Sub */}
        <p className="text-base sm:text-lg md:text-xl mb-10 max-w-xl mx-auto leading-relaxed"
          style={{ color: 'rgba(245,240,232,0.50)' }}>
          Thousands of unique die-cut magnet stickers. Every breed, animal, fruit, quote and vibe.
        </p>

        {/* Tags */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {['Premium 20mil Vinyl','Vivid Full-Color','Ships Worldwide','Die-Cut Precision'].map(f => (
            <span key={f} className="text-xs font-semibold border px-3 py-1.5 rounded-full backdrop-blur-sm"
              style={{ color: 'rgba(245,240,232,0.45)', borderColor: 'rgba(245,240,232,0.12)', background: 'rgba(245,240,232,0.04)' }}>
              {f}
            </span>
          ))}
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/shop"
            className="group relative overflow-hidden font-black py-4 px-10 rounded-2xl text-base transition-all hover:scale-[1.02] shadow-xl active:scale-[0.98]"
            style={{ background: 'linear-gradient(135deg, #C8341A, #E85A20)', color: '#F5F0E8', boxShadow: '0 4px 24px rgba(200,52,26,0.4)' }}>
            Shop All Magnets
          </Link>
          <Link href="/shop/animals-dogs"
            className="font-bold py-4 px-10 rounded-2xl text-base transition-all hover:scale-[1.02] active:scale-[0.98] border backdrop-blur-sm"
            style={{ borderColor: 'rgba(245,240,232,0.15)', color: 'rgba(245,240,232,0.75)', background: 'rgba(245,240,232,0.06)' }}>
            Dog Breeds
          </Link>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1.5"
        style={{ color: 'rgba(245,240,232,0.2)' }}>
        <span className="text-[10px] tracking-[0.3em] uppercase font-medium">Scroll</span>
        <div className="w-px h-8" style={{ background: 'linear-gradient(to bottom, rgba(245,240,232,0.2), transparent)' }} />
      </div>
    </section>
  )
}
