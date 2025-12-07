import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { verifyWebhookSignature } from '@/lib/stripe'
import { getPayloadClient } from '@/lib/payload'
import type Stripe from 'stripe'
import crypto from 'crypto'

export async function POST(request: Request) {
  console.log('🔔 Webhook received')
  
  const body = await request.text()
  const headersList = await headers()
  const signature = headersList.get('stripe-signature')

  if (!signature) {
    console.error('❌ Missing Stripe signature')
    return NextResponse.json(
      { error: 'Chýba Stripe signature' },
      { status: 400 }
    )
  }

  let event: Stripe.Event

  try {
    event = verifyWebhookSignature(body, signature)
    console.log('✅ Signature verified, event type:', event.type)
  } catch (error) {
    console.error('❌ Webhook signature verification failed:', error)
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
        console.log('💰 Payment succeeded:', event.data.object.id)
        break

      case 'payment_intent.payment_failed':
        console.log('❌ Payment failed:', event.data.object.id)
        break

      default:
        console.log('ℹ️ Unhandled event type:', event.type)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('❌ Webhook handler error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed', details: String(error) },
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
  console.log('🛒 Processing checkout session:', session.id)
  
  const metadata = session.metadata || {}
  const courseId = metadata.courseId
  const courseSlug = metadata.courseSlug
  const userId = metadata.userId
  
  console.log('📋 Metadata:', { courseId, courseSlug, userId })

  // Získaj email zákazníka
  const customerEmail = session.customer_email || session.customer_details?.email
  const customerName = session.customer_details?.name || 'Zákazník'
  
  console.log('👤 Customer:', { email: customerEmail, name: customerName })

  if (!courseId) {
    console.error('❌ Missing courseId in checkout session metadata')
    throw new Error('Missing courseId in metadata')
  }

  if (!customerEmail) {
    console.error('❌ Missing customer email in checkout session')
    throw new Error('Missing customer email')
  }

  const payload = await getPayloadClient()
  let user: any = null
  let isNewUser = false
  let generatedPassword: string | null = null

  // 1. Ak máme userId, skúsime nájsť používateľa
  if (userId) {
    try {
      user = await payload.findByID({
        collection: 'users',
        id: userId,
        depth: 0,
      })
      console.log('✅ User found by ID:', user.email)
    } catch (e) {
      console.log('⚠️ User not found by ID, will search by email')
    }
  }

  // 2. Ak nemáme používateľa, hľadáme podľa emailu
  if (!user) {
    try {
      const existingUsers = await payload.find({
        collection: 'users',
        where: {
          email: { equals: customerEmail },
        },
        limit: 1,
      })

      if (existingUsers.docs.length > 0) {
        user = existingUsers.docs[0]
        console.log('✅ Existing user found by email:', user.email)
      }
    } catch (e) {
      console.error('❌ Error searching for user by email:', e)
    }
  }

  // 3. Ak stále nemáme používateľa, vytvoríme nového
  if (!user) {
    isNewUser = true
    generatedPassword = generatePassword()
    
    const nameParts = customerName.split(' ')
    const firstName = nameParts[0] || ''
    const lastName = nameParts.slice(1).join(' ') || ''
    
    console.log('🆕 Creating new user:', customerEmail)
    
    try {
      user = await payload.create({
        collection: 'users',
        data: {
          email: customerEmail,
          password: generatedPassword,
          firstName,
          lastName,
          role: 'customer',
          stripeCustomerId: typeof session.customer === 'string' ? session.customer : null,
          purchasedCourses: [Number(courseId)], // Konvertuj na číslo
        },
      })
      console.log('✅ New user created:', user.id)
    } catch (createError) {
      console.error('❌ Failed to create user:', createError)
      throw createError
    }
  } else {
    // 4. Existujúci používateľ - pridaj kurz
    console.log('📚 Adding course to existing user')
    
    const purchasedCourses = (user.purchasedCourses as any[]) || []
    const courseIds = purchasedCourses.map((c: any) => {
      if (typeof c === 'object' && c !== null) return Number(c.id)
      return Number(c)
    })
    
    console.log('📚 Current purchased courses:', courseIds)
    
    if (!courseIds.includes(Number(courseId))) {
      try {
        await payload.update({
          collection: 'users',
          id: user.id,
          data: {
            purchasedCourses: [...courseIds, Number(courseId)],
            stripeCustomerId: typeof session.customer === 'string' ? session.customer : user.stripeCustomerId,
          },
        })
        console.log('✅ Course added to user')
      } catch (updateError) {
        console.error('❌ Failed to update user:', updateError)
        throw updateError
      }
    } else {
      console.log('ℹ️ User already has this course')
    }
  }

  // 5. Získaj kurz pre email
  let course: any = null
  try {
    course = await payload.findByID({
      collection: 'courses',
      id: courseId,
      depth: 0,
    })
    console.log('✅ Course found:', course.title)
  } catch (e) {
    console.error('❌ Failed to find course:', e)
  }

  // 6. Vytvor objednávku
  let order: any = null
  try {
    order = await payload.create({
      collection: 'orders',
      data: {
        customer: user.id,
        customerEmail: customerEmail,
        course: Number(courseId),
        total: (session.amount_total || 0) / 100,
        currency: (session.currency || 'EUR').toUpperCase(),
        status: 'paid',
        stripeCheckoutSessionId: session.id,
        stripePaymentIntentId: typeof session.payment_intent === 'string' ? session.payment_intent : null,
        billingDetails: session.customer_details ? {
          name: session.customer_details.name || '',
          address: session.customer_details.address?.line1 || '',
          city: session.customer_details.address?.city || '',
          postalCode: session.customer_details.address?.postal_code || '',
          country: session.customer_details.address?.country || 'SK',
        } : undefined,
      },
    })
    console.log('✅ Order created:', order.orderNumber || order.id)
  } catch (orderError) {
    console.error('❌ Failed to create order:', orderError)
    // Pokračujeme aj keď order zlyhal - kurz bol pridaný
  }

  // 7. Odoslať emaily (len ak máme RESEND_API_KEY)
  if (process.env.RESEND_API_KEY) {
    try {
      const { sendWelcomeEmail, sendPurchaseConfirmationEmail } = await import('@/lib/email')
      
      // Ak je nový používateľ, pošleme welcome email s heslom
      if (isNewUser && generatedPassword) {
        await sendWelcomeEmail({
          to: customerEmail,
          customerName: user.firstName || customerName,
          temporaryPassword: generatedPassword,
          loginUrl: `${process.env.NEXT_PUBLIC_APP_URL}/prihlasenie`,
        })
        console.log('✅ Welcome email sent')
      }

      // Potvrdenie nákupu
      if (course) {
        await sendPurchaseConfirmationEmail({
          to: customerEmail,
          customerName: user.firstName || customerName,
          courseId: courseId,
          userId: String(user.id),
          orderNumber: order?.orderNumber || String(order?.id || 'N/A'),
          amount: (session.amount_total || 0) / 100,
        })
        console.log('✅ Purchase confirmation email sent')
      }
    } catch (emailError) {
      console.error('⚠️ Failed to send email (non-critical):', emailError)
      // Neprerušujeme - email nie je kritický
    }
  } else {
    console.log('⚠️ RESEND_API_KEY not set, skipping emails')
  }

  console.log('🎉 Checkout processing completed successfully')
}
