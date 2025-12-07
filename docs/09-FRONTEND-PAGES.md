# 🖥️ Frontend Stránky a Komponenty

## Prehľad Stránok

| Stránka | URL | Popis |
|---------|-----|-------|
| Homepage | `/` | Landing page s hero a zoznamom kurzov |
| Kurzy | `/kurzy` | Katalóg všetkých kurzov |
| Detail kurzu | `/kurzy/[slug]` | Predajná stránka kurzu |
| Lekcia | `/kurzy/[slug]/lekcia/[m]/[l]` | Video lekcia |
| Dashboard | `/dashboard` | Prehľad zakúpených kurzov |
| Login | `/login` | Prihlásenie |
| Register | `/register` | Registrácia |
| Reset hesla | `/reset-password` | Reset hesla |

---

## 1. Homepage

```typescript
// src/app/(frontend)/page.tsx
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { Hero } from '@/components/home/Hero'
import { FeaturedCourses } from '@/components/home/FeaturedCourses'
import { Benefits } from '@/components/home/Benefits'
import { Testimonials } from '@/components/home/Testimonials'
import { CTA } from '@/components/home/CTA'

export default async function HomePage() {
  const payload = await getPayload({ config: configPromise })

  // Načítanie publikovaných kurzov
  const courses = await payload.find({
    collection: 'courses',
    where: { status: { equals: 'published' } },
    limit: 6,
    sort: '-createdAt',
  })

  return (
    <main>
      <Hero />
      <FeaturedCourses courses={courses.docs} />
      <Benefits />
      <Testimonials />
      <CTA />
    </main>
  )
}
```

### Hero Component

```typescript
// src/components/home/Hero.tsx
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowRight, Play } from 'lucide-react'

export function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-50 via-white to-rose-50" />
      
      {/* Pattern overlay */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ec4899' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl">
          <span className="inline-block px-4 py-2 bg-pink-100 text-pink-700 rounded-full text-sm font-medium mb-6">
            Online vzdelávanie v oblasti beauty
          </span>
          
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            Staňte sa profesionálom v{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-rose-500">
              beauty priemysle
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Profesionálne online kurzy permanentného makeupu, nail art 
            a ďalších beauty techník. Učte sa vlastným tempom od 
            najlepších odborníkov v odbore.
          </p>
          
          <div className="flex flex-wrap gap-4">
            <Button asChild size="lg" className="text-lg px-8">
              <Link href="/kurzy">
                Prezrieť kurzy
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            
            <Button 
              asChild 
              variant="outline" 
              size="lg" 
              className="text-lg px-8"
            >
              <Link href="#video">
                <Play className="mr-2 h-5 w-5" />
                Pozrieť ukážku
              </Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="flex gap-12 mt-12 pt-12 border-t border-gray-200">
            <div>
              <p className="text-4xl font-bold text-gray-900">500+</p>
              <p className="text-gray-600">Spokojných študentov</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-gray-900">15+</p>
              <p className="text-gray-600">Profesionálnych kurzov</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-gray-900">100%</p>
              <p className="text-gray-600">Online prístup</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
```

---

## 2. Katalóg Kurzov

```typescript
// src/app/(frontend)/kurzy/page.tsx
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { CourseGrid } from '@/components/courses/CourseGrid'

export const metadata = {
  title: 'Kurzy | Beauty Academy',
  description: 'Prezrite si naše profesionálne online kurzy v oblasti beauty.',
}

export default async function CoursesPage() {
  const payload = await getPayload({ config: configPromise })

  const courses = await payload.find({
    collection: 'courses',
    where: { status: { equals: 'published' } },
    sort: '-createdAt',
  })

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Naše kurzy</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Vyberte si z našej ponuky profesionálnych kurzov a začnite 
          svoju cestu k novým zručnostiam.
        </p>
      </div>

      <CourseGrid courses={courses.docs} />
    </div>
  )
}
```

### CourseGrid & CourseCard

```typescript
// src/components/courses/CourseGrid.tsx
import { CourseCard } from './CourseCard'
import type { Course } from '@/types/payload-types'

interface CourseGridProps {
  courses: Course[]
}

export function CourseGrid({ courses }: CourseGridProps) {
  if (courses.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">
          Momentálne nie sú dostupné žiadne kurzy.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {courses.map((course) => (
        <CourseCard key={course.id} course={course} />
      ))}
    </div>
  )
}
```

```typescript
// src/components/courses/CourseCard.tsx
import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Clock, BookOpen, ArrowRight } from 'lucide-react'
import type { Course, Media } from '@/types/payload-types'

interface CourseCardProps {
  course: Course
}

export function CourseCard({ course }: CourseCardProps) {
  const coverImage = course.coverImage as Media
  const lessonsCount = course.lessonsCount || 0
  const duration = course.totalDuration || 0
  const hours = Math.floor(duration / 60)
  const minutes = duration % 60

  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-shadow">
      {/* Image */}
      <div className="relative aspect-video overflow-hidden">
        {coverImage?.url && (
          <Image
            src={coverImage.url}
            alt={coverImage.alt || course.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <Badge className="absolute top-4 left-4 bg-pink-500">
          €{course.price}
        </Badge>
      </div>

      <CardContent className="p-6">
        <h3 className="text-xl font-semibold mb-2 line-clamp-2">
          {course.title}
        </h3>
        
        {course.shortDescription && (
          <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
            {course.shortDescription}
          </p>
        )}

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <BookOpen className="h-4 w-4" />
            {lessonsCount} lekcií
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {hours > 0 && `${hours}h `}{minutes}min
          </span>
        </div>
      </CardContent>

      <CardFooter className="p-6 pt-0">
        <Button asChild className="w-full group-hover:bg-pink-600">
          <Link href={`/kurzy/${course.slug}`}>
            Zobraziť kurz
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
```

---

## 3. Detail Kurzu (Predajná stránka)

```typescript
// src/app/(frontend)/kurzy/[slug]/page.tsx
import { notFound, redirect } from 'next/navigation'
import { headers } from 'next/headers'
import Image from 'next/image'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { CheckoutButton } from '@/components/checkout/CheckoutButton'
import { ModuleList } from '@/components/courses/ModuleList'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Clock, 
  BookOpen, 
  Award, 
  CheckCircle,
  Play 
} from 'lucide-react'
import Link from 'next/link'
import type { Course, Media } from '@/types/payload-types'

interface Props {
  params: { slug: string }
  searchParams: { success?: string; canceled?: string; access?: string }
}

export async function generateMetadata({ params }: Props) {
  const payload = await getPayload({ config: configPromise })
  
  const courses = await payload.find({
    collection: 'courses',
    where: { slug: { equals: params.slug } },
    limit: 1,
  })

  const course = courses.docs[0]

  if (!course) {
    return { title: 'Kurz nenájdený' }
  }

  return {
    title: `${course.title} | Beauty Academy`,
    description: course.shortDescription,
  }
}

export default async function CourseDetailPage({ params, searchParams }: Props) {
  const payload = await getPayload({ config: configPromise })
  const headersList = await headers()
  const { user } = await payload.auth({ headers: headersList })

  // Načítanie kurzu
  const courses = await payload.find({
    collection: 'courses',
    where: { slug: { equals: params.slug } },
    limit: 1,
  })

  const course = courses.docs[0] as Course

  if (!course) {
    notFound()
  }

  // Kontrola či užívateľ vlastní kurz
  const purchasedCourses = (user?.purchasedCourses as string[]) || []
  const hasAccess = purchasedCourses.includes(course.id)
  const isAdmin = user?.roles?.includes('admin')

  const coverImage = course.coverImage as Media
  const lessonsCount = course.lessonsCount || 0
  const duration = course.totalDuration || 0
  const hours = Math.floor(duration / 60)
  const minutes = duration % 60

  return (
    <div className="min-h-screen">
      {/* Success/Error Messages */}
      {searchParams.success && (
        <div className="bg-green-50 border-b border-green-200 px-4 py-3">
          <div className="container mx-auto text-center text-green-800">
            🎉 Ďakujeme za nákup! Kurz je teraz odomknutý.
          </div>
        </div>
      )}
      
      {searchParams.canceled && (
        <div className="bg-yellow-50 border-b border-yellow-200 px-4 py-3">
          <div className="container mx-auto text-center text-yellow-800">
            Platba bola zrušená. Môžete to skúsiť znova.
          </div>
        </div>
      )}

      {searchParams.access === 'denied' && (
        <div className="bg-red-50 border-b border-red-200 px-4 py-3">
          <div className="container mx-auto text-center text-red-800">
            Pre prístup k tomuto kurzu ho musíte najprv zakúpiť.
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left - Info */}
            <div>
              <Badge className="mb-4 bg-pink-500">Online kurz</Badge>
              
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                {course.title}
              </h1>
              
              {course.shortDescription && (
                <p className="text-xl text-gray-300 mb-8">
                  {course.shortDescription}
                </p>
              )}

              {/* Stats */}
              <div className="flex flex-wrap gap-6 mb-8">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-pink-400" />
                  <span>{lessonsCount} lekcií</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-pink-400" />
                  <span>{hours > 0 && `${hours}h `}{minutes}min</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-pink-400" />
                  <span>Certifikát po dokončení</span>
                </div>
              </div>

              {/* CTA */}
              {hasAccess || isAdmin ? (
                <Button asChild size="lg" className="text-lg">
                  <Link href={`/kurzy/${course.slug}/lekcia/0/0`}>
                    <Play className="mr-2 h-5 w-5" />
                    Pokračovať v kurze
                  </Link>
                </Button>
              ) : (
                <div className="flex items-center gap-4">
                  <div>
                    <p className="text-3xl font-bold">€{course.price}</p>
                    <p className="text-gray-400 text-sm">Jednorazová platba</p>
                  </div>
                  <CheckoutButton 
                    courseId={course.id} 
                    price={course.price}
                  />
                </div>
              )}
            </div>

            {/* Right - Image */}
            <div className="relative aspect-video rounded-xl overflow-hidden shadow-2xl">
              {coverImage?.url && (
                <Image
                  src={coverImage.url}
                  alt={coverImage.alt || course.title}
                  fill
                  className="object-cover"
                  priority
                />
              )}
              {/* Play button overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                <div className="w-20 h-20 rounded-full bg-white/90 flex items-center justify-center">
                  <Play className="h-8 w-8 text-pink-500 ml-1" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Left - Description & Modules */}
          <div className="lg:col-span-2">
            {/* Description */}
            {course.description && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold mb-6">O kurze</h2>
                <div className="prose dark:prose-invert max-w-none">
                  {/* Rich text rendering */}
                </div>
              </div>
            )}

            {/* Modules */}
            <div>
              <h2 className="text-2xl font-bold mb-6">Obsah kurzu</h2>
              <ModuleList 
                modules={course.modules || []} 
                courseSlug={course.slug}
                hasAccess={hasAccess || isAdmin}
              />
            </div>
          </div>

          {/* Right - Sidebar */}
          <div>
            <div className="sticky top-24 bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4">
                Tento kurz zahŕňa:
              </h3>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>{lessonsCount} video lekcií</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Doživotný prístup</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Materiály na stiahnutie</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Certifikát po dokončení</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Mobilná aplikácia</span>
                </li>
              </ul>

              {!hasAccess && !isAdmin && (
                <div className="mt-6 pt-6 border-t">
                  <CheckoutButton 
                    courseId={course.id} 
                    price={course.price}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
```

---

## 4. Dashboard (Moje kurzy)

```typescript
// src/app/(frontend)/dashboard/page.tsx
import { requireAuth } from '@/lib/auth'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { CourseGrid } from '@/components/courses/CourseGrid'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { BookOpen } from 'lucide-react'
import type { Course } from '@/types/payload-types'

export default async function DashboardPage() {
  const user = await requireAuth()
  const payload = await getPayload({ config: configPromise })

  // Načítanie zakúpených kurzov
  const purchasedIds = (user.purchasedCourses as string[]) || []
  
  let courses: Course[] = []
  
  if (purchasedIds.length > 0) {
    const result = await payload.find({
      collection: 'courses',
      where: {
        id: { in: purchasedIds },
      },
    })
    courses = result.docs as Course[]
  }

  return (
    <div className="container mx-auto px-4 py-16">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-3xl font-bold mb-2">
          Ahoj, {user.firstName || 'študent'}! 👋
        </h1>
        <p className="text-muted-foreground">
          Tu nájdete všetky vaše zakúpené kurzy.
        </p>
      </div>

      {/* Courses */}
      {courses.length > 0 ? (
        <div>
          <h2 className="text-xl font-semibold mb-6">Moje kurzy</h2>
          <CourseGrid courses={courses} />
        </div>
      ) : (
        <div className="text-center py-16 bg-gray-50 dark:bg-gray-800 rounded-xl">
          <BookOpen className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">
            Zatiaľ nemáte žiadne kurzy
          </h2>
          <p className="text-muted-foreground mb-6">
            Prezrite si našu ponuku a začnite sa učiť už dnes.
          </p>
          <Button asChild>
            <Link href="/kurzy">Prezrieť kurzy</Link>
          </Button>
        </div>
      )}
    </div>
  )
}
```

---

## 5. Layout Components

### Header

```typescript
// src/components/layout/Header.tsx
import Link from 'next/link'
import { headers } from 'next/headers'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { Button } from '@/components/ui/button'
import { Logo } from '@/components/shared/Logo'
import { UserMenu } from './UserMenu'
import { MobileNav } from './MobileNav'

export async function Header() {
  const payload = await getPayload({ config: configPromise })
  const headersList = await headers()
  const { user } = await payload.auth({ headers: headersList })

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Logo />
          <span className="font-bold text-xl hidden sm:inline">
            Beauty Academy
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          <Link 
            href="/kurzy" 
            className="text-sm font-medium hover:text-pink-500 transition-colors"
          >
            Kurzy
          </Link>
          <Link 
            href="/o-nas" 
            className="text-sm font-medium hover:text-pink-500 transition-colors"
          >
            O nás
          </Link>
          <Link 
            href="/kontakt" 
            className="text-sm font-medium hover:text-pink-500 transition-colors"
          >
            Kontakt
          </Link>
        </nav>

        {/* Auth */}
        <div className="flex items-center gap-4">
          {user ? (
            <UserMenu user={user} />
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Button variant="ghost" asChild>
                <Link href="/login">Prihlásiť sa</Link>
              </Button>
              <Button asChild>
                <Link href="/register">Registrovať</Link>
              </Button>
            </div>
          )}
          
          {/* Mobile */}
          <MobileNav user={user} />
        </div>
      </div>
    </header>
  )
}
```

### Footer

```typescript
// src/components/layout/Footer.tsx
import Link from 'next/link'
import { Logo } from '@/components/shared/Logo'

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Logo variant="light" />
              <span className="font-bold text-xl text-white">
                Beauty Academy
              </span>
            </Link>
            <p className="text-sm max-w-sm">
              Profesionálne online kurzy v oblasti beauty. 
              Učte sa od najlepších odborníkov z pohodlia domova.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Odkazy</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/kurzy" className="hover:text-pink-400">
                  Kurzy
                </Link>
              </li>
              <li>
                <Link href="/o-nas" className="hover:text-pink-400">
                  O nás
                </Link>
              </li>
              <li>
                <Link href="/kontakt" className="hover:text-pink-400">
                  Kontakt
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-white mb-4">Právne</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/obchodne-podmienky" className="hover:text-pink-400">
                  Obchodné podmienky
                </Link>
              </li>
              <li>
                <Link href="/ochrana-osobnych-udajov" className="hover:text-pink-400">
                  Ochrana osobných údajov
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
          <p>© {new Date().getFullYear()} Beauty Academy. Všetky práva vyhradené.</p>
        </div>
      </div>
    </footer>
  )
}
```

---

## 6. Frontend Layout

```typescript
// src/app/(frontend)/layout.tsx
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Toaster } from '@/components/ui/toaster'

export default function FrontendLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <Toaster />
    </div>
  )
}
```

---

## 📋 Checklist Stránok

- [ ] Homepage so všetkými sekciami
- [ ] Katalóg kurzov s filtrom
- [ ] Detail kurzu (predajná stránka)
- [ ] Lekcia s video playerom
- [ ] Dashboard s zakúpenými kurzmi
- [ ] Login / Register / Reset password
- [ ] Header s navigáciou
- [ ] Footer
- [ ] Responzívny dizajn
- [ ] Dark mode podpora

---

*Frontend postavený na Next.js 15 App Router so shadcn/ui komponentmi.*


