import { NextRequest, NextResponse } from 'next/server'
import { generateBannerVideo, getTaskStatus, sleep } from '@/lib/kie'

// POST /api/banner — generate a hero banner video with Kling 3.0
// Body: { prompt: string, imageUrl?: string, poll?: boolean }
export async function POST(req: NextRequest) {
  const auth = req.headers.get('x-admin-secret')
  if (auth !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { prompt, imageUrl, poll = false } = await req.json()
  if (!prompt) return NextResponse.json({ error: 'prompt required' }, { status: 400 })

  const taskId = await generateBannerVideo({ prompt, imageUrl, duration: '5', mode: 'pro' })

  if (!poll) {
    return NextResponse.json({ taskId, status: 'submitted' })
  }

  // Poll up to 3 minutes
  for (let i = 0; i < 36; i++) {
    await sleep(5000)
    const task = await getTaskStatus(taskId)
    if (task.state === 'success') {
      const videoUrl = (task as any).video_url ?? null
      return NextResponse.json({ taskId, status: 'success', videoUrl })
    }
    if (task.state === 'fail') {
      return NextResponse.json({ taskId, status: 'fail', error: task.error })
    }
  }

  return NextResponse.json({ taskId, status: 'timeout' })
}

// GET /api/banner?taskId=xxx — check status
export async function GET(req: NextRequest) {
  const taskId = req.nextUrl.searchParams.get('taskId')
  if (!taskId) return NextResponse.json({ error: 'taskId required' }, { status: 400 })
  const task = await getTaskStatus(taskId)
  return NextResponse.json(task)
}
