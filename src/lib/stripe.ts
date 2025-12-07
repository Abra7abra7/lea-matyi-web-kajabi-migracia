import Stripe from 'stripe'

// Stripe instance
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-02-24.acacia',
})

/**
 * Vytvorí Stripe Checkout Session pre kurz
 */
export async function createCheckoutSession({
  priceId,
  courseId,
  userId,
  userEmail,
  successUrl,
  cancelUrl,
}: {
  priceId: string
  courseId: string
  userId: string
  userEmail: string
  successUrl: string
  cancelUrl: string
}) {
  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: successUrl,
    cancel_url: cancelUrl,
    customer_email: userEmail,
    metadata: {
      courseId,
      userId,
    },
    // Nastavenia pre SK
    locale: 'sk',
    allow_promotion_codes: true,
  })

  return session
}

/**
 * Získa alebo vytvorí Stripe Customer
 */
export async function getOrCreateCustomer(email: string, name?: string) {
  // Skúsime nájsť existujúceho zákazníka
  const customers = await stripe.customers.list({
    email,
    limit: 1,
  })

  if (customers.data.length > 0) {
    return customers.data[0]
  }

  // Vytvoríme nového
  const customer = await stripe.customers.create({
    email,
    name,
  })

  return customer
}

/**
 * Overí Stripe Webhook signature
 */
export function verifyWebhookSignature(
  payload: string | Buffer,
  signature: string
) {
  return stripe.webhooks.constructEvent(
    payload,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET || ''
  )
}

/**
 * Získa Customer Portal URL
 */
export async function createPortalSession(customerId: string, returnUrl: string) {
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  })

  return session.url
}

