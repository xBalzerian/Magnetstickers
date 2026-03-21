// KIE API wrapper for Z-Image generation
const KIE_BASE = 'https://api.kie.ai'
const KIE_API_KEY = process.env.KIE_API_KEY!

export interface KieTask {
  taskId: string
  model: string
  state: 'waiting' | 'queuing' | 'generating' | 'success' | 'fail'
  resultJson?: string
  failMsg?: string
  costTime?: number
}

export interface GenerateImageParams {
  prompt: string
  aspect_ratio?: '1:1' | '4:3' | '3:4' | '16:9' | '9:16'
  nsfw_checker?: boolean
  callBackUrl?: string
}

// Submit image generation task
export async function generateImage(params: GenerateImageParams): Promise<string> {
  const res = await fetch(`${KIE_BASE}/api/v1/jobs/createTask`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${KIE_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'z-image',
      callBackUrl: params.callBackUrl,
      input: {
        prompt: params.prompt,
        aspect_ratio: params.aspect_ratio ?? '1:1',
        nsfw_checker: params.nsfw_checker ?? false,
      },
    }),
  })
  const data = await res.json()
  if (data.code !== 200) throw new Error(`KIE API error: ${data.msg}`)
  return data.data.taskId
}

// Poll task status
export async function getTaskStatus(taskId: string): Promise<KieTask> {
  const res = await fetch(`${KIE_BASE}/api/v1/jobs/recordInfo?taskId=${taskId}`, {
    headers: { 'Authorization': `Bearer ${KIE_API_KEY}` },
  })
  const data = await res.json()
  if (data.code !== 200) throw new Error(`KIE status error: ${data.msg}`)
  return data.data as KieTask
}

// Get result image URLs from a completed task
export function extractResultUrls(task: KieTask): string[] {
  if (!task.resultJson) return []
  try {
    const parsed = JSON.parse(task.resultJson)
    return parsed.resultUrls ?? []
  } catch {
    return []
  }
}

// Wait for task completion with polling (max 3 minutes)
export async function waitForTask(taskId: string, intervalMs = 5000): Promise<KieTask> {
  const maxAttempts = 36 // 3 min
  for (let i = 0; i < maxAttempts; i++) {
    const task = await getTaskStatus(taskId)
    if (task.state === 'success' || task.state === 'fail') return task
    await new Promise(r => setTimeout(r, intervalMs))
  }
  throw new Error(`Task ${taskId} timed out`)
}

// Check remaining KIE credits
export async function getCredits(): Promise<number> {
  const res = await fetch(`${KIE_BASE}/api/v1/chat/credit`, {
    headers: { 'Authorization': `Bearer ${KIE_API_KEY}` },
  })
  const data = await res.json()
  return data.data ?? 0
}
