import Link from 'next/link'
import { Search, Home, BookOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full text-center">
        {/* 404 */}
        <div className="mb-6">
          <span className="text-8xl font-heading font-bold text-primary-200">404</span>
        </div>

        {/* Icon */}
        <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Search className="w-10 h-10 text-primary-500" />
        </div>

        {/* Nadpis */}
        <h1 className="text-2xl font-heading font-bold text-gray-900 mb-3">
          Stránka nenájdená
        </h1>

        {/* Popis */}
        <p className="text-gray-600 mb-8">
          Ospravedlňujeme sa, ale stránka, ktorú hľadáte, neexistuje alebo bola presunutá.
        </p>

        {/* Akcie */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/">
            <Button className="gap-2 w-full sm:w-auto">
              <Home className="w-4 h-4" />
              Domovská stránka
            </Button>
          </Link>
          <Link href="/kurzy">
            <Button variant="outline" className="gap-2 w-full sm:w-auto">
              <BookOpen className="w-4 h-4" />
              Prezrieť kurzy
            </Button>
          </Link>
        </div>
      </div>
    </main>
  )
}

