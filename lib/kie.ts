// KIE Z-Image API wrapper for generating die-cut magnet sticker designs
const KIE_BASE = 'https://api.kie.ai'
const KEY = process.env.KIE_API_KEY!

export async function generateImage(params: {
  prompt: string
  aspect_ratio?: string
  negative_prompt?: string
  nsfw_checker?: boolean
}): Promise<string> {
  const res = await fetch(`${KIE_BASE}/api/v1/image/generation`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'flux-schnell',
      prompt: params.prompt,
      negative_prompt: params.negative_prompt ?? 'watermark, signature, text, blurry, low quality, dark background, busy background, complex background',
      aspect_ratio: params.aspect_ratio ?? '1:1',
      nsfw_checker: params.nsfw_checker ?? false,
      num_images: 1,
    }),
  })
  const data = await res.json()
  if (!data.task_id) throw new Error(`KIE generation failed: ${JSON.stringify(data)}`)
  return data.task_id as string
}

export async function getTaskStatus(taskId: string): Promise<{
  state: 'pending' | 'processing' | 'success' | 'fail'
  images?: { url: string }[]
  error?: string
}> {
  const res = await fetch(`${KIE_BASE}/api/v1/image/generation/${taskId}`, {
    headers: { 'Authorization': `Bearer ${KEY}` },
  })
  return res.json()
}

export function extractResultUrls(task: { images?: { url: string }[] }): string[] {
  return (task.images ?? []).map(img => img.url).filter(Boolean)
}
