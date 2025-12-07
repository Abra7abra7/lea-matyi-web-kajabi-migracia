import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { createPortalSession } from '@/lib/stripe'

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json(
        { error: 'Pre prístup sa musíte prihlásiť' },
        { status: 401 }
      )
    }

    const stripeCustomerId = user.stripeCustomerId as string
    
    if (!stripeCustomerId) {
      return NextResponse.json(
        { error: 'Nemáte žiadne predchádzajúce platby' },
        { status: 400 }
      )
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const portalUrl = await createPortalSession(stripeCustomerId, `${baseUrl}/dashboard`)

    return NextResponse.json({ url: portalUrl })
  } catch (error) {
    console.error('Portal session error:', error)
    return NextResponse.json(
      { error: 'Nastala chyba pri vytváraní platobného portálu' },
      { status: 500 }
    )
  }
}

