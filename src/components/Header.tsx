'use client'

import Link from 'next/link'
import { siteConfig } from '@/config'
import { Menu, X, User } from 'lucide-react'
import { useState } from 'react'

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 glass border-b border-gray-100">
      <div className="container-custom">
        <nav className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl lg:text-2xl font-heading font-bold text-gray-900">
              {siteConfig.name}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {siteConfig.navigation.main.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden lg:flex items-center gap-4">
            <Link
              href="/prihlasenie"
              className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
            >
              Prihlásenie
            </Link>
            <Link
              href="/registracia"
              className="px-6 py-2.5 rounded-full bg-primary-500 text-white font-medium hover:bg-primary-600 transition-colors"
            >
              Registrácia
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-gray-600"
            aria-label="Menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </nav>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-100 shadow-lg">
          <div className="container-custom py-6 space-y-4">
            {siteConfig.navigation.main.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block py-2 text-gray-600 hover:text-gray-900 font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-4 border-t border-gray-100 space-y-3">
              <Link
                href="/prihlasenie"
                className="flex items-center gap-2 py-2 text-gray-600 hover:text-gray-900 font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                <User className="w-5 h-5" />
                Prihlásenie
              </Link>
              <Link
                href="/registracia"
                className="block w-full text-center px-6 py-3 rounded-full bg-primary-500 text-white font-medium hover:bg-primary-600 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Registrácia
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

