import Link from 'next/link'
import Image from 'next/image'
import { getPublishedCourses } from '@/lib/payload'
import { formatPrice, formatDuration } from '@/lib/utils'
import { siteConfig, themeConfig } from '@/config'
import { Clock, BookOpen, Star, ChevronRight } from 'lucide-react'

// Force dynamic rendering (databáza nie je dostupná počas buildu na Vercel)
export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Kurzy',
  description: 'Profesionálne online kurzy v oblasti beauty. Objavte naše kurzy a začnite sa učiť už dnes.',
}

export default async function CoursesPage() {
  const courses = await getPublishedCourses()

  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className={`py-16 bg-gradient-to-br ${themeConfig.gradients.hero}`}>
        <div className="container-custom">
          <div className="max-w-3xl">
            <h1 className="text-4xl sm:text-5xl font-heading font-bold text-gray-900 mb-4">
              Naše kurzy
            </h1>
            <p className="text-lg text-gray-600">
              Profesionálne online kurzy vytvorené odborníkmi z praxe. 
              Učte sa vlastným tempom a získajte certifikát.
            </p>
          </div>
        </div>
      </section>

      {/* Kurzy */}
      <section className="py-16">
        <div className="container-custom">
          {courses.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <BookOpen className="w-10 h-10 text-gray-400" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                {siteConfig.content.empty.noCourses}
              </h2>
              <p className="text-gray-600">
                Čoskoro tu nájdete nové kurzy. Sledujte nás pre novinky.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {courses.map((course: any) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  )
}

function CourseCard({ course }: { course: any }) {
  const coverImage = course.coverImage as any
  const imageUrl = coverImage?.url || '/images/course-placeholder.jpg'
  
  return (
    <Link href={`/kurzy/${course.slug}`}>
      <article className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl hover:border-primary-200 transition-all duration-300">
        {/* Obrázok */}
        <div className="aspect-video relative overflow-hidden">
          <Image
            src={imageUrl}
            alt={course.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {/* Kategória badge */}
          {course.category && (
            <div className="absolute top-4 left-4">
              <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-gray-700">
                {getCategoryLabel(course.category)}
              </span>
            </div>
          )}
          {/* Cena badge */}
          <div className="absolute bottom-4 right-4">
            <div className="px-4 py-2 bg-primary-500 text-white rounded-full font-bold">
              {formatPrice(course.price)}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Difficulty */}
          {course.difficulty && (
            <div className="flex items-center gap-2 mb-3">
              <span className={`w-2 h-2 rounded-full ${getDifficultyColor(course.difficulty)}`} />
              <span className="text-xs font-medium text-gray-500">
                {getDifficultyLabel(course.difficulty)}
              </span>
            </div>
          )}

          {/* Title */}
          <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors line-clamp-2">
            {course.title}
          </h3>

          {/* Description */}
          {course.shortDescription && (
            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
              {course.shortDescription}
            </p>
          )}

          {/* Stats */}
          <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
            {course.lessonsCount > 0 && (
              <div className="flex items-center gap-1.5">
                <BookOpen className="w-4 h-4" />
                <span>{course.lessonsCount} lekcií</span>
              </div>
            )}
            {course.totalDuration > 0 && (
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                <span>{formatDuration(course.totalDuration)}</span>
              </div>
            )}
          </div>

          {/* Instructor */}
          {course.instructor && (
            <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-xs font-medium text-gray-600">
                  {course.instructor.charAt(0).toUpperCase()}
                </span>
              </div>
              <span className="text-sm text-gray-600">{course.instructor}</span>
            </div>
          )}
        </div>
      </article>
    </Link>
  )
}

function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    pmu: 'Permanentný makeup',
    nails: 'Nechty',
    cosmetics: 'Kozmetika',
    makeup: 'Líčenie',
    hair: 'Vlasy',
    other: 'Iné',
  }
  return labels[category] || category
}

function getDifficultyLabel(difficulty: string): string {
  const labels: Record<string, string> = {
    beginner: 'Začiatočník',
    intermediate: 'Mierne pokročilý',
    advanced: 'Pokročilý',
  }
  return labels[difficulty] || difficulty
}

function getDifficultyColor(difficulty: string): string {
  const colors: Record<string, string> = {
    beginner: 'bg-green-500',
    intermediate: 'bg-yellow-500',
    advanced: 'bg-red-500',
  }
  return colors[difficulty] || 'bg-gray-400'
}

