# 🔐 Environment Variables - Beauty Academy

## Prehľad

Tento dokument obsahuje všetky environment variables potrebné pre produkčný deployment.

---

## ⚙️ Vercel Production Variables

Nastavte tieto premenné v **Vercel Dashboard → Project → Settings → Environment Variables**:

### 1. PAYLOAD CMS (Povinné)

| Premenná | Hodnota | Popis |
|----------|---------|-------|
| `PAYLOAD_SECRET` | `KzRDdGsZHRGktsHuc7zVj4V0J1fNvfj4XlWZh5YKfCI=` | Už máte nastavené |

### 2. DATABÁZA (Pre produkciu)

| Premenná | Hodnota | Odkiaľ získať |
|----------|---------|---------------|
| `DATABASE_URL` | `postgresql://...` | [Neon.tech](https://neon.tech) - vytvorte projekt |

> **Poznámka:** Aktuálne používate SQLite pre development. Pre produkciu odporúčam Neon.tech (free tier).

### 3. APLIKÁCIA

| Premenná | Hodnota |
|----------|---------|
| `NEXT_PUBLIC_APP_URL` | `https://your-domain.vercel.app` alebo vaša doména |

### 4. STRIPE (Platby)

| Premenná | Hodnota | Odkiaľ získať |
|----------|---------|---------------|
| `STRIPE_SECRET_KEY` | `sk_live_...` | [Stripe Dashboard → API Keys](https://dashboard.stripe.com/apikeys) |
| `STRIPE_PUBLISHABLE_KEY` | `pk_live_...` | [Stripe Dashboard → API Keys](https://dashboard.stripe.com/apikeys) |
| `STRIPE_WEBHOOK_SECRET` | `whsec_...` | [Stripe Dashboard → Webhooks](https://dashboard.stripe.com/webhooks) |

#### Stripe Webhook Setup:

1. Choďte na [https://dashboard.stripe.com/webhooks](https://dashboard.stripe.com/webhooks)
2. Kliknite **"Add endpoint"**
3. Endpoint URL: `https://your-domain.vercel.app/api/stripe/webhook`
4. Eventy na počúvanie:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
5. Skopírujte **Signing secret** → `STRIPE_WEBHOOK_SECRET`

### 5. CLOUDFLARE STREAM (Videá)

| Premenná | Hodnota | Odkiaľ získať |
|----------|---------|---------------|
| `CLOUDFLARE_ACCOUNT_ID` | `abc123...` | [Cloudflare Dashboard](https://dash.cloudflare.com) → pravý stĺpec |
| `CLOUDFLARE_API_TOKEN` | `...` | [Cloudflare API Tokens](https://dash.cloudflare.com/profile/api-tokens) |

### 6. RESEND (Emaily)

| Premenná | Hodnota | Odkiaľ získať |
|----------|---------|---------------|
| `RESEND_API_KEY` | `re_...` | [Resend Dashboard](https://resend.com/api-keys) |
| `EMAIL_FROM` | `Beauty Academy <noreply@beautyacademy.sk>` | Vaša overená doména |

---

## 🚀 Deployment Checklist

### Pred Deploymentom:

- [ ] Nastavené všetky env variables na Vercel
- [ ] Stripe webhook vytvorený s produkčnou URL
- [ ] Doména overená v Resend
- [ ] Cloudflare Stream nakonfigurovaný

### Po Deplomente:

- [ ] Otestovať login/registráciu
- [ ] Otestovať checkout (test karta: `4242 4242 4242 4242`)
- [ ] Overiť že webhook funguje (Stripe Dashboard → Webhooks → Events)
- [ ] Otestovať video prehrávanie
- [ ] Skontrolovať email delivery

---

## 🧪 Lokálne Testovanie

### Stripe Webhook Lokálne

```bash
# Inštalovať Stripe CLI
brew install stripe/stripe-cli/stripe

# Prihlásiť sa
stripe login

# Počúvať webhooky a forwardovať na localhost
stripe listen --forward-to localhost:3000/api/stripe/webhook

# Skopírovať webhook signing secret do .env
```

### Test Purchase Flow

```bash
# Použite test kartu
4242 4242 4242 4242
# Ľubovoľný budúci dátum expirácie
# Ľubovoľný CVC
```

---

## 📊 Monitoring

### Vercel Analytics

Automaticky povolené na Vercel. Dashboard: **Vercel → Project → Analytics**

### Stripe Dashboard

Monitor platieb: [https://dashboard.stripe.com](https://dashboard.stripe.com)

### Resend Dashboard

Email analytics: [https://resend.com](https://resend.com)

---

*Posledná aktualizácia: December 2024*

