import { NextRequest, NextResponse } from 'next/server'
import {
  generateBannerImage,
  animateBannerToVideo,
  getTaskStatus,
  extractImageUrls,
  extractVideoUrl,
  pollUntilDone,
  sleep,
} from '@/lib/kie'
import { supabaseAdmin } from '@/lib/supabase'

function auth(req: NextRequest) {
  return req.headers.get('x-admin-secret') === process.env.ADMIN_SECRET
}

// POST /api/banner — generate 2 banner images with Nano Banana 2, then animate with Kling
// Body: { action: 'generate' | 'animate', imageUrl?: string, slot?: 1|2 }
export async function POST(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const db = supabaseAdmin()

  if (body.action === 'generate') {
    // Generate 2 cinematic banner images using Nano Banana 2
    const prompts = [
      // Banner 1 — Bold character lineup
      'An epic cinematic lineup of cute cartoon die-cut magnet sticker characters: a shih tzu dog, a golden retriever, a siamese cat, a lion, a tropical parrot, all posed heroically in a row against a dramatic dark gradient background, studio lighting, bold colors, thick white outline borders on each character, professional product photography style, wide 16:9 format, ultra high quality',
      // Banner 2 — Floating explosion  
      'Explosive burst of colorful die-cut magnet stickers floating through deep space — golden retriever, shih tzu, tropical fruits, wildlife animals, flowers, all flying outward from center against pure black cosmic background, neon glow accents, dynamic motion, 3D depth, ultra cinematic 16:9 wide shot, award winning digital art',
    ]

    const results = []
    for (let i = 0; i < prompts.length; i++) {
      try {
        const taskId = await generateBannerImage(prompts[i])
        results.push({ slot: i + 1, taskId, status: 'submitted', prompt: prompts[i] })
        // Small delay between requests
        if (i < prompts.length - 1) await sleep(2000)
      } catch (err: any) {
        results.push({ slot: i + 1, error: err.message })
      }
    }

    // Save task IDs to settings
    for (const r of results) {
      if (r.taskId) {
        await db.from('settings').upsert({
          key: `banner_image_task_${r.slot}`,
          value: r.taskId,
        }, { onConflict: 'key' })
      }
    }

    return NextResponse.json({ success: true, tasks: results })
  }

  if (body.action === 'animate') {
    const { imageUrl, slot = 1 } = body
    if (!imageUrl) return NextResponse.json({ error: 'imageUrl required' }, { status: 400 })

    const animPrompts = [
      'Cinematic camera slowly zooms in, sticker characters gently sway and bob, particles float upward, dramatic atmospheric lighting shifts',
      'Camera slowly pans left to right, stickers spin and rotate gently, cosmic particles drift outward, epic scale reveal',
    ]

    const taskId = await animateBannerToVideo(imageUrl, animPrompts[slot - 1] ?? animPrompts[0])

    const db2 = supabaseAdmin()
    await db2.from('settings').upsert({
      key: `banner_video_task_${slot}`,
      value: taskId,
    }, { onConflict: 'key' })

    return NextResponse.json({ success: true, taskId, slot, status: 'submitted' })
  }

  if (body.action === 'save') {
    // Save final URLs to settings
    const { slot, imageUrl, videoUrl } = body
    const db2 = supabaseAdmin()
    if (imageUrl) await db2.from('settings').upsert({ key: `banner_image_url_${slot}`, value: imageUrl }, { onConflict: 'key' })
    if (videoUrl) await db2.from('settings').upsert({ key: `banner_video_url_${slot}`, value: videoUrl }, { onConflict: 'key' })
    // Set active banner
    if (videoUrl) await db2.from('settings').upsert({ key: 'banner_video_url', value: videoUrl }, { onConflict: 'key' })
    return NextResponse.json({ success: true })
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
}

// GET /api/banner?taskId=xxx — check task status
export async function GET(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const taskId = req.nextUrl.searchParams.get('taskId')
  if (!taskId) return NextResponse.json({ error: 'taskId required' }, { status: 400 })

  const task = await getTaskStatus(taskId)
  const imageUrls = extractImageUrls(task)
  const videoUrl = extractVideoUrl(task)

  return NextResponse.json({ ...task, imageUrls, videoUrl })
}
