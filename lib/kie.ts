/**
 * KIE.ai API — confirmed from docs
 * 
 * Sticker designs  → z-image  (model: "z-image")
 * Banner images    → google-nano-banana-2  (model: "google-nano-banana-2")  
 * Banner video     → kling-2.6/image-to-video  (one-time, cached)
 * 
 * All via POST /api/v1/jobs/createTask
 * Status via GET  /api/v1/task/{taskId}
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

async function createTask(body: object): Promise<string> {
  const res = await fetch(`${KIE_BASE}/api/v1/jobs/createTask`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(body),
  })
  const data = await res.json()
  // Response: { code: 200, msg: "success", data: { taskId: "..." } }
  const taskId = data?.data?.taskId ?? data?.task_id
  if (!taskId) throw new Error(`KIE createTask failed: ${JSON.stringify(data)}`)
  return taskId as string
}

// ─── TASK STATUS ─────────────────────────────────────────────────────────────
export async function getTaskStatus(taskId: string): Promise<{
  state: 'pending' | 'processing' | 'success' | 'fail'
  images?: { url: string }[]
  video_url?: string
  works?: { resource?: { resource: string } }[]
  error?: string
}> {
  const res = await fetch(`${KIE_BASE}/api/v1/task/${taskId}`, {
    headers: headers(),
  })
  const data = await res.json()
  // Normalize: KIE wraps in data.data
  return data?.data ?? data
}

export function extractImageUrls(task: any): string[] {
  // z-image / nano banana return images array
  if (task?.images?.length) return task.images.map((i: any) => i.url ?? i).filter(Boolean)
  // Some models return works array
  if (task?.works?.length) return task.works.map((w: any) => w.resource?.resource).filter(Boolean)
  return []
}

export function extractVideoUrl(task: any): string | null {
  return task?.video_url ?? task?.works?.[0]?.resource?.resource ?? null
}

export async function sleep(ms: number) { return new Promise(r => setTimeout(r, ms)) }

export async function pollUntilDone(taskId: string, maxMs = 180_000, intervalMs = 5000): Promise<any> {
  const deadline = Date.now() + maxMs
  while (Date.now() < deadline) {
    await sleep(intervalMs)
    const task = await getTaskStatus(taskId)
    if (task.state === 'success' || task.state === 'fail') return task
  }
  return { state: 'fail', error: 'timeout' }
}

// ─── Z-IMAGE — Sticker Design Generation ─────────────────────────────────────
// Printful die-cut magnet spec:
//   PNG, transparent BG, isolated subject, white 2mm outline, 150+ DPI
export async function generateStickerDesign(prompt: string, aspectRatio = '1:1'): Promise<string> {
  const printfulPrompt = `${prompt}, die-cut sticker, crisp white outline border, completely transparent background, isolated subject only, bold vibrant colors, professional illustration style, clean sharp edges, print-ready quality for vinyl magnet production`

  return createTask({
    model: 'z-image',
    input: {
      prompt: printfulPrompt,
      aspect_ratio: aspectRatio,
      nsfw_checker: false,
    },
  })
}

// ─── NANO BANANA 2 — Banner Image Generation ──────────────────────────────────
// Used ONLY for hero banner imagery (generate once, cached)
export async function generateBannerImage(prompt: string, aspectRatio = '16:9'): Promise<string> {
  return createTask({
    model: 'google-nano-banana-2',
    input: {
      prompt,
      aspect_ratio: aspectRatio,
      resolution: '4K',
      output_format: 'jpg',
    },
  })
}

// ─── KLING 2.6 IMAGE-TO-VIDEO — Banner Animation ─────────────────────────────
// Takes a banner image and animates it into a cinematic looping video
export async function animateBannerToVideo(imageUrl: string, prompt: string): Promise<string> {
  return createTask({
    model: 'kling-2.6/image-to-video',
    input: {
      prompt,
      image_urls: [imageUrl],
      duration: '5',
      sound: false,
    },
  })
}

// Legacy compat — used in existing /api/generate route
export async function generateImage(params: {
  prompt: string
  aspect_ratio?: string
  nsfw_checker?: boolean
}): Promise<string> {
  return generateStickerDesign(params.prompt, params.aspect_ratio ?? '1:1')
}
