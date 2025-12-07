import { NextRequest, NextResponse } from 'next/server'

/**
 * API endpoint pre získanie Cloudflare Stream upload URL
 * Používa TUS protokol pre resumable uploads
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, maxDurationSeconds = 7200 } = body

    const accountId = process.env.CLOUDFLARE_ACCOUNT_ID
    const apiToken = process.env.CLOUDFLARE_API_TOKEN

    if (!accountId || !apiToken) {
      return NextResponse.json(
        { error: 'Cloudflare credentials not configured' },
        { status: 500 }
      )
    }

    // Request direct upload URL from Cloudflare
    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/stream/direct_upload`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          maxDurationSeconds,
          meta: {
            name: name || 'Untitled Video',
            uploadedAt: new Date().toISOString(),
          },
          // Enable signed URLs for this video
          requireSignedURLs: true,
          // Allow downloads
          allowedOrigins: [
            process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
          ],
        }),
      }
    )

    if (!response.ok) {
      const errorData = await response.json()
      console.error('Cloudflare API error:', errorData)
      return NextResponse.json(
        { error: 'Failed to get upload URL from Cloudflare' },
        { status: 500 }
      )
    }

    const data = await response.json()

    if (!data.success || !data.result) {
      return NextResponse.json(
        { error: 'Invalid response from Cloudflare' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      uploadURL: data.result.uploadURL,
      videoId: data.result.uid,
    })
  } catch (error) {
    console.error('Upload URL error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

