import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { generateImage, getTaskStatus, extractResultUrls } from '@/lib/kie'
import { slugify, sleep } from '@/lib/utils'

// POST /api/generate — trigger a batch of designs
// Body: { batchId: string } or { categoryId, prompts: string[], batchName: string }
export async function POST(req: NextRequest) {
  // Protect with admin secret
  const auth = req.headers.get('x-admin-secret')
  if (auth !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const db = supabaseAdmin()

    let batchId = body.batchId
    let prompts: string[] = []
    let categoryId: string = body.categoryId

    if (!batchId) {
      // Create new batch
      const { data: batch } = await db.from('batches').insert({
        name: body.batchName ?? `Batch ${new Date().toISOString()}`,
        category_id: categoryId,
        prompts: body.prompts,
        total: body.prompts.length,
        generated: 0,
        failed: 0,
        status: 'running',
      }).select().single()
      batchId = batch!.id
      prompts = body.prompts
    } else {
      const { data: batch } = await db.from('batches').select('*').eq('id', batchId).single()
      if (!batch) return NextResponse.json({ error: 'Batch not found' }, { status: 404 })
      prompts = batch.prompts as string[]
      categoryId = batch.category_id
      await db.from('batches').update({ status: 'running' }).eq('id', batchId)
    }

    // Process prompts — max 10 per run, 8s delay between
    const BATCH_SIZE = 10
    const toProcess = prompts.slice(0, BATCH_SIZE)
    let generated = 0, failed = 0

    for (const prompt of toProcess) {
      try {
        // Create design record
        const { data: design } = await db.from('designs').insert({
          category_id: categoryId,
          batch_id: batchId,
          prompt_used: prompt,
          status: 'generating',
        }).select().single()

        // Submit to KIE
        const taskId = await generateImage({ prompt, aspect_ratio: '1:1', nsfw_checker: false })
        await db.from('designs').update({ kie_task_id: taskId }).eq('id', design!.id)

        // Poll for result (up to 90 seconds)
        let attempts = 0
        let imageUrl: string | null = null
        while (attempts < 18) {
          await sleep(5000)
          const task = await getTaskStatus(taskId)
          if (task.state === 'success') {
            const urls = extractResultUrls(task)
            imageUrl = urls[0] ?? null
            break
          }
          if (task.state === 'fail') break
          attempts++
        }

        if (imageUrl) {
          await db.from('designs').update({ image_url: imageUrl, status: 'generated' }).eq('id', design!.id)
          generated++
        } else {
          await db.from('designs').update({ status: 'rejected' }).eq('id', design!.id)
          failed++
        }

        await sleep(3000) // 3s between requests
      } catch (err) {
        console.error('Design generation failed:', err)
        failed++
      }
    }

    const remaining = prompts.length - toProcess.length
    await db.from('batches').update({
      generated, failed,
      status: remaining > 0 ? 'pending' : 'completed',
    }).eq('id', batchId)

    return NextResponse.json({ success: true, batchId, generated, failed, remaining })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
