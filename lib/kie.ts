/**
 * KIE.ai API
 *
 * Create task:   POST /api/v1/jobs/createTask
 * Check status:  GET  /api/v1/jobs/recordInfo?taskId=xxx
 *
 * Models:
 *   Sticker designs  → "z-image"
 *   Banner images    → "nano-banana-2"
 *   Banner video     → "kling-2.6/image-to-video"
 */

const KIE_BASE = 'https://api.kie.ai'

function key() {
  const k = process.env.KIE_API_KEY
  if (!k) throw new Error('KIE_API_KEY not set')
  return k
}

function headers() {
  return {
    'Authorization': `Bearer ${key()}`,
    'Content-Type': 'application/json',
  }
}

// ─── CREATE TASK ──────────────────────────────────────────────────────────────
async function createTask(body: object): Promise<string> {
  const res = await fetch(`${KIE_BASE}/api/v1/jobs/createTask`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(body),
  })
  const json = await res.json()
  const taskId = json?.data?.taskId
  if (!taskId) throw new Error(`KIE createTask failed: ${JSON.stringify(json)}`)
  return taskId as string
}

// ─── GET TASK STATUS ──────────────────────────────────────────────────────────
export async function getTaskStatus(taskId: string): Promise<{
  state: string
  resultUrls?: string[]
  error?: string
  raw?: any
}> {
  const res = await fetch(
    `${KIE_BASE}/api/v1/jobs/recordInfo?taskId=${encodeURIComponent(taskId)}`,
    { headers: headers() }
  )
  const json = await res.json()
  const data = json?.data ?? {}

  let resultUrls: string[] = []
  if (data.resultJson) {
    try {
      const parsed = JSON.parse(data.resultJson)
      resultUrls = parsed?.resultUrls ?? []
    } catch {}
  }

  return {
    state: data.state ?? 'unknown',
    resultUrls,
    error: data.failMsg || undefined,
    raw: data,
  }
}

export function extractImageUrls(task: { resultUrls?: string[] }): string[] {
  return (task.resultUrls ?? []).filter(Boolean)
}

export function extractVideoUrl(task: { resultUrls?: string[] }): string | null {
  return task.resultUrls?.[0] ?? null
}

export function extractResultUrls(task: any): string[] {
  return task?.resultUrls ?? []
}

export function sleep(ms: number) { return new Promise(r => setTimeout(r, ms)) }

export async function pollUntilDone(taskId: string, maxMs = 300_000, intervalMs = 6000): Promise<any> {
  const deadline = Date.now() + maxMs
  while (Date.now() < deadline) {
    await sleep(intervalMs)
    const task = await getTaskStatus(taskId)
    if (task.state === 'success' || task.state === 'fail') return task
  }
  return { state: 'fail', error: 'timeout', resultUrls: [] }
}

// ─── Z-IMAGE — Sticker Generation ─────────────────────────────────────────────
// Key: z-image ALWAYS needs "transparent background" + "no background" + "sticker" framing
export async function generateStickerDesign(prompt: string, aspectRatio = '1:1'): Promise<string> {
  const fullPrompt = [
    prompt,
    'die-cut sticker design',
    'completely transparent background',
    'no background',
    'pure transparent PNG',
    'crisp white outline border around subject',
    'isolated subject only',
    'bold vibrant colors',
    'professional kawaii illustration',
    'clean sharp edges',
    'print-ready sticker',
    'no shadow behind subject',
    'no floor no ground no scene',
  ].join(', ')

  return createTask({
    model: 'z-image',
    input: {
      prompt: fullPrompt,
      aspect_ratio: aspectRatio,
      nsfw_checker: false,
    },
  })
}

// ─── NANO BANANA 2 — Banner Image ─────────────────────────────────────────────
export async function generateBannerImage(prompt: string, aspectRatio = '16:9'): Promise<string> {
  return createTask({
    model: 'nano-banana-2',
    input: { prompt, aspect_ratio: aspectRatio, resolution: '4K', output_format: 'jpg' },
  })
}

// ─── KLING 2.6 — Animate Banner ───────────────────────────────────────────────
export async function animateBannerToVideo(imageUrl: string, prompt: string): Promise<string> {
  return createTask({
    model: 'kling-2.6/image-to-video',
    input: { prompt, image_urls: [imageUrl], duration: '5', sound: false },
  })
}

// Legacy alias
export async function generateImage(params: {
  prompt: string
  aspect_ratio?: string
  nsfw_checker?: boolean
}): Promise<string> {
  return generateStickerDesign(params.prompt, params.aspect_ratio ?? '1:1')
}
