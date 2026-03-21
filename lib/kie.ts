/**
 * KIE.ai API wrapper
 * - Nano Banana 2 (Google Gemini 3.1 Flash Image) — for product design generation
 * - Kling 3.0 — for hero banner video animation only
 */

const KIE_BASE = 'https://api.kie.ai'
const KEY = process.env.KIE_API_KEY!

function headers() {
  return {
    'Authorization': `Bearer ${KEY}`,
    'Content-Type': 'application/json',
  }
}

// ─── TASK STATUS (universal) ───────────────────────────────────────────────
export async function getTaskStatus(taskId: string): Promise<{
  state: 'pending' | 'processing' | 'success' | 'fail'
  images?: { url: string }[]
  video_url?: string
  error?: string
}> {
  const res = await fetch(`${KIE_BASE}/api/v1/task/${taskId}`, { headers: headers() })
  if (!res.ok) {
    const alt = await fetch(`${KIE_BASE}/api/v1/image/generation/${taskId}`, { headers: headers() })
    return alt.json()
  }
  return res.json()
}

export function extractResultUrls(task: { images?: { url: string }[] }): string[] {
  return (task.images ?? []).map(img => img.url).filter(Boolean)
}

export async function sleep(ms: number) { return new Promise(r => setTimeout(r, ms)) }

// ─── NANO BANANA 2 — Product Design Generation ────────────────────────────
// Printful die-cut magnet specs:
//   - PNG with transparent background
//   - 150+ DPI, minimum ~1500×1500px at final size
//   - White 2mm stroke outline (die-cut line)
//   - No background — subject only
//   - Vibrant, bold, cartoon/illustration style
export async function generateImage(params: {
  prompt: string
  aspect_ratio?: string
  negative_prompt?: string
  nsfw_checker?: boolean
}): Promise<string> {
  // Printful-optimized prompt wrapping
  const printfulPrompt = `${params.prompt}, die-cut sticker style, white outline border, transparent background, no background, isolated subject, bold vibrant colors, cartoon illustration, high detail, clean lines, suitable for printing on vinyl magnet`

  const res = await fetch(`${KIE_BASE}/api/v1/jobs/createTask`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({
      model: 'google-nano-banana-2',
      input: {
        prompt: printfulPrompt,
        aspect_ratio: params.aspect_ratio ?? '1:1',
        resolution: '2K',
        output_format: 'png',
      },
    }),
  })
  const data = await res.json()
  if (!data.task_id) throw new Error(`Nano Banana 2 task failed: ${JSON.stringify(data)}`)
  return data.task_id as string
}

// ─── KLING 3.0 — Hero Banner Video (one-time, cached) ────────────────────
// Use only for the homepage banner animation — expensive, generate once & cache
export async function generateBannerVideo(params: {
  prompt: string
  imageUrl?: string   // optional first-frame reference
  duration?: '5' | '10'
  mode?: 'std' | 'pro'
}): Promise<string> {
  const body: Record<string, unknown> = {
    model: 'kling-3.0',
    input: {
      prompt: params.prompt,
      duration: params.duration ?? '5',
      aspect_ratio: '16:9',
      mode: params.mode ?? 'pro',
      multi_shots: false,
      sound: false,
    },
  }
  if (params.imageUrl) {
    (body.input as Record<string, unknown>).image_urls = [params.imageUrl]
  }

  const res = await fetch(`${KIE_BASE}/api/v1/jobs/createTask`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(body),
  })
  const data = await res.json()
  if (!data.task_id) throw new Error(`Kling 3.0 task failed: ${JSON.stringify(data)}`)
  return data.task_id as string
}

// Poll a task until complete
export async function pollTask(taskId: string, maxAttempts = 30, intervalMs = 5000): Promise<string | null> {
  for (let i = 0; i < maxAttempts; i++) {
    await sleep(intervalMs)
    const task = await getTaskStatus(taskId)
    if (task.state === 'success') {
      if (task.images?.[0]?.url) return task.images[0].url
      if (task.video_url) return task.video_url
    }
    if (task.state === 'fail') return null
  }
  return null
}
