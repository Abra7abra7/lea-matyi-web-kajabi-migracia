import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getCurrentUser } from '@/lib/auth'
import { getCourseBySlug, getPayloadClient } from '@/lib/payload'
import { createCheckoutSession } from '@/lib/stripe'

export async function POST(request: Request) {
  try {
    // Získaj prihláseného používateľa
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json(
        { error: 'Pre nákup sa musíte prihlásiť' },
        { status: 401 }
      )
    }

    // Získaj courseSlug z body
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

    // Skontroluj či používateľ už kurz nevlastní
    const purchasedCourses = (user.purchasedCourses as { id: string }[]) || []
    if (purchasedCourses.some(c => c.id === course.id)) {
      return NextResponse.json(
        { error: 'Tento kurz už vlastníte' },
        { status: 400 }
      )
    }

    // Vytvor Checkout Session
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    
    const session = await createCheckoutSession({
      priceId: course.stripePriceId,
      courseId: course.id,
      userId: user.id,
      userEmail: user.email,
      successUrl: `${baseUrl}/kurzy/${courseSlug}?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${baseUrl}/kurzy/${courseSlug}?canceled=true`,
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

