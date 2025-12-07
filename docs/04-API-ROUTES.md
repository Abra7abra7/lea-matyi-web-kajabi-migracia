# 🔌 API Routes

## Prehľad API Endpointov

| Endpoint | Metóda | Účel | Auth |
|----------|--------|------|------|
| `/api/stripe/checkout` | POST | Vytvorenie platobnej session | ✅ |
| `/api/stripe/webhook` | POST | Stripe webhook handler | ❌ (Stripe signature) |
| `/api/stripe/portal` | POST | Customer Portal session | ✅ |
| `/api/video/token` | GET | Signed video token | ✅ + Course access |
| `/api/users/me` | GET | Aktuálny používateľ | ✅ |
| `/api/[...payload]/*` | * | Payload CMS API | Varies |

---

## 1. Stripe Checkout

Vytvorí Stripe Checkout Session pre nákup kurzu.

### Endpoint

```
POST /api/stripe/checkout
```

### Request Body

```json
{
  "courseId": "string"
}
```

### Response

```json
{
  "url": "https://checkout.stripe.com/c/pay/..."
}
```

### Implementácia

```typescript
// src/app/api/stripe/checkout/route.ts
import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import Stripe from 'stripe'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
})

export async function POST(request: Request) {
  try {
    const payload = await getPayload({ config: configPromise })
    const headersList = await headers()
    
    // 1. Overenie autentifikácie
    const { user } = await payload.auth({ headers: headersList })
    
    if (!user) {
      return NextResponse.json(
        { error: 'Musíte byť prihlásený' },
        { status: 401 }
      )
    }

    // 2. Získanie courseId z body
    const { courseId } = await request.json()

    if (!courseId) {
      return NextResponse.json(
        { error: 'Chýba courseId' },
        { status: 400 }
      )
    }

    // 3. Načítanie kurzu
    const course = await payload.findByID({
      collection: 'courses',
      id: courseId,
    })

    if (!course) {
      return NextResponse.json(
        { error: 'Kurz neexistuje' },
        { status: 404 }
      )
    }

    // 4. Kontrola, či už kurz nevlastní
    const purchasedCourses = (user.purchasedCourses as string[]) || []
    if (purchasedCourses.includes(courseId)) {
      return NextResponse.json(
        { error: 'Tento kurz už vlastníte' },
        { status: 400 }
      )
    }

    // 5. Vytvorenie Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      customer_email: user.email,
      line_items: [
        {
          price: course.priceId,
          quantity: 1,
        },
      ],
      metadata: {
        userId: user.id,
        courseId: courseId,
        userEmail: user.email,
      },
      invoice_creation: {
        enabled: true,
      },
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/kurzy/${course.slug}?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/kurzy/${course.slug}?canceled=true`,
      locale: 'sk',
      allow_promotion_codes: true,
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json(
      { error: 'Chyba pri vytváraní platby' },
      { status: 500 }
    )
  }
}
```

---

## 2. Stripe Webhook

Spracováva Stripe eventy po úspešnej platbe.

### Endpoint

```
POST /api/stripe/webhook
```

### Spracovávané Eventy

- `checkout.session.completed` - Úspešná platba
- `checkout.session.expired` - Expirovaná session
- `charge.refunded` - Refund

### Implementácia

```typescript
// src/app/api/stripe/webhook/route.ts
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { sendOrderConfirmationEmail } from '@/lib/resend'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
})

// DÔLEŽITÉ: Vypnúť body parsing pre webhook
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  const body = await request.text()
  const headersList = await headers()
  const signature = headersList.get('stripe-signature')

  if (!signature) {
    console.error('Missing Stripe signature')
    return NextResponse.json(
      { error: 'Missing signature' },
      { status: 400 }
    )
  }

  let event: Stripe.Event

  // 1. Verifikácia podpisu
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message)
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    )
  }

  // 2. Spracovanie eventu
  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session)
        break
        
      case 'checkout.session.expired':
        await handleCheckoutExpired(event.data.object as Stripe.Checkout.Session)
        break
        
      case 'charge.refunded':
        await handleRefund(event.data.object as Stripe.Charge)
        break
        
      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook processing error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}

// Handler pre úspešnú platbu
async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const payload = await getPayload({ config: configPromise })

  const userId = session.metadata?.userId
  const courseId = session.metadata?.courseId
  const customerEmail = session.customer_details?.email || session.metadata?.userEmail

  if (!userId || !courseId) {
    throw new Error('Missing userId or courseId in metadata')
  }

  // Kontrola duplicity
  const existingOrder = await payload.find({
    collection: 'orders',
    where: { stripeCheckoutId: { equals: session.id } },
  })

  if (existingOrder.docs.length > 0) {
    console.log('Order already processed:', session.id)
    return
  }

  // Získanie usera
  const user = await payload.findByID({
    collection: 'users',
    id: userId,
  })

  const existingCourses = (user.purchasedCourses as string[]) || []

  // Pridanie kurzu ak ešte nemá
  if (!existingCourses.includes(courseId)) {
    await payload.update({
      collection: 'users',
      id: userId,
      data: {
        purchasedCourses: [...existingCourses, courseId],
        stripeCustomerId: session.customer as string || user.stripeCustomerId,
      },
    })
  }

  // Získanie kurzu pre email
  const course = await payload.findByID({
    collection: 'courses',
    id: courseId,
  })

  // Vytvorenie objednávky
  await payload.create({
    collection: 'orders',
    data: {
      stripeCheckoutId: session.id,
      stripePaymentIntentId: session.payment_intent as string,
      amount: session.amount_total || 0,
      currency: session.currency || 'eur',
      user: userId,
      course: courseId,
      status: 'paid',
      customerEmail: customerEmail || undefined,
    },
  })

  // Odoslanie emailu
  if (customerEmail) {
    await sendOrderConfirmationEmail({
      to: customerEmail,
      courseTitle: course.title,
      courseSlug: course.slug,
      amount: session.amount_total || 0,
      currency: session.currency || 'eur',
    })
  }

  console.log(`✅ Order completed: User ${userId} -> Course ${courseId}`)
}

// Handler pre expirovanú session
async function handleCheckoutExpired(session: Stripe.Checkout.Session) {
  console.log(`Checkout session expired: ${session.id}`)
  // Voliteľné: odoslať email "Dokončite nákup"
}

// Handler pre refund
async function handleRefund(charge: Stripe.Charge) {
  const payload = await getPayload({ config: configPromise })

  // Nájsť objednávku podľa payment intent
  const orders = await payload.find({
    collection: 'orders',
    where: {
      stripePaymentIntentId: { equals: charge.payment_intent as string },
    },
  })

  if (orders.docs.length > 0) {
    const order = orders.docs[0]
    
    // Aktualizovať status
    await payload.update({
      collection: 'orders',
      id: order.id,
      data: { status: 'refunded' },
    })

    // Odobrať kurz userovi
    const user = await payload.findByID({
      collection: 'users',
      id: typeof order.user === 'string' ? order.user : order.user.id,
    })

    const courseId = typeof order.course === 'string' ? order.course : order.course.id
    const purchasedCourses = (user.purchasedCourses as string[]) || []
    
    await payload.update({
      collection: 'users',
      id: user.id,
      data: {
        purchasedCourses: purchasedCourses.filter(id => id !== courseId),
      },
    })

    console.log(`✅ Refund processed: Order ${order.id}`)
  }
}
```

---

## 3. Stripe Customer Portal

Umožní zákazníkovi spravovať faktúry a platobné údaje.

### Endpoint

```
POST /api/stripe/portal
```

### Implementácia

```typescript
// src/app/api/stripe/portal/route.ts
import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import Stripe from 'stripe'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
})

export async function POST() {
  try {
    const payload = await getPayload({ config: configPromise })
    const headersList = await headers()
    const { user } = await payload.auth({ headers: headersList })

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    if (!user.stripeCustomerId) {
      return NextResponse.json(
        { error: 'No Stripe customer found' },
        { status: 400 }
      )
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Portal error:', error)
    return NextResponse.json(
      { error: 'Failed to create portal session' },
      { status: 500 }
    )
  }
}
```

---

## 4. Video Token

Generuje signed token pre Cloudflare Stream.

### Endpoint

```
GET /api/video/token?videoId=xxx&courseId=xxx
```

### Response

```json
{
  "token": "eyJhbGciOiJSUzI1NiIsImtpZCI6IjEyMzQ1In0...",
  "expiresAt": 1702500000
}
```

### Implementácia

```typescript
// src/app/api/video/token/route.ts
import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { generateSignedToken } from '@/lib/cloudflare-stream'

export async function GET(request: Request) {
  try {
    const payload = await getPayload({ config: configPromise })
    const headersList = await headers()
    const { user } = await payload.auth({ headers: headersList })

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const videoId = searchParams.get('videoId')
    const courseId = searchParams.get('courseId')
    const isFree = searchParams.get('isFree') === 'true'

    if (!videoId || !courseId) {
      return NextResponse.json(
        { error: 'Missing videoId or courseId' },
        { status: 400 }
      )
    }

    // Kontrola prístupu (ak nie je bezplatná ukážka)
    if (!isFree) {
      const purchasedCourses = (user.purchasedCourses as string[]) || []
      const isAdmin = user.roles?.includes('admin')
      
      if (!purchasedCourses.includes(courseId) && !isAdmin) {
        return NextResponse.json(
          { error: 'Access denied' },
          { status: 403 }
        )
      }
    }

    // Generovanie tokenu
    const clientIP = headersList.get('x-forwarded-for')?.split(',')[0]
    const expiresIn = 6 * 60 * 60 // 6 hodín

    const token = generateSignedToken({
      videoId,
      expiresIn,
      clientIP: clientIP || undefined,
    })

    return NextResponse.json({
      token,
      expiresAt: Math.floor(Date.now() / 1000) + expiresIn,
    })
  } catch (error) {
    console.error('Video token error:', error)
    return NextResponse.json(
      { error: 'Failed to generate token' },
      { status: 500 }
    )
  }
}
```

---

## 5. User Me

Získanie aktuálne prihláseného používateľa.

### Endpoint

```
GET /api/users/me
```

### Response

```json
{
  "user": {
    "id": "123",
    "email": "user@example.com",
    "firstName": "John",
    "purchasedCourses": ["course-1", "course-2"],
    "roles": ["customer"]
  }
}
```

### Implementácia

```typescript
// src/app/api/users/me/route.ts
import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export async function GET() {
  try {
    const payload = await getPayload({ config: configPromise })
    const headersList = await headers()
    const { user } = await payload.auth({ headers: headersList })

    if (!user) {
      return NextResponse.json(
        { user: null },
        { status: 200 }
      )
    }

    // Vrátime len potrebné údaje (bez citlivých)
    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        purchasedCourses: user.purchasedCourses,
        roles: user.roles,
        avatar: user.avatar,
      },
    })
  } catch (error) {
    console.error('Me error:', error)
    return NextResponse.json(
      { error: 'Failed to get user' },
      { status: 500 }
    )
  }
}
```

---

## 🔐 Autentifikácia API Routes

Pre API routes používame Payload auth helper:

```typescript
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { headers } from 'next/headers'

export async function GET() {
  const payload = await getPayload({ config: configPromise })
  const headersList = await headers()
  
  // Payload automaticky číta JWT z cookies
  const { user } = await payload.auth({ headers: headersList })
  
  if (!user) {
    // Neprihlásený
  }
}
```

---

## 📝 Error Handling Pattern

```typescript
// Konzistentný error response
return NextResponse.json(
  { 
    error: 'Popis chyby pre frontend',
    code: 'ERROR_CODE', // Voliteľné
  },
  { status: 400 }
)

// Success response
return NextResponse.json({
  data: {...},
  message: 'Operácia úspešná', // Voliteľné
})
```

---

*API routes využívajú Next.js Route Handlers s Payload Local API.*

