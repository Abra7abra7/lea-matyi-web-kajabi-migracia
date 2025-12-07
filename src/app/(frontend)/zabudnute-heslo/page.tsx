'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { siteConfig, themeConfig } from '@/config'
import { Loader2, ArrowLeft, Mail, CheckCircle } from 'lucide-react'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/users/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      // Vždy zobrazíme success - pre bezpečnosť nechceme prezradiť či email existuje
      setIsSuccess(true)
    } catch (err) {
      setError('Nastala chyba. Skúste to prosím znova.')
    } finally {
      setIsLoading(false)
    }
  }

  if (isSuccess) {
    return (
      <main className={`min-h-screen flex items-center justify-center py-12 px-4 bg-gradient-to-br ${themeConfig.gradients.hero}`}>
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Email bol odoslaný
            </h2>
            <p className="text-gray-600 mb-6">
              Ak účet s emailom <strong>{email}</strong> existuje, 
              dostanete email s inštrukciami na obnovu hesla.
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Skontrolujte aj spam priečinok.
            </p>
            <Link href="/prihlasenie">
              <Button variant="outline" className="w-full">
                <ArrowLeft className="w-4 h-4" />
                Späť na prihlásenie
              </Button>
            </Link>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className={`min-h-screen flex items-center justify-center py-12 px-4 bg-gradient-to-br ${themeConfig.gradients.hero}`}>
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Mail className="w-8 h-8 text-primary-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">
              Zabudnuté heslo
            </h2>
            <p className="mt-2 text-gray-600">
              Zadajte svoj email a pošleme vám odkaz na obnovu hesla.
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="vas@email.sk"
                required
                className="mt-1.5"
                autoComplete="email"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              size="lg"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Odosielam...
                </>
              ) : (
                'Obnoviť heslo'
              )}
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <Link 
              href="/prihlasenie" 
              className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-4 h-4" />
              Späť na prihlásenie
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}


