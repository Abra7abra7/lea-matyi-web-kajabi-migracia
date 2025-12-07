# 📧 Email Systém (Resend)

## Prehľad

Resend slúži na odosielanie transakčných emailov:
- Potvrdenie objednávky
- Welcome email
- Reset hesla
- Migračný welcome

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Trigger   │────▶│   Resend    │────▶│   Inbox     │
│  (Webhook)  │     │    API      │     │  (User)     │
└─────────────┘     └─────────────┘     └─────────────┘
```

---

## 1. Resend Setup

### Krok 1: Účet

1. Registrácia na [resend.com](https://resend.com)
2. Free tier: 100 emails/deň, 3000/mesiac

### Krok 2: Doména

1. Dashboard → Domains → Add Domain
2. Pridajte: `vasa-domena.sk`
3. Nastavte DNS záznamy (DKIM, SPF)
4. Počkajte na verifikáciu

### Krok 3: API Key

1. Dashboard → API Keys
2. Create API Key
3. Skopírovať key (napr. `re_xxx`)

---

## 2. Environment Variables

```env
# .env.local
RESEND_API_KEY=re_xxx
EMAIL_FROM=Beauty Academy <info@vasa-domena.sk>
```

---

## 3. Resend Client

```typescript
// src/lib/resend.ts
import { Resend } from 'resend'

if (!process.env.RESEND_API_KEY) {
  throw new Error('RESEND_API_KEY is not set')
}

export const resend = new Resend(process.env.RESEND_API_KEY)

export const EMAIL_FROM = process.env.EMAIL_FROM || 'Beauty Academy <noreply@example.com>'
```

---

## 4. Email Šablóny (React Email)

### Base Layout

```typescript
// src/emails/components/EmailLayout.tsx
import {
  Body,
  Container,
  Head,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from '@react-email/components'

interface EmailLayoutProps {
  preview: string
  children: React.ReactNode
}

export function EmailLayout({ preview, children }: EmailLayoutProps) {
  return (
    <Html>
      <Head />
      <Preview>{preview}</Preview>
      <Tailwind>
        <Body className="bg-gray-50 font-sans">
          <Container className="mx-auto py-8 px-4 max-w-xl">
            {/* Header */}
            <Section className="text-center mb-8">
              <Img
                src={`${process.env.NEXT_PUBLIC_APP_URL}/images/logo.png`}
                alt="Beauty Academy"
                width={150}
                height={50}
                className="mx-auto"
              />
            </Section>

            {/* Content */}
            <Section className="bg-white rounded-xl p-8 shadow-sm">
              {children}
            </Section>

            {/* Footer */}
            <Section className="text-center mt-8">
              <Text className="text-gray-500 text-sm">
                © {new Date().getFullYear()} Beauty Academy
              </Text>
              <Text className="text-gray-400 text-xs">
                Tento email bol odoslaný z{' '}
                <Link
                  href={process.env.NEXT_PUBLIC_APP_URL}
                  className="text-pink-500"
                >
                  beautyacademy.sk
                </Link>
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}
```

### Order Confirmation Email

```typescript
// src/emails/OrderConfirmationEmail.tsx
import {
  Button,
  Heading,
  Hr,
  Section,
  Text,
} from '@react-email/components'
import { EmailLayout } from './components/EmailLayout'

interface OrderConfirmationEmailProps {
  courseTitle: string
  courseSlug: string
  amount: number
  currency: string
  customerName?: string
}

export function OrderConfirmationEmail({
  courseTitle,
  courseSlug,
  amount,
  currency,
  customerName,
}: OrderConfirmationEmailProps) {
  const formattedAmount = new Intl.NumberFormat('sk-SK', {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(amount / 100)

  const courseUrl = `${process.env.NEXT_PUBLIC_APP_URL}/kurzy/${courseSlug}`

  return (
    <EmailLayout preview={`Ďakujeme za nákup kurzu: ${courseTitle}`}>
      <Heading className="text-2xl font-bold text-gray-900 mb-4">
        Ďakujeme za vašu objednávku! 🎉
      </Heading>

      <Text className="text-gray-700 mb-4">
        {customerName ? `Ahoj ${customerName},` : 'Ahoj,'}
      </Text>

      <Text className="text-gray-700 mb-6">
        Vaša platba bola úspešne spracovaná a kurz{' '}
        <strong>{courseTitle}</strong> je teraz odomknutý vo vašom účte.
      </Text>

      <Section className="bg-gray-50 rounded-lg p-4 mb-6">
        <Text className="text-sm text-gray-600 m-0">
          <strong>Kurz:</strong> {courseTitle}
        </Text>
        <Text className="text-sm text-gray-600 m-0 mt-1">
          <strong>Suma:</strong> {formattedAmount}
        </Text>
      </Section>

      <Button
        href={courseUrl}
        className="bg-pink-500 text-white px-6 py-3 rounded-lg font-semibold"
      >
        Začať študovať →
      </Button>

      <Hr className="my-6 border-gray-200" />

      <Text className="text-gray-500 text-sm">
        Faktúra bola automaticky odoslaná na vašu emailovú adresu.
        Ak máte akékoľvek otázky, neváhajte nás kontaktovať.
      </Text>

      <Text className="text-gray-700 mt-4">
        S pozdravom,<br />
        <strong>Beauty Academy tím</strong>
      </Text>
    </EmailLayout>
  )
}

// Export pre preview v development
export default OrderConfirmationEmail
```

### Welcome Email

```typescript
// src/emails/WelcomeEmail.tsx
import {
  Button,
  Heading,
  Text,
} from '@react-email/components'
import { EmailLayout } from './components/EmailLayout'

interface WelcomeEmailProps {
  userName?: string
}

export function WelcomeEmail({ userName }: WelcomeEmailProps) {
  return (
    <EmailLayout preview="Vitajte v Beauty Academy!">
      <Heading className="text-2xl font-bold text-gray-900 mb-4">
        Vitajte v Beauty Academy! 💅
      </Heading>

      <Text className="text-gray-700 mb-4">
        {userName ? `Ahoj ${userName},` : 'Ahoj,'}
      </Text>

      <Text className="text-gray-700 mb-4">
        Ďakujeme za registráciu. Teraz máte prístup k našej knižnici
        profesionálnych kurzov v oblasti beauty.
      </Text>

      <Text className="text-gray-700 mb-6">
        Prezrite si naše kurzy a začnite svoju cestu k novým zručnostiam.
      </Text>

      <Button
        href={`${process.env.NEXT_PUBLIC_APP_URL}/kurzy`}
        className="bg-pink-500 text-white px-6 py-3 rounded-lg font-semibold"
      >
        Prezrieť kurzy →
      </Button>

      <Text className="text-gray-700 mt-6">
        S pozdravom,<br />
        <strong>Beauty Academy tím</strong>
      </Text>
    </EmailLayout>
  )
}

export default WelcomeEmail
```

### Reset Password Email

```typescript
// src/emails/ResetPasswordEmail.tsx
import {
  Button,
  Heading,
  Text,
} from '@react-email/components'
import { EmailLayout } from './components/EmailLayout'

interface ResetPasswordEmailProps {
  resetUrl: string
}

export function ResetPasswordEmail({ resetUrl }: ResetPasswordEmailProps) {
  return (
    <EmailLayout preview="Reset hesla - Beauty Academy">
      <Heading className="text-2xl font-bold text-gray-900 mb-4">
        Žiadosť o reset hesla
      </Heading>

      <Text className="text-gray-700 mb-4">
        Prijali sme žiadosť o reset hesla pre váš účet.
        Kliknite na tlačidlo nižšie pre nastavenie nového hesla:
      </Text>

      <Button
        href={resetUrl}
        className="bg-pink-500 text-white px-6 py-3 rounded-lg font-semibold"
      >
        Resetovať heslo
      </Button>

      <Text className="text-gray-500 text-sm mt-6">
        Ak ste túto žiadosť nepodali, môžete tento email ignorovať.
        Link je platný 1 hodinu.
      </Text>

      <Text className="text-gray-700 mt-6">
        S pozdravom,<br />
        <strong>Beauty Academy tím</strong>
      </Text>
    </EmailLayout>
  )
}

export default ResetPasswordEmail
```

### Migration Welcome Email

```typescript
// src/emails/MigrationWelcomeEmail.tsx
import {
  Button,
  Heading,
  Text,
  Section,
} from '@react-email/components'
import { EmailLayout } from './components/EmailLayout'

interface MigrationWelcomeEmailProps {
  userName?: string
  courses: string[]
}

export function MigrationWelcomeEmail({ 
  userName, 
  courses 
}: MigrationWelcomeEmailProps) {
  return (
    <EmailLayout preview="Vaše kurzy boli prenesené do novej platformy">
      <Heading className="text-2xl font-bold text-gray-900 mb-4">
        Vitajte v novej Beauty Academy! 🎉
      </Heading>

      <Text className="text-gray-700 mb-4">
        {userName ? `Ahoj ${userName},` : 'Ahoj,'}
      </Text>

      <Text className="text-gray-700 mb-4">
        S radosťou vám oznamujeme, že sme spustili novú a vylepšenú platformu
        Beauty Academy. Všetky vaše zakúpené kurzy boli úspešne prenesené.
      </Text>

      {courses.length > 0 && (
        <Section className="bg-gray-50 rounded-lg p-4 mb-6">
          <Text className="text-sm font-semibold text-gray-700 m-0 mb-2">
            Vaše kurzy:
          </Text>
          {courses.map((course, i) => (
            <Text key={i} className="text-sm text-gray-600 m-0">
              ✓ {course}
            </Text>
          ))}
        </Section>
      )}

      <Text className="text-gray-700 mb-6">
        Pre prístup k vašim kurzom si prosím nastavte nové heslo:
      </Text>

      <Button
        href={`${process.env.NEXT_PUBLIC_APP_URL}/reset-password`}
        className="bg-pink-500 text-white px-6 py-3 rounded-lg font-semibold"
      >
        Nastaviť heslo →
      </Button>

      <Text className="text-gray-700 mt-6">
        S pozdravom,<br />
        <strong>Beauty Academy tím</strong>
      </Text>
    </EmailLayout>
  )
}

export default MigrationWelcomeEmail
```

---

## 5. Email Sending Functions

```typescript
// src/lib/email-service.ts
import { resend, EMAIL_FROM } from './resend'
import { OrderConfirmationEmail } from '@/emails/OrderConfirmationEmail'
import { WelcomeEmail } from '@/emails/WelcomeEmail'
import { ResetPasswordEmail } from '@/emails/ResetPasswordEmail'
import { MigrationWelcomeEmail } from '@/emails/MigrationWelcomeEmail'

interface SendOrderConfirmationParams {
  to: string
  courseTitle: string
  courseSlug: string
  amount: number
  currency: string
  customerName?: string
}

export async function sendOrderConfirmationEmail(
  params: SendOrderConfirmationParams
) {
  try {
    const { data, error } = await resend.emails.send({
      from: EMAIL_FROM,
      to: params.to,
      subject: `Potvrdenie objednávky: ${params.courseTitle}`,
      react: OrderConfirmationEmail({
        courseTitle: params.courseTitle,
        courseSlug: params.courseSlug,
        amount: params.amount,
        currency: params.currency,
        customerName: params.customerName,
      }),
    })

    if (error) {
      console.error('Email error:', error)
      throw error
    }

    return data
  } catch (error) {
    console.error('Failed to send order confirmation:', error)
    throw error
  }
}

export async function sendWelcomeEmail(to: string, userName?: string) {
  try {
    const { data, error } = await resend.emails.send({
      from: EMAIL_FROM,
      to,
      subject: 'Vitajte v Beauty Academy!',
      react: WelcomeEmail({ userName }),
    })

    if (error) throw error
    return data
  } catch (error) {
    console.error('Failed to send welcome email:', error)
    throw error
  }
}

export async function sendResetPasswordEmail(to: string, resetUrl: string) {
  try {
    const { data, error } = await resend.emails.send({
      from: EMAIL_FROM,
      to,
      subject: 'Reset hesla - Beauty Academy',
      react: ResetPasswordEmail({ resetUrl }),
    })

    if (error) throw error
    return data
  } catch (error) {
    console.error('Failed to send reset password email:', error)
    throw error
  }
}

export async function sendMigrationWelcomeEmail(
  to: string,
  userName?: string,
  courses: string[] = []
) {
  try {
    const { data, error } = await resend.emails.send({
      from: EMAIL_FROM,
      to,
      subject: 'Vaše kurzy boli prenesené do novej Beauty Academy',
      react: MigrationWelcomeEmail({ userName, courses }),
    })

    if (error) throw error
    return data
  } catch (error) {
    console.error('Failed to send migration email:', error)
    throw error
  }
}
```

---

## 6. Email Preview (Development)

```typescript
// src/app/api/email-preview/[template]/route.tsx
// DEV ONLY - zakázať v produkcii!

import { NextResponse } from 'next/server'
import { render } from '@react-email/render'
import { OrderConfirmationEmail } from '@/emails/OrderConfirmationEmail'
import { WelcomeEmail } from '@/emails/WelcomeEmail'

export async function GET(
  _: Request,
  { params }: { params: { template: string } }
) {
  if (process.env.NODE_ENV === 'production') {
    return new NextResponse('Not found', { status: 404 })
  }

  let html: string

  switch (params.template) {
    case 'order-confirmation':
      html = await render(
        OrderConfirmationEmail({
          courseTitle: 'Permanentný Makeup - Kompletný kurz',
          courseSlug: 'permanentny-makeup',
          amount: 29900,
          currency: 'eur',
          customerName: 'Jana',
        })
      )
      break
    case 'welcome':
      html = await render(WelcomeEmail({ userName: 'Jana' }))
      break
    default:
      return new NextResponse('Template not found', { status: 404 })
  }

  return new NextResponse(html, {
    headers: { 'Content-Type': 'text/html' },
  })
}
```

---

## 7. Payload Hook pre Welcome Email

```typescript
// src/collections/Users.ts
import { sendWelcomeEmail } from '@/lib/email-service'

export const Users: CollectionConfig = {
  // ...
  hooks: {
    afterChange: [
      async ({ doc, operation }) => {
        // Odoslať welcome email pri registrácii
        if (operation === 'create') {
          try {
            await sendWelcomeEmail(doc.email, doc.firstName)
          } catch (error) {
            console.error('Welcome email failed:', error)
            // Neprerušujeme registráciu ak email zlyhá
          }
        }
      },
    ],
  },
}
```

---

## 📋 Checklist

- [ ] Resend účet vytvorený
- [ ] Doména pridaná a verifikovaná
- [ ] API key v env variables
- [ ] Email šablóny vytvorené
- [ ] Testovací email odoslaný
- [ ] Webhook posiela order confirmation
- [ ] Welcome email pri registrácii
- [ ] Reset password email funguje

---

*Resend pre spoľahlivé doručovanie transakčných emailov.*

