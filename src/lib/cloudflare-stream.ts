import crypto from 'crypto'

interface SignedTokenOptions {
  videoId: string
  expiresIn?: number // sekundy, default 1 hodina
  allowedIp?: string
}

/**
 * Generuje podpísaný token pre Cloudflare Stream video
 * Toto zabezpečuje, že videá môžu byť prehrávané len oprávnenými používateľmi
 */
export async function generateSignedToken(options: SignedTokenOptions): Promise<string> {
  const {
    videoId,
    expiresIn = 3600, // 1 hodina
    allowedIp,
  } = options

  const keyId = process.env.CLOUDFLARE_STREAM_SIGNING_KEY_ID
  const privateKeyPem = process.env.CLOUDFLARE_STREAM_SIGNING_KEY_PEM

  if (!keyId || !privateKeyPem) {
    console.warn('Cloudflare Stream signing keys not configured')
    // Vrátime prázdny token - video nebude fungovať v produkcii
    return ''
  }

  // Header
  const header = {
    alg: 'RS256',
    kid: keyId,
  }

  // Payload
  const now = Math.floor(Date.now() / 1000)
  const payload: Record<string, any> = {
    sub: videoId,
    kid: keyId,
    exp: now + expiresIn,
    nbf: now - 60, // Platné od pred minútou (buffer pre časové rozdiely)
  }

  // Ak je špecifikovaná IP, pridaj obmedzenie
  if (allowedIp) {
    payload.accessRules = [
      {
        type: 'ip.src',
        action: 'allow',
        value: allowedIp,
      },
    ]
  }

  // Base64URL encode
  const base64UrlEncode = (data: string) => {
    return Buffer.from(data)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '')
  }

  const headerB64 = base64UrlEncode(JSON.stringify(header))
  const payloadB64 = base64UrlEncode(JSON.stringify(payload))
  const message = `${headerB64}.${payloadB64}`

  // Podpíš pomocou RSA
  const sign = crypto.createSign('RSA-SHA256')
  sign.update(message)
  const signature = sign.sign(
    privateKeyPem.replace(/\\n/g, '\n'),
    'base64'
  )
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '')

  return `${message}.${signature}`
}

/**
 * Získa Cloudflare Stream iframe URL
 */
export function getStreamIframeUrl(videoId: string, signedToken?: string): string {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID
  
  if (signedToken) {
    return `https://customer-${accountId}.cloudflarestream.com/${signedToken}/iframe`
  }
  
  return `https://customer-${accountId}.cloudflarestream.com/${videoId}/iframe`
}

/**
 * Získa Cloudflare Stream HLS URL
 */
export function getStreamHlsUrl(videoId: string, signedToken?: string): string {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID
  
  if (signedToken) {
    return `https://customer-${accountId}.cloudflarestream.com/${signedToken}/manifest/video.m3u8`
  }
  
  return `https://customer-${accountId}.cloudflarestream.com/${videoId}/manifest/video.m3u8`
}

/**
 * Získa thumbnail URL
 */
export function getStreamThumbnailUrl(videoId: string, time: number = 0): string {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID
  return `https://customer-${accountId}.cloudflarestream.com/${videoId}/thumbnails/thumbnail.jpg?time=${time}s`
}


