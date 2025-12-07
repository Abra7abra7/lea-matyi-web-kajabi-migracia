import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { verifyWebhookSignature } from '@/lib/stripe'
import { getPayloadClient } from '@/lib/payload'
import { sendPurchaseConfirmationEmail, sendWelcomeEmail } from '@/lib/email'
import type Stripe from 'stripe'
import crypto from 'crypto'

export async function POST(request: Request) {
  const body = await request.text()
  const headersList = await headers()
  const signature = headersList.get('stripe-signature')

  if (!signature) {
    return NextResponse.json(
      { error: 'Chýba Stripe signature' },
      { status: 400 }
    )
  }

  let event: Stripe.Event

  try {
    event = verifyWebhookSignature(body, signature)
  } catch (error) {
    console.error('Webhook signature verification failed:', error)
    return NextResponse.json(
      { error: 'Neplatná signature' },
      { status: 400 }
    )
  }

  // Spracuj event
  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session)
        break

      case 'payment_intent.succeeded':
        console.log('Payment succeeded:', event.data.object.id)
        break

      case 'payment_intent.payment_failed':
        console.log('Payment failed:', event.data.object.id)
        break

      default:
        console.log('Unhandled event type:', event.type)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook handler error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}

/**
 * Generuj náhodné heslo
 */
function generatePassword(): string {
  return crypto.randomBytes(12).toString('base64').slice(0, 16)
}

/**
 * Spracuje úspešný checkout
 */
async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const { courseId, courseSlug, userId } = session.metadata || {}
  const customerEmail = session.customer_email || session.customer_details?.email

  if (!courseId) {
    console.error('Missing courseId in checkout session metadata')
    return
  }

  if (!customerEmail) {
    console.error('Missing customer email in checkout session')
    return
  }

  const payload = await getPayloadClient()
  let user: any = null
  let isNewUser = false
  let generatedPassword: string | null = null

  // Ak máme userId, použijeme ho
  if (userId) {
    try {
      user = await payload.findByID({
        collection: 'users',
        id: userId,
        depth: 0,
      })
    } catch (e) {
      console.log('User not found by ID, will search by email')
    }
  }

  // Ak nemáme používateľa, hľadáme podľa emailu
  if (!user) {
    const existingUsers = await payload.find({
      collection: 'users',
      where: {
        email: { equals: customerEmail },
      },
      limit: 1,
    })

    if (existingUsers.docs.length > 0) {
      user = existingUsers.docs[0]
    }
  }

  // Ak stále nemáme používateľa, vytvoríme nového
  if (!user) {
    isNewUser = true
    generatedPassword = generatePassword()
    
    try {
      user = await payload.create({
        collection: 'users',
        data: {
          email: customerEmail,
          password: generatedPassword,
          firstName: session.customer_details?.name?.split(' ')[0] || '',
          lastName: session.customer_details?.name?.split(' ').slice(1).join(' ') || '',
          role: 'customer',
          stripeCustomerId: session.customer as string,
          purchasedCourses: [courseId],
        },
      })
      console.log(`Created new user: ${customerEmail}`)
    } catch (createError) {
      console.error('Failed to create user:', createError)
      return
    }
  } else {
    // Existujúci používateľ - pridaj kurz
    const purchasedCourses = (user.purchasedCourses as any[]) || []
    const courseIds = purchasedCourses.map((c: any) => typeof c === 'object' ? c.id : c)
    
    if (!courseIds.includes(courseId)) {
      await payload.update({
        collection: 'users',
        id: user.id,
        data: {
          purchasedCourses: [...courseIds, courseId],
          stripeCustomerId: session.customer as string,
        },
      })
    }
  }

  // Získaj kurz
  const course = await payload.findByID({
    collection: 'courses',
    id: courseId,
    depth: 0,
  })

  // Vytvor objednávku
  const order = await payload.create({
    collection: 'orders',
    data: {
      customer: user.id,
      customerEmail: customerEmail,
      course: courseId,
      total: (session.amount_total || 0) / 100,
      currency: (session.currency || 'EUR').toUpperCase(),
      status: 'paid',
      stripeCheckoutSessionId: session.id,
      stripePaymentIntentId: session.payment_intent as string,
    },
  })

  console.log(`Order ${order.id} created for ${customerEmail}, course ${courseId}`)

  // Odoslať emaily
  try {
    // Ak je nový používateľ, pošleme welcome email s heslom
    if (isNewUser && generatedPassword) {
      await sendWelcomeEmail({
        to: customerEmail,
        customerName: user.firstName || 'Zákazník',
        temporaryPassword: generatedPassword,
        loginUrl: `${process.env.NEXT_PUBLIC_APP_URL}/prihlasenie`,
      })
      console.log(`Welcome email sent to new user ${customerEmail}`)
    }

    // Potvrdenie nákupu
    await sendPurchaseConfirmationEmail({
      to: customerEmail,
      customerName: user.firstName || 'Zákazník',
      courseId: courseId,
      userId: user.id,
      orderNumber: String(order.id),
      amount: (session.amount_total || 0) / 100,
    })
    console.log(`Purchase confirmation email sent to ${customerEmail}`)
  } catch (emailError) {
    console.error('Failed to send email:', emailError)
  }
}
