/**
 * Background removal using KIE's z-image model
 * Strategy: prompt the image as "isolated on transparent background"
 * For API-based removal, we use remove.bg if key is available,
 * otherwise fall back to serving the original z-image URL
 * (z-image already generates on transparent/white bg for stickers)
 */

export async function removeBackground(imageUrl: string): Promise<string> {
  const apiKey = process.env.REMOVEBG_API_KEY
  
  // If no remove.bg key, return original (z-image already has clean bg)
  if (!apiKey) {
    console.log('[removebg] No REMOVEBG_API_KEY — using original image')
    return imageUrl
  }

  try {
    const formData = new FormData()
    formData.append('image_url', imageUrl)
    formData.append('size', 'auto')

    const res = await fetch('https://api.remove.bg/v1.0/removebg', {
      method: 'POST',
      headers: { 'X-Api-Key': apiKey },
      body: formData,
    })

    if (!res.ok) {
      const err = await res.text()
      console.error('[removebg] API error:', err)
      return imageUrl // fallback
    }

    // Returns binary PNG — convert to base64 data URL
    const buffer = await res.arrayBuffer()
    const base64 = Buffer.from(buffer).toString('base64')
    return `data:image/png;base64,${base64}`
  } catch (err) {
    console.error('[removebg] Failed:', err)
    return imageUrl // always fallback gracefully
  }
}

/**
 * Process a batch of image URLs — returns array of processed URLs
 * Rate-limited to avoid hitting API limits
 */
export async function removeBackgroundBatch(
  imageUrls: string[],
  delayMs = 500
): Promise<string[]> {
  const results: string[] = []
  for (const url of imageUrls) {
    const processed = await removeBackground(url)
    results.push(processed)
    if (delayMs > 0) await new Promise(r => setTimeout(r, delayMs))
  }
  return results
}
