'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { siteConfig, themeConfig } from '@/config'
import { Loader2, CreditCard, Shield, Lock, ArrowLeft, CheckCircle } from 'lucide-react'

interface Props {
  params: Promise<{ slug: string }>
}

export default function BuyCoursePage({ params }: Props) {
  const router = useRouter()
  const [slug, setSlug] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    params.then(p => setSlug(p.slug))
  }, [params])

  const handleCheckout = async () => {
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseSlug: slug }),
        credentials: 'include',
      })

      const data = await response.json()

      if (!response.ok) {
        if (response.status === 401) {
          // Neprihlásený - redirect na login
          router.push(`/prihlasenie?redirect=/kurzy/${slug}/kupit`)
          return
        }
        throw new Error(data.error || 'Nastala chyba')
      }

      // Redirect na Stripe Checkout
      if (data.url) {
        window.location.href = data.url
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Nastala chyba pri spracovaní platby')
      setIsLoading(false)
    }
  }

  return (
    <main className={`min-h-screen py-12 bg-gradient-to-br ${themeConfig.gradients.hero}`}>
      <div className="container-custom max-w-2xl">
        {/* Back link */}
        <Link 
          href={`/kurzy/${slug}`}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Späť na kurz
        </Link>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-500 to-primary-600 p-8 text-white text-center">
            <CreditCard className="w-12 h-12 mx-auto mb-4 opacity-90" />
            <h1 className="text-2xl font-heading font-bold">
              Dokončenie nákupu
            </h1>
            <p className="mt-2 opacity-90">
              Budete presmerovaní na bezpečnú platobnú bránu
            </p>
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Error */}
            {error && (
              <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700">
                {error}
              </div>
            )}

            {/* Security badges */}
            <div className="flex flex-wrap justify-center gap-6 mb-8 py-6 border-y border-gray-100">
              <div className="flex items-center gap-2 text-gray-600 text-sm">
                <Lock className="w-5 h-5 text-green-500" />
                <span>SSL šifrované</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600 text-sm">
                <Shield className="w-5 h-5 text-green-500" />
                <span>Bezpečná platba</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600 text-sm">
                <CreditCard className="w-5 h-5 text-green-500" />
                <span>Stripe Checkout</span>
              </div>
            </div>

            {/* Benefits */}
            <div className="mb-8">
              <h3 className="font-semibold text-gray-900 mb-4">Čo získate:</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600">Okamžitý prístup k celému kurzu</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600">Doživotný prístup bez dodatočných poplatkov</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600">Certifikát po dokončení kurzu</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600">Materiály na stiahnutie</span>
                </li>
              </ul>
            </div>

            {/* CTA */}
            <Button
              onClick={handleCheckout}
              disabled={isLoading}
              size="xl"
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Presmerovávam na platbu...
                </>
              ) : (
                <>
                  <CreditCard className="w-5 h-5" />
                  Pokračovať na platbu
                </>
              )}
            </Button>

            {/* Footer note */}
            <p className="mt-6 text-center text-xs text-gray-500">
              Platby spracováva <strong>Stripe</strong>. 
              Vaše platobné údaje nikdy neukladáme na našich serveroch.
            </p>
          </div>
        </div>

        {/* Support */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            Máte otázky? Kontaktujte nás na{' '}
            <a href={`mailto:${siteConfig.contact.email}`} className="text-primary-600 hover:underline">
              {siteConfig.contact.email}
            </a>
          </p>
        </div>
      </div>
    </main>
  )
}

