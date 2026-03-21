import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // KIE.ai CDN domains
      { protocol: 'https', hostname: 'tempfile.aiquickdraw.com' },
      { protocol: 'https', hostname: 'tempfileb.aiquickdraw.com' },
      { protocol: 'https', hostname: 'static.aiquickdraw.com' },
      { protocol: 'https', hostname: '*.kie.ai' },
      { protocol: 'https', hostname: 'cdn.kie.ai' },
      { protocol: 'https', hostname: 'files.kie.ai' },
      // Supabase
      { protocol: 'https', hostname: '*.supabase.co' },
      // Printful
      { protocol: 'https', hostname: 'files.cdn.printful.com' },
      { protocol: 'https', hostname: 'cdn.printful.com' },
      // Google storage (Gemini output)
      { protocol: 'https', hostname: 'storage.googleapis.com' },
      { protocol: 'https', hostname: '*.googleapis.com' },
    ],
  },
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
}

export default nextConfig
