'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { siteConfig, themeConfig } from '@/config'
import { Eye, EyeOff, Loader2, Check } from 'lucide-react'

function RegisterForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectUrl = searchParams.get('redirect') || '/dashboard'
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    marketingConsent: false,
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    // Validácia
    if (formData.password !== formData.confirmPassword) {
      setError('Heslá sa nezhodujú')
      setIsLoading(false)
      return
    }

    if (formData.password.length < 8) {
      setError('Heslo musí mať aspoň 8 znakov')
      setIsLoading(false)
      return
    }

    try {
      // Registrácia
      const registerResponse = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
          role: 'customer',
          marketingConsent: formData.marketingConsent,
        }),
      })

      const registerData = await registerResponse.json()

      if (!registerResponse.ok) {
        throw new Error(registerData.errors?.[0]?.message || 'Registrácia zlyhala')
      }

      // Automatické prihlásenie
      const loginResponse = await fetch('/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
        credentials: 'include',
      })

      if (!loginResponse.ok) {
        // Registrácia OK ale login zlyhal - redirect na login
        router.push(`/prihlasenie?registered=true&redirect=${encodeURIComponent(redirectUrl)}`)
        return
      }

      // Redirect to original page or dashboard
      router.push(redirectUrl)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Nastala chyba pri registrácii')
    } finally {
      setIsLoading(false)
    }
  }

  // Password strength indicator
  const passwordStrength = () => {
    const pwd = formData.password
    if (!pwd) return null
    
    let strength = 0
    if (pwd.length >= 8) strength++
    if (/[A-Z]/.test(pwd)) strength++
    if (/[a-z]/.test(pwd)) strength++
    if (/[0-9]/.test(pwd)) strength++
    if (/[^A-Za-z0-9]/.test(pwd)) strength++

    const colors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-lime-500', 'bg-green-500']
    const labels = ['Veľmi slabé', 'Slabé', 'Priemerné', 'Silné', 'Veľmi silné']

    return (
      <div className="mt-2">
        <div className="flex gap-1">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full ${
                i < strength ? colors[strength - 1] : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
        <p className={`text-xs mt-1 ${strength >= 3 ? 'text-green-600' : 'text-gray-500'}`}>
          {labels[strength - 1] || 'Zadajte heslo'}
        </p>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md">
      {/* Card */}
      <div className="bg-white rounded-2xl shadow-xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <h1 className="text-2xl font-heading font-bold text-gray-900">
              {siteConfig.name}
            </h1>
          </Link>
          <h2 className="mt-4 text-xl font-semibold text-gray-900">
            Vytvorte si účet
          </h2>
          <p className="mt-2 text-gray-600">
            Získajte prístup k profesionálnym kurzom
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
          {/* Meno a Priezvisko */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">Meno</Label>
              <Input
                id="firstName"
                name="firstName"
                type="text"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Jana"
                className="mt-1.5"
                autoComplete="given-name"
              />
            </div>
            <div>
              <Label htmlFor="lastName">Priezvisko</Label>
              <Input
                id="lastName"
                name="lastName"
                type="text"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Nováková"
                className="mt-1.5"
                autoComplete="family-name"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="vas@email.sk"
              required
              className="mt-1.5"
              autoComplete="email"
            />
          </div>

          <div>
            <Label htmlFor="password">Heslo *</Label>
            <div className="relative mt-1.5">
              <Input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                placeholder="Minimálne 8 znakov"
                required
                className="pr-10"
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            {passwordStrength()}
          </div>

          <div>
            <Label htmlFor="confirmPassword">Potvrdiť heslo *</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Zopakujte heslo"
              required
              className="mt-1.5"
              autoComplete="new-password"
            />
            {formData.confirmPassword && formData.password === formData.confirmPassword && (
              <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                <Check className="w-3 h-3" />
                Heslá sa zhodujú
              </p>
            )}
          </div>

          {/* Marketing súhlas */}
          <div className="flex items-start">
            <input
              id="marketingConsent"
              name="marketingConsent"
              type="checkbox"
              checked={formData.marketingConsent}
              onChange={handleChange}
              className="mt-1 h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <label htmlFor="marketingConsent" className="ml-2 text-sm text-gray-600">
              Súhlasím so zasielaním noviniek a marketingových informácií
            </label>
          </div>

          {/* Súhlas s podmienkami */}
          <p className="text-xs text-gray-500">
            Registráciou súhlasíte s{' '}
            <Link href="/obchodne-podmienky" className="text-primary-600 hover:underline">
              obchodnými podmienkami
            </Link>{' '}
            a{' '}
            <Link href="/ochrana-osobnych-udajov" className="text-primary-600 hover:underline">
              spracovaním osobných údajov
            </Link>.
          </p>

          <Button 
            type="submit" 
            className="w-full" 
            size="lg"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Registrujem...
              </>
            ) : (
              'Zaregistrovať sa'
            )}
          </Button>
        </form>

        {/* Footer */}
        <p className="mt-6 text-center text-sm text-gray-600">
          Už máte účet?{' '}
          <Link 
            href={redirectUrl !== '/dashboard' ? `/prihlasenie?redirect=${encodeURIComponent(redirectUrl)}` : '/prihlasenie'} 
            className="font-semibold text-primary-600 hover:text-primary-500"
          >
            Prihláste sa
          </Link>
        </p>
      </div>
    </div>
  )
}

export default function RegisterPage() {
  return (
    <main className={`min-h-screen flex items-center justify-center py-12 px-4 bg-gradient-to-br ${themeConfig.gradients.hero}`}>
      <Suspense fallback={
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl p-8 animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/2 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-8"></div>
            <div className="space-y-4">
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      }>
        <RegisterForm />
      </Suspense>
    </main>
  )
}
