import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { getCourseBySlug, getPayloadClient } from '@/lib/payload'
import { stripe } from '@/lib/stripe'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { courseSlug } = body

    if (!courseSlug) {
      return NextResponse.json(
        { error: 'Chýba ID kurzu' },
        { status: 400 }
      )
    }

    // Získaj kurz
    const course = await getCourseBySlug(courseSlug)

    if (!course) {
      return NextResponse.json(
        { error: 'Kurz neexistuje' },
        { status: 404 }
      )
    }

    if (!course.stripePriceId) {
      return NextResponse.json(
        { error: 'Kurz nemá nastavenú cenu v Stripe' },
        { status: 400 }
      )
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    
    // Skontroluj či je používateľ prihlásený
    const user = await getCurrentUser()
    
    // Ak je prihlásený, skontroluj či už kurz nevlastní
    if (user) {
      const purchasedCourses = (user.purchasedCourses as { id: string }[]) || []
      if (purchasedCourses.some(c => String(c.id) === String(course.id))) {
        return NextResponse.json(
          { error: 'Tento kurz už vlastníte' },
          { status: 400 }
        )
      }
    }

    // Vytvor Checkout Session
    // Guest checkout - Stripe zbiera email
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price: course.stripePriceId,
          quantity: 1,
        },
      ],
      // Pre prihlásených nastavíme email, pre hostí necháme Stripe zbierať
      ...(user ? {
        customer_email: user.email,
      } : {
        // Stripe automaticky zobrazí email field
      }),
      metadata: {
        courseId: String(course.id),
        courseSlug: courseSlug,
        // Ak je používateľ prihlásený, pridáme jeho ID
        ...(user ? { userId: String(user.id) } : {}),
      },
      success_url: `${baseUrl}/kurzy/${courseSlug}?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/kurzy/${courseSlug}?canceled=true`,
      // Povoliť promo kódy
      allow_promotion_codes: true,
      // Automaticky zbierať fakturačnú adresu
      billing_address_collection: 'required',
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json(
      { error: 'Nastala chyba pri vytváraní platby' },
      { status: 500 }
    )
  }
}
