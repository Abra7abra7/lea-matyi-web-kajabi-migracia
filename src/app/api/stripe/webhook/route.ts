import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { verifyWebhookSignature } from '@/lib/stripe'
import { getPayloadClient } from '@/lib/payload'
import { sendPurchaseConfirmationEmail } from '@/lib/email'
import type Stripe from 'stripe'

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
 * Spracuje úspešný checkout
 */
async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const { courseId, userId } = session.metadata || {}

  if (!courseId || !userId) {
    console.error('Missing metadata in checkout session')
    return
  }

  const payload = await getPayloadClient()

  // Získaj používateľa
  const user = await payload.findByID({
    collection: 'users',
    id: userId,
    depth: 0,
  })

  if (!user) {
    console.error('User not found:', userId)
    return
  }

  // Pridaj kurz do zakúpených
  const purchasedCourses = (user.purchasedCourses as string[]) || []
  
  if (!purchasedCourses.includes(courseId)) {
    await payload.update({
      collection: 'users',
      id: userId,
      data: {
        purchasedCourses: [...purchasedCourses, courseId],
        stripeCustomerId: session.customer as string,
      },
    })
  }

  // Vytvor objednávku
  await payload.create({
    collection: 'orders',
    data: {
      customer: userId,
      customerEmail: session.customer_email || user.email,
      course: courseId,
      total: (session.amount_total || 0) / 100,
      currency: (session.currency || 'EUR').toUpperCase(),
      status: 'paid',
      stripeCheckoutSessionId: session.id,
      stripePaymentIntentId: session.payment_intent as string,
    },
  })

  console.log(`Order created for user ${userId}, course ${courseId}`)

  // Odoslať email s potvrdením
  try {
    // Získaj kurz pre názov
    const course = await payload.findByID({
      collection: 'courses',
      id: courseId,
      depth: 0,
    })
    
    await sendPurchaseConfirmationEmail({
      to: session.customer_email || user.email,
      customerName: (user.firstName as string) || 'Zákazník',
      courseName: course.title,
      price: `${((session.amount_total || 0) / 100).toFixed(2)} ${(session.currency || 'EUR').toUpperCase()}`,
      courseUrl: `${process.env.NEXT_PUBLIC_APP_URL}/kurzy/${course.slug}`,
    })
    console.log(`Confirmation email sent to ${session.customer_email || user.email}`)
  } catch (emailError) {
    console.error('Failed to send confirmation email:', emailError)
    // Nechceme aby zlyhanie emailu zastavilo celý webhook
  }
}

