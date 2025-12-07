'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { siteConfig } from '@/config'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { 
  Menu, 
  X, 
  User, 
  LayoutDashboard, 
  BookOpen, 
  LogOut,
  Settings,
  GraduationCap
} from 'lucide-react'

interface UserData {
  id: string
  email: string
  firstName?: string
  lastName?: string
}

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [user, setUser] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const pathname = usePathname()

  // Fetch current user
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/users/me', { credentials: 'include' })
        if (res.ok) {
          const data = await res.json()
          setUser(data.user)
        }
      } catch {
        // Not logged in
      } finally {
        setLoading(false)
      }
    }
    checkAuth()
  }, [])

  const handleLogout = async () => {
    try {
      await fetch('/api/users/logout', { 
        method: 'POST', 
        credentials: 'include' 
      })
      setUser(null)
      window.location.href = '/'
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  const getInitials = (user: UserData) => {
    if (user.firstName && user.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
    }
    return user.email[0].toUpperCase()
  }

  const isActive = (href: string) => pathname === href

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/80 backdrop-blur-lg supports-[backdrop-filter]:bg-white/60">
      <div className="container-custom">
        <nav className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-lg shadow-primary-500/25">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-heading font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              {siteConfig.name}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {siteConfig.navigation.main.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(link.href)
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop Auth Section */}
          <div className="hidden lg:flex items-center gap-3">
            {loading ? (
              <div className="w-10 h-10 rounded-full bg-gray-100 animate-pulse" />
            ) : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10 ring-2 ring-primary-100 ring-offset-2">
                      <AvatarImage src="" alt={user.email} />
                      <AvatarFallback className="bg-gradient-to-br from-primary-400 to-primary-600 text-white font-medium">
                        {getInitials(user)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user.firstName && user.lastName 
                          ? `${user.firstName} ${user.lastName}`
                          : 'Môj účet'
                        }
                      </p>
                      <p className="text-xs leading-none text-gray-500">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="cursor-pointer">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/kurzy" className="cursor-pointer">
                      <BookOpen className="mr-2 h-4 w-4" />
                      Moje kurzy
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/nastavenia" className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      Nastavenia
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={handleLogout}
                    className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Odhlásiť sa
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link href="/prihlasenie">
                  <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                    Prihlásenie
                  </Button>
                </Link>
                <Link href="/registracia">
                  <Button 
                    size="sm" 
                    className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white shadow-lg shadow-primary-500/25"
                  >
                    Registrácia
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
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
        <div className="lg:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-100 shadow-xl">
          <div className="container-custom py-6">
            {/* Mobile User Info */}
            {user && (
              <div className="flex items-center gap-3 pb-4 mb-4 border-b border-gray-100">
                <Avatar className="h-12 w-12 ring-2 ring-primary-100">
                  <AvatarFallback className="bg-gradient-to-br from-primary-400 to-primary-600 text-white font-medium">
                    {getInitials(user)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-gray-900">
                    {user.firstName && user.lastName 
                      ? `${user.firstName} ${user.lastName}`
                      : 'Môj účet'
                    }
                  </p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
              </div>
            )}

            {/* Mobile Navigation Links */}
            <div className="space-y-1">
              {siteConfig.navigation.main.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                    isActive(link.href)
                      ? 'bg-primary-50 text-primary-600'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Mobile Auth Section */}
            <div className="pt-4 mt-4 border-t border-gray-100">
              {user ? (
                <div className="space-y-1">
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-50 font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <LayoutDashboard className="w-5 h-5" />
                    Dashboard
                  </Link>
                  <Link
                    href="/nastavenia"
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-50 font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Settings className="w-5 h-5" />
                    Nastavenia
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 font-medium"
                  >
                    <LogOut className="w-5 h-5" />
                    Odhlásiť sa
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <Link
                    href="/prihlasenie"
                    className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <User className="w-5 h-5" />
                    Prihlásenie
                  </Link>
                  <Link
                    href="/registracia"
                    className="flex items-center justify-center w-full px-4 py-3 rounded-lg bg-gradient-to-r from-primary-500 to-primary-600 text-white font-medium shadow-lg shadow-primary-500/25"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Registrácia
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
