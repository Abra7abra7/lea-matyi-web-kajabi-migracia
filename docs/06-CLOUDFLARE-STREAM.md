# 📹 Cloudflare Stream Integrácia

## Prehľad

Cloudflare Stream poskytuje:
- Bezpečný video hosting
- Adaptívne streamovanie (HLS)
- Signed URLs pre ochranu obsahu
- Globálne CDN

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Upload    │────▶│  Cloudflare │────▶│   Player    │
│   (Admin)   │     │   Stream    │     │  (Signed)   │
└─────────────┘     └─────────────┘     └─────────────┘
```

---

## 1. Cloudflare Setup

### Krok 1: Účet a Stream

1. Registrácia na [cloudflare.com](https://cloudflare.com)
2. Dashboard → Stream
3. Zapnúť Stream (pay-as-you-go)

### Krok 2: API Credentials

**Account ID:**
- Dashboard → pravý sidebar → Account ID

**API Token:**
1. My Profile → API Tokens
2. Create Token
3. Template: "Edit Cloudflare Stream"
4. Permissions: Stream:Edit
5. Skopírovať token

### Krok 3: Signing Keys (Pre Signed URLs)

1. Stream → Settings → Signing Keys
2. Generate signing keys
3. Skopírovať:
   - **Key ID** (napr. `abc123def456`)
   - **Private Key** (RSA PEM formát)

---

## 2. Environment Variables

```env
# .env.local

# Cloudflare Account
CLOUDFLARE_ACCOUNT_ID=xxx

# API Token pre upload
CLOUDFLARE_API_TOKEN=xxx

# Signing Keys pre Signed URLs
CLOUDFLARE_STREAM_KEY_ID=xxx
CLOUDFLARE_STREAM_PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----
MIIEpQIBAAKCAQEA0Z3VS5JJcds3xfn/ygWyF8PbnGy0AHE7MZCqSGGRIU3veOlE
...celý kľúč na jednom riadku s \n...
-----END RSA PRIVATE KEY-----"
```

**⚠️ DÔLEŽITÉ:** Private key musí byť na jednom riadku s `\n` escape znakmi, alebo použite `"` a reálne nové riadky.

---

## 3. Video Upload (Admin)

### Manuálny Upload cez Dashboard

1. Stream → Videos → Upload
2. Drag & drop video
3. Po spracovaní skopírovať **Video ID**
4. Video ID vložiť do Payload CMS (pole `videoCloudflareId`)

### Programatický Upload (Voliteľné)

```typescript
// src/lib/cloudflare-upload.ts
interface UploadResponse {
  result: {
    uid: string
    thumbnail: string
    playback: {
      hls: string
      dash: string
    }
  }
}

export async function uploadVideoToCloudflare(
  file: File
): Promise<string> {
  const formData = new FormData()
  formData.append('file', file)

  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/stream`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`,
      },
      body: formData,
    }
  )

  const data: UploadResponse = await response.json()
  
  if (!response.ok) {
    throw new Error('Failed to upload video')
  }

  return data.result.uid // Video ID
}
```

---

## 4. Signed Token Generation

### Signing Function

```typescript
// src/lib/cloudflare-stream.ts
import crypto from 'crypto'

interface SignedTokenOptions {
  videoId: string
  expiresIn?: number // sekundy, default 6 hodín
  clientIP?: string  // voliteľné viazanie na IP
}

export function generateSignedToken({
  videoId,
  expiresIn = 21600, // 6 hodín
  clientIP,
}: SignedTokenOptions): string {
  const keyId = process.env.CLOUDFLARE_STREAM_KEY_ID!
  const privateKeyPem = process.env.CLOUDFLARE_STREAM_PRIVATE_KEY!
    .replace(/\\n/g, '\n') // Konverzia escape sequences

  // Expiration timestamp
  const exp = Math.floor(Date.now() / 1000) + expiresIn

  // JWT Header
  const header = {
    alg: 'RS256',
    kid: keyId,
  }

  // JWT Payload
  const payload: Record<string, any> = {
    sub: videoId,   // Video ID
    kid: keyId,     // Key ID
    exp: exp,       // Expiration
    // Access rules
    accessRules: [
      {
        type: 'any',
        action: 'allow',
      },
    ],
  }

  // Voliteľné: Viazanie na IP adresu
  if (clientIP) {
    payload.accessRules = [
      {
        type: 'ip.src',
        action: 'allow',
        ip: [clientIP],
      },
    ]
  }

  // Encode header and payload
  const encodedHeader = base64UrlEncode(JSON.stringify(header))
  const encodedPayload = base64UrlEncode(JSON.stringify(payload))

  // Sign
  const signatureInput = `${encodedHeader}.${encodedPayload}`
  const sign = crypto.createSign('RSA-SHA256')
  sign.update(signatureInput)
  const signature = sign.sign(privateKeyPem)
  const encodedSignature = base64UrlEncode(signature)

  return `${encodedHeader}.${encodedPayload}.${encodedSignature}`
}

function base64UrlEncode(data: string | Buffer): string {
  const base64 = Buffer.isBuffer(data) 
    ? data.toString('base64')
    : Buffer.from(data).toString('base64')
  
  return base64
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')
}

// Utility: Verifikácia či video existuje
export async function getVideoDetails(videoId: string) {
  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/stream/${videoId}`,
    {
      headers: {
        'Authorization': `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`,
      },
    }
  )

  if (!response.ok) {
    return null
  }

  const data = await response.json()
  return data.result
}
```

---

## 5. Video Player Component

### Server Component (Token Generation)

```typescript
// src/app/(frontend)/kurzy/[slug]/lekcia/[moduleIndex]/[lessonIndex]/page.tsx
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { generateSignedToken } from '@/lib/cloudflare-stream'
import { VideoPlayer } from '@/components/video/VideoPlayer'

interface Props {
  params: {
    slug: string
    moduleIndex: string
    lessonIndex: string
  }
}

export default async function LessonPage({ params }: Props) {
  const payload = await getPayload({ config: configPromise })
  const headersList = await headers()
  const { user } = await payload.auth({ headers: headersList })

  // 1. Overenie prihlásenia
  if (!user) {
    redirect(`/login?redirect=/kurzy/${params.slug}`)
  }

  // 2. Načítanie kurzu
  const courses = await payload.find({
    collection: 'courses',
    where: { slug: { equals: params.slug } },
    limit: 1,
  })

  const course = courses.docs[0]
  if (!course) redirect('/404')

  // 3. Získanie lekcie
  const moduleIndex = parseInt(params.moduleIndex)
  const lessonIndex = parseInt(params.lessonIndex)
  const module = course.modules?.[moduleIndex]
  const lesson = module?.lessons?.[lessonIndex]

  if (!lesson) redirect(`/kurzy/${params.slug}`)

  // 4. Kontrola prístupu
  const purchasedCourses = (user.purchasedCourses as string[]) || []
  const hasAccess = purchasedCourses.includes(course.id)
  const isFreeLesson = lesson.isFree
  const isAdmin = user.roles?.includes('admin')

  if (!hasAccess && !isFreeLesson && !isAdmin) {
    redirect(`/kurzy/${params.slug}?access=denied`)
  }

  // 5. Generovanie signed tokenu
  let signedToken: string | null = null
  if (lesson.videoCloudflareId) {
    const clientIP = headersList.get('x-forwarded-for')?.split(',')[0]
    signedToken = generateSignedToken({
      videoId: lesson.videoCloudflareId,
      expiresIn: 6 * 60 * 60, // 6 hodín
      clientIP: clientIP || undefined,
    })
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-muted-foreground mb-4">
        <span>{course.title}</span>
        <span className="mx-2">/</span>
        <span>{module.title}</span>
      </nav>

      {/* Video */}
      {signedToken && lesson.videoCloudflareId && (
        <div className="mb-8">
          <VideoPlayer
            videoId={lesson.videoCloudflareId}
            token={signedToken}
          />
        </div>
      )}

      {/* Lesson Title */}
      <h1 className="text-3xl font-bold mb-4">{lesson.title}</h1>

      {/* Content */}
      {lesson.content && (
        <div className="prose dark:prose-invert max-w-none">
          {/* Rich text rendering */}
        </div>
      )}

      {/* Resources */}
      {lesson.resources && lesson.resources.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4">Materiály na stiahnutie</h3>
          <div className="space-y-2">
            {/* Resource links */}
          </div>
        </div>
      )}

      {/* Navigation */}
      <LessonNavigation
        course={course}
        currentModule={moduleIndex}
        currentLesson={lessonIndex}
      />
    </div>
  )
}
```

### Client Component (Player)

```typescript
// src/components/video/VideoPlayer.tsx
'use client'

import { Stream } from '@cloudflare/stream-react'
import { useState, useCallback } from 'react'
import { Skeleton } from '@/components/ui/skeleton'

interface VideoPlayerProps {
  videoId: string
  token: string
  poster?: string
  onProgress?: (percent: number) => void
}

export function VideoPlayer({ 
  videoId, 
  token, 
  poster,
  onProgress 
}: VideoPlayerProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const handleLoadedData = useCallback(() => {
    setIsLoading(false)
  }, [])

  const handleError = useCallback(() => {
    setError('Video sa nepodarilo načítať')
    setIsLoading(false)
  }, [])

  const handleTimeUpdate = useCallback((e: any) => {
    if (onProgress && e.target) {
      const video = e.target
      const percent = (video.currentTime / video.duration) * 100
      onProgress(percent)
    }
  }, [onProgress])

  if (error) {
    return (
      <div className="aspect-video bg-muted rounded-xl flex items-center justify-center">
        <p className="text-muted-foreground">{error}</p>
      </div>
    )
  }

  return (
    <div className="relative aspect-video bg-black rounded-xl overflow-hidden">
      {isLoading && (
        <Skeleton className="absolute inset-0" />
      )}
      
      <Stream
        src={videoId}
        signedToken={token}
        controls
        responsive
        preload="auto"
        poster={poster}
        onLoadedData={handleLoadedData}
        onError={handleError}
        onTimeUpdate={handleTimeUpdate}
        className="w-full h-full"
        // Zabránenie sťahovaniu
        streamRef={(ref) => {
          if (ref) {
            ref.setAttribute('controlsList', 'nodownload')
            ref.setAttribute('disablePictureInPicture', 'true')
          }
        }}
      />
    </div>
  )
}
```

---

## 6. Ochrana Obsahu

### Signed URLs Výhody

| Ochrana | Popis |
|---------|-------|
| **Časová expirácia** | Token platí len určitý čas (6h) |
| **IP viazanie** | Voliteľne viazané na IP |
| **Nemožnosť zdieľania** | Link nefunguje bez tokenu |
| **Nemožnosť sťahovania** | HLS stream nie je jednoducho stiahnuteľný |

### Dodatočné Zabezpečenie

```typescript
// V VideoPlayer komponente
<Stream
  // Vypnutie download tlačidla
  streamRef={(ref) => {
    ref?.setAttribute('controlsList', 'nodownload')
    ref?.setAttribute('disablePictureInPicture', 'true')
  }}
/>
```

```css
/* globals.css - Zabránenie right-click na video */
video {
  pointer-events: auto;
}

video::-webkit-media-controls-enclosure {
  /* Custom styling */
}
```

---

## 7. Video Processing Status

Po uploade Cloudflare video spracováva. Môžete kontrolovať stav:

```typescript
// Kontrola či je video ready
export async function isVideoReady(videoId: string): Promise<boolean> {
  const video = await getVideoDetails(videoId)
  return video?.readyToStream === true
}

// Stav spracovania
// video.status.state: 'queued' | 'inprogress' | 'ready' | 'error'
```

---

## 8. Thumbnail Generation

Cloudflare automaticky generuje thumbnaily:

```typescript
// Thumbnail URL
const thumbnailUrl = `https://customer-${CLOUDFLARE_ACCOUNT_ID}.cloudflarestream.com/${videoId}/thumbnails/thumbnail.jpg`

// S časom
const thumbnailAtTime = `https://customer-xxx.cloudflarestream.com/${videoId}/thumbnails/thumbnail.jpg?time=10s`
```

---

## 9. Analytics (Voliteľné)

```typescript
// Dashboard → Stream → Analytics

// Alebo API
const analytics = await fetch(
  `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/stream/analytics/views?dimensions=videoId`,
  {
    headers: {
      'Authorization': `Bearer ${API_TOKEN}`,
    },
  }
)
```

---

## 10. Pricing

| Služba | Cena |
|--------|------|
| Storage | $5 / 1000 min uloženého videa |
| Streaming | $1 / 1000 min prehrávania |

**Príklad:** 10h kurz (600 min) = $3/mesiac storage + streaming podľa zhliadnutí

---

## 📋 Checklist

- [ ] Cloudflare účet vytvorený
- [ ] Stream aktivovaný
- [ ] API Token vygenerovaný
- [ ] Signing Keys vytvorené
- [ ] Environment variables nastavené
- [ ] Test upload videa
- [ ] Signed URL funguje
- [ ] Player komponent otestovaný

---

*Cloudflare Stream pre bezpečné a škálovateľné video streamovanie.*


