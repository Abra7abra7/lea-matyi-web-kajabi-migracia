# 💳 Stripe Integrácia

## Prehľad

Stripe slúži na spracovanie jednorazových platieb za kurzy s automatickým generovaním faktúr.

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Frontend  │────▶│   Stripe    │────▶│   Webhook   │
│  (Checkout) │     │  (Payment)  │     │  (Backend)  │
└─────────────┘     └─────────────┘     └─────────────┘
                                              │
                                              ▼
                                        ┌─────────────┐
                                        │   Payload   │
                                        │    (DB)     │
                                        └─────────────┘
```

---

## 1. Stripe Dashboard Setup

### Krok 1: Vytvorenie účtu
1. Registrácia na [stripe.com](https://stripe.com)
2. Aktivácia účtu (vyžaduje overenie identity)
3. Nastavenie krajiny: **Slovensko**
4. Nastavenie meny: **EUR**

### Krok 2: Vytvorenie produktov

Pre každý kurz vytvorte produkt v Stripe:

1. Dashboard → Products → Add product
2. Vyplňte:
   - **Name:** Názov kurzu (napr. "Permanentný makeup - Kompletný kurz")
   - **Description:** Krátky popis
   - **Image:** Titulný obrázok

3. Pridajte cenu:
   - **Pricing model:** One time
   - **Amount:** Cena v EUR (napr. 299.00)
   - **Currency:** EUR

4. Skopírujte **Price ID** (napr. `price_1QRBcKLx...`)

### Krok 3: Webhook Endpoint

1. Dashboard → Developers → Webhooks
2. Add endpoint:
   - **URL:** `https://vasa-domena.sk/api/stripe/webhook`
   - **Events:**
     - `checkout.session.completed`
     - `checkout.session.expired`
     - `charge.refunded`

3. Skopírujte **Signing secret** (napr. `whsec_...`)

### Krok 4: API Keys

Dashboard → Developers → API keys:
- **Publishable key:** `pk_live_...` (frontend)
- **Secret key:** `sk_live_...` (backend)

---

## 2. Environment Variables

```env
# .env.local

# Stripe Keys
STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_PUBLISHABLE_KEY=pk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx

# Pre testovanie (prepnite na test mode v Stripe)
# STRIPE_SECRET_KEY=sk_test_xxx
# STRIPE_PUBLISHABLE_KEY=pk_test_xxx
# STRIPE_WEBHOOK_SECRET=whsec_xxx
```

---

## 3. Stripe Client

```typescript
// src/lib/stripe.ts
import Stripe from 'stripe'

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set')
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-11-20.acacia',
  typescript: true,
})

// Helper pre formátovanie ceny
export function formatPrice(
  amount: number,
  currency: string = 'eur'
): string {
  return new Intl.NumberFormat('sk-SK', {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(amount / 100)
}
```

---

## 4. Checkout Flow

### Frontend Component

```typescript
// src/components/checkout/CheckoutButton.tsx
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Loader2, ShoppingCart } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface CheckoutButtonProps {
  courseId: string
  price: number
  disabled?: boolean
}

export function CheckoutButton({ 
  courseId, 
  price, 
  disabled 
}: CheckoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleCheckout = async () => {
    try {
      setIsLoading(true)

      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId }),
      })

      const data = await response.json()

      if (!response.ok) {
        if (response.status === 401) {
          // Neprihlásený - redirect na login
          router.push(`/login?redirect=/kurzy/${courseId}`)
          return
        }
        throw new Error(data.error || 'Chyba pri vytváraní platby')
      }

      // Redirect na Stripe Checkout
      window.location.href = data.url
    } catch (error) {
      console.error('Checkout error:', error)
      // TODO: Toast notification
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      onClick={handleCheckout}
      disabled={disabled || isLoading}
      size="lg"
      className="w-full"
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Presmerovanie na platbu...
        </>
      ) : (
        <>
          <ShoppingCart className="mr-2 h-4 w-4" />
          Kúpiť za €{price}
        </>
      )}
    </Button>
  )
}
```

### Success/Cancel Handling

```typescript
// src/app/(frontend)/kurzy/[slug]/page.tsx
import { CheckoutSuccess } from '@/components/checkout/CheckoutSuccess'
import { CheckoutCanceled } from '@/components/checkout/CheckoutCanceled'

interface Props {
  params: { slug: string }
  searchParams: { success?: string; canceled?: string }
}

export default async function CoursePage({ params, searchParams }: Props) {
  // ... načítanie kurzu

  return (
    <div>
      {searchParams.success && (
        <CheckoutSuccess courseTitle={course.title} />
      )}
      
      {searchParams.canceled && (
        <CheckoutCanceled />
      )}
      
      {/* Zvyšok stránky */}
    </div>
  )
}
```

---

## 5. Webhook Security

### Verifikácia podpisu

```typescript
// V webhook route
import Stripe from 'stripe'

const event = stripe.webhooks.constructEvent(
  body,           // Raw body ako string
  signature,      // stripe-signature header
  process.env.STRIPE_WEBHOOK_SECRET!
)

// Ak podpis nesedí, vyhodí error
```

### Idempotencia

```typescript
// Kontrola duplicitných eventov
const existingOrder = await payload.find({
  collection: 'orders',
  where: { 
    stripeCheckoutId: { equals: session.id } 
  },
})

if (existingOrder.docs.length > 0) {
  console.log('Already processed')
  return
}
```

---

## 6. Testovanie

### Test Cards

| Číslo karty | Výsledok |
|-------------|----------|
| `4242 4242 4242 4242` | Úspešná platba |
| `4000 0000 0000 9995` | Zamietnutá (insufficient funds) |
| `4000 0000 0000 3220` | 3D Secure required |

### Lokálny Webhook Testing

```bash
# Inštalácia Stripe CLI
brew install stripe/stripe-cli/stripe

# Prihlásenie
stripe login

# Forward webhookov na localhost
stripe listen --forward-to localhost:3000/api/stripe/webhook

# Trigger test eventu
stripe trigger checkout.session.completed
```

---

## 7. Customer Portal

Pre správu faktúr a platobných údajov:

```typescript
// Vytvorenie portal session
const portalSession = await stripe.billingPortal.sessions.create({
  customer: user.stripeCustomerId,
  return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
})

// Redirect
window.location.href = portalSession.url
```

### Dashboard Setup

1. Dashboard → Settings → Billing → Customer portal
2. Zapnite:
   - Invoice history
   - Payment methods (ak plánujete subscriptions)

---

## 8. Faktúry

Automatické generovanie faktúr pri checkout:

```typescript
// V checkout session
invoice_creation: {
  enabled: true,
}
```

Faktúry sú automaticky dostupné v Customer Portal.

---

## 9. Slovenské Požiadavky

### DPH

Ak je klientka platca DPH:
1. Dashboard → Settings → Tax rates
2. Pridajte SK VAT (20%)
3. V checkout:

```typescript
line_items: [
  {
    price: course.priceId,
    quantity: 1,
    tax_rates: ['txr_xxx'], // Tax rate ID
  },
],
```

### Fakturačné údaje

```typescript
// Nastavenie business údajov
// Dashboard → Settings → Business settings

// Alebo programaticky
invoice_creation: {
  enabled: true,
  invoice_data: {
    account_tax_ids: ['SK123456789'], // DIČ/IČ DPH
    custom_fields: [
      { name: 'IČO', value: '12345678' },
    ],
  },
}
```

---

## 10. Error Handling

### Bežné Errors

| Error | Príčina | Riešenie |
|-------|---------|----------|
| `card_declined` | Karta zamietnutá | Informovať zákazníka |
| `expired_card` | Expirovaná karta | Požiadať o inú kartu |
| `incorrect_cvc` | Nesprávny CVC | Skontrolovať údaje |
| `processing_error` | Stripe problém | Skúsiť znova |

### Frontend Error Display

```typescript
// Stripe automaticky zobrazuje chyby v Checkout
// Pre vlastnú stránku:
const { error } = await stripe.confirmPayment({...})

if (error.type === 'card_error') {
  // Zobraziť error.message používateľovi
}
```

---

## 11. Monitoring

### Stripe Dashboard

- **Payments** - Všetky platby
- **Customers** - Zákazníci
- **Events** - Webhook eventy
- **Logs** - API požiadavky

### Alerting

Dashboard → Settings → Alerts:
- Failed payments
- Disputes
- Large payments

---

## 📋 Checklist

- [ ] Stripe účet vytvorený a overený
- [ ] Produkty a ceny vytvorené
- [ ] API keys v env variables
- [ ] Webhook endpoint nastavený
- [ ] Webhook secret v env variables
- [ ] Testované s test kartami
- [ ] Customer Portal nakonfigurovaný
- [ ] DPH nastavené (ak potrebné)

---

*Stripe integrácia pre jednorazové platby s automatickými faktúrami.*


