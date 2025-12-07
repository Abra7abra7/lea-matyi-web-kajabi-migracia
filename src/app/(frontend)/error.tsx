'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log error do konzoly (v produkcii môžete použiť Sentry alebo iný monitoring)
    console.error('Page error:', error)
  }, [error])

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full text-center">
        {/* Icon */}
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-10 h-10 text-red-500" />
        </div>

        {/* Nadpis */}
        <h1 className="text-2xl font-heading font-bold text-gray-900 mb-3">
          Ups! Niečo sa pokazilo
        </h1>

        {/* Popis */}
        <p className="text-gray-600 mb-8">
          Ospravedlňujeme sa za nepríjemnosti. Skúste obnoviť stránku alebo sa vráťte na domovskú stránku.
        </p>

        {/* Akcie */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={reset} variant="outline" className="gap-2">
            <RefreshCw className="w-4 h-4" />
            Skúsiť znova
          </Button>
          <Link href="/">
            <Button className="gap-2 w-full sm:w-auto">
              <Home className="w-4 h-4" />
              Domovská stránka
            </Button>
          </Link>
        </div>

        {/* Error ID (pre debugging) */}
        {error.digest && (
          <p className="mt-8 text-xs text-gray-400">
            Error ID: {error.digest}
          </p>
        )}
      </div>
    </main>
  )
}


