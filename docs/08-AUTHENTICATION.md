# 🔐 Autentifikácia a Autorizácia

## Prehľad

Používame vstavaný Payload CMS Auth systém, ktorý poskytuje:
- JWT token autentifikáciu
- HTTP-only cookies
- Password hashing (bcrypt)
- Session management

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Login     │────▶│   Payload   │────▶│   JWT       │
│   Form      │     │    Auth     │     │   Cookie    │
└─────────────┘     └─────────────┘     └─────────────┘
```

---

## 1. Payload Auth Konfigurácia

```typescript
// src/collections/Users.ts
import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: {
    // Token expirácia (24 hodín)
    tokenExpiration: 60 * 60 * 24,
    
    // Verify email (voliteľné)
    verify: false,
    
    // Max login attempts pred lockout
    maxLoginAttempts: 5,
    lockTime: 600 * 1000, // 10 minút
    
    // Cookie nastavenia
    cookies: {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      domain: process.env.COOKIE_DOMAIN, // voliteľné
    },
  },
  // ... ostatné polia
}
```

---

## 2. Login Flow

### Login Form Component

```typescript
// src/components/auth/LoginForm.tsx
'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Mail, Lock } from 'lucide-react'
import Link from 'next/link'

const loginSchema = z.object({
  email: z.string().email('Neplatný email'),
  password: z.string().min(1, 'Heslo je povinné'),
})

type LoginFormData = z.infer<typeof loginSchema>

export function LoginForm() {
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/dashboard'

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch('/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        credentials: 'include', // Dôležité pre cookies
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.errors?.[0]?.message || 'Prihlásenie zlyhalo')
      }

      // Úspešné prihlásenie - redirect
      router.push(redirect)
      router.refresh() // Refresh server components
    } catch (err: any) {
      setError(err.message || 'Nesprávny email alebo heslo')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="email"
            type="email"
            placeholder="vas@email.sk"
            className="pl-10"
            {...form.register('email')}
          />
        </div>
        {form.formState.errors.email && (
          <p className="text-sm text-destructive">
            {form.formState.errors.email.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Heslo</Label>
          <Link
            href="/reset-password"
            className="text-sm text-pink-500 hover:underline"
          >
            Zabudnuté heslo?
          </Link>
        </div>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            className="pl-10"
            {...form.register('password')}
          />
        </div>
        {form.formState.errors.password && (
          <p className="text-sm text-destructive">
            {form.formState.errors.password.message}
          </p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Prihlasujem...
          </>
        ) : (
          'Prihlásiť sa'
        )}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Nemáte účet?{' '}
        <Link href="/register" className="text-pink-500 hover:underline">
          Zaregistrujte sa
        </Link>
      </p>
    </form>
  )
}
```

### Login Page

```typescript
// src/app/(frontend)/login/page.tsx
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { LoginForm } from '@/components/auth/LoginForm'

export default async function LoginPage() {
  // Ak je už prihlásený, redirect
  const payload = await getPayload({ config: configPromise })
  const headersList = await headers()
  const { user } = await payload.auth({ headers: headersList })

  if (user) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">Prihlásenie</h1>
          <p className="text-muted-foreground mt-2">
            Vitajte späť v Beauty Academy
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
```

---

## 3. Registration Flow

### Registration Form Component

```typescript
// src/components/auth/RegisterForm.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2 } from 'lucide-react'

const registerSchema = z.object({
  firstName: z.string().min(2, 'Meno musí mať aspoň 2 znaky'),
  lastName: z.string().min(2, 'Priezvisko musí mať aspoň 2 znaky'),
  email: z.string().email('Neplatný email'),
  password: z.string().min(8, 'Heslo musí mať aspoň 8 znakov'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Heslá sa nezhodujú',
  path: ['confirmPassword'],
})

type RegisterFormData = z.infer<typeof registerSchema>

export function RegisterForm() {
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setIsLoading(true)
      setError(null)

      // Vytvorenie používateľa
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
          firstName: data.firstName,
          lastName: data.lastName,
        }),
      })

      if (!response.ok) {
        const result = await response.json()
        throw new Error(result.errors?.[0]?.message || 'Registrácia zlyhala')
      }

      // Automatické prihlásenie
      const loginResponse = await fetch('/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
        }),
        credentials: 'include',
      })

      if (loginResponse.ok) {
        router.push('/dashboard')
        router.refresh()
      }
    } catch (err: any) {
      if (err.message.includes('duplicate')) {
        setError('Používateľ s týmto emailom už existuje')
      } else {
        setError(err.message)
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">Meno</Label>
          <Input
            id="firstName"
            placeholder="Jana"
            {...form.register('firstName')}
          />
          {form.formState.errors.firstName && (
            <p className="text-sm text-destructive">
              {form.formState.errors.firstName.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Priezvisko</Label>
          <Input
            id="lastName"
            placeholder="Nováková"
            {...form.register('lastName')}
          />
          {form.formState.errors.lastName && (
            <p className="text-sm text-destructive">
              {form.formState.errors.lastName.message}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="vas@email.sk"
          {...form.register('email')}
        />
        {form.formState.errors.email && (
          <p className="text-sm text-destructive">
            {form.formState.errors.email.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Heslo</Label>
        <Input
          id="password"
          type="password"
          placeholder="Minimálne 8 znakov"
          {...form.register('password')}
        />
        {form.formState.errors.password && (
          <p className="text-sm text-destructive">
            {form.formState.errors.password.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Potvrdiť heslo</Label>
        <Input
          id="confirmPassword"
          type="password"
          placeholder="Zopakujte heslo"
          {...form.register('confirmPassword')}
        />
        {form.formState.errors.confirmPassword && (
          <p className="text-sm text-destructive">
            {form.formState.errors.confirmPassword.message}
          </p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Registrujem...
          </>
        ) : (
          'Zaregistrovať sa'
        )}
      </Button>
    </form>
  )
}
```

---

## 4. Logout

```typescript
// src/components/auth/LogoutButton.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { LogOut, Loader2 } from 'lucide-react'

export function LogoutButton() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogout = async () => {
    try {
      setIsLoading(true)

      await fetch('/api/users/logout', {
        method: 'POST',
        credentials: 'include',
      })

      router.push('/')
      router.refresh()
    } catch (error) {
      console.error('Logout failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      variant="ghost"
      onClick={handleLogout}
      disabled={isLoading}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <>
          <LogOut className="h-4 w-4 mr-2" />
          Odhlásiť
        </>
      )}
    </Button>
  )
}
```

---

## 5. Protected Routes (Server Components)

### Auth Helper

```typescript
// src/lib/auth.ts
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export async function getCurrentUser() {
  const payload = await getPayload({ config: configPromise })
  const headersList = await headers()
  const { user } = await payload.auth({ headers: headersList })
  return user
}

export async function requireAuth(redirectTo?: string) {
  const user = await getCurrentUser()
  
  if (!user) {
    const redirectPath = redirectTo || '/login'
    redirect(redirectPath)
  }
  
  return user
}

export async function requireAdmin() {
  const user = await requireAuth()
  
  if (!user.roles?.includes('admin')) {
    redirect('/dashboard')
  }
  
  return user
}

export async function requireCourseAccess(courseId: string) {
  const user = await requireAuth()
  
  const purchasedCourses = (user.purchasedCourses as string[]) || []
  const isAdmin = user.roles?.includes('admin')
  
  if (!purchasedCourses.includes(courseId) && !isAdmin) {
    return null
  }
  
  return user
}
```

### Usage v Page

```typescript
// src/app/(frontend)/dashboard/page.tsx
import { requireAuth } from '@/lib/auth'

export default async function DashboardPage() {
  const user = await requireAuth()
  
  return (
    <div>
      <h1>Vitaj, {user.firstName || user.email}!</h1>
      {/* Dashboard content */}
    </div>
  )
}
```

---

## 6. Password Reset

### Request Reset

```typescript
// src/app/api/users/forgot-password/route.ts
import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export async function POST(request: Request) {
  try {
    const payload = await getPayload({ config: configPromise })
    const { email } = await request.json()

    // Payload automaticky odošle reset email
    await payload.forgotPassword({
      collection: 'users',
      data: { email },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    // Neodhaľujeme či email existuje
    return NextResponse.json({ success: true })
  }
}
```

### Reset Password

```typescript
// src/app/api/users/reset-password/route.ts
import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export async function POST(request: Request) {
  try {
    const payload = await getPayload({ config: configPromise })
    const { token, password } = await request.json()

    await payload.resetPassword({
      collection: 'users',
      data: { token, password },
      overrideAccess: true,
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Neplatný alebo expirovaný token' },
      { status: 400 }
    )
  }
}
```

---

## 7. useAuth Hook (Client)

```typescript
// src/hooks/useAuth.ts
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface User {
  id: string
  email: string
  firstName?: string
  lastName?: string
  purchasedCourses: string[]
  roles: string[]
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await fetch('/api/users/me', {
          credentials: 'include',
        })
        
        if (response.ok) {
          const data = await response.json()
          setUser(data.user)
        }
      } catch (error) {
        console.error('Failed to fetch user:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUser()
  }, [])

  const logout = async () => {
    await fetch('/api/users/logout', {
      method: 'POST',
      credentials: 'include',
    })
    setUser(null)
    router.push('/')
    router.refresh()
  }

  const hasRole = (role: string) => {
    return user?.roles?.includes(role) ?? false
  }

  const hasCourse = (courseId: string) => {
    return user?.purchasedCourses?.includes(courseId) ?? false
  }

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    isAdmin: hasRole('admin'),
    logout,
    hasRole,
    hasCourse,
  }
}
```

---

## 8. Access Control Functions

```typescript
// src/access/isAdmin.ts
import type { Access } from 'payload'

export const isAdmin: Access = ({ req: { user } }) => {
  return user?.roles?.includes('admin') ?? false
}

// src/access/isAdminOrSelf.ts
import type { Access } from 'payload'

export const isAdminOrSelf: Access = ({ req: { user }, id }) => {
  if (user?.roles?.includes('admin')) return true
  return user?.id === id
}

// src/access/hasPurchased.ts
import type { Access } from 'payload'

export const hasPurchasedCourse = (courseId: string): Access => {
  return ({ req: { user } }) => {
    if (user?.roles?.includes('admin')) return true
    const purchased = (user?.purchasedCourses as string[]) || []
    return purchased.includes(courseId)
  }
}
```

---

## 📋 Checklist

- [ ] Users kolekcia s auth: true
- [ ] Login/Register forms vytvorené
- [ ] Protected routes fungujú
- [ ] Logout funguje
- [ ] Password reset flow
- [ ] useAuth hook pre client components
- [ ] Access control na kolekciách

---

*Payload CMS Auth pre bezpečnú autentifikáciu a autorizáciu.*

