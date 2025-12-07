'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { siteConfig, themeConfig } from '@/config'
import { Eye, EyeOff, Loader2 } from 'lucide-react'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectUrl = searchParams.get('redirect') || '/dashboard'
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Nesprávny email alebo heslo')
      }

      // Redirect to original page or dashboard
      router.push(redirectUrl)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Nastala chyba pri prihlásení')
    } finally {
      setIsLoading(false)
    }
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
            Vitajte späť
          </h2>
          <p className="mt-2 text-gray-600">
            Prihláste sa do svojho účtu
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

          <div>
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Heslo</Label>
              <Link 
                href="/zabudnute-heslo"
                className="text-sm text-primary-600 hover:text-primary-500"
              >
                Zabudnuté heslo?
              </Link>
            </div>
            <div className="relative mt-1.5">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="pr-10"
                autoComplete="current-password"
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
                Prihlasujem...
              </>
            ) : (
              'Prihlásiť sa'
            )}
          </Button>
        </form>

        {/* Footer */}
        <p className="mt-6 text-center text-sm text-gray-600">
          Nemáte účet?{' '}
          <Link 
            href={redirectUrl !== '/dashboard' ? `/registracia?redirect=${encodeURIComponent(redirectUrl)}` : '/registracia'} 
            className="font-semibold text-primary-600 hover:text-primary-500"
          >
            Zaregistrujte sa
          </Link>
        </p>
      </div>
    </div>
  )
}

export default function LoginPage() {
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
            </div>
          </div>
        </div>
      }>
        <LoginForm />
      </Suspense>
    </main>
  )
}
