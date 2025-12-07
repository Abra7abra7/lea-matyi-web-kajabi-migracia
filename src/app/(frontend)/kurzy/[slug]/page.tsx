import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { getCourseBySlug } from '@/lib/payload'
import { getCurrentUser, userOwnsCourse } from '@/lib/auth'
import { formatPrice, formatDuration } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { siteConfig, themeConfig } from '@/config'
import { 
  Clock, BookOpen, Award, PlayCircle, 
  Check, ChevronRight, Lock, FileText,
  Star, Users
} from 'lucide-react'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const course = await getCourseBySlug(slug)
  
  if (!course) return { title: 'Kurz nenájdený' }
  
  return {
    title: course.metaTitle || course.title,
    description: course.metaDescription || course.shortDescription,
  }
}

export default async function CourseDetailPage({ params }: Props) {
  const { slug } = await params
  const course = await getCourseBySlug(slug)
  
  if (!course) notFound()
  
  const user = await getCurrentUser()
  const hasAccess = userOwnsCourse(user, course.id)
  
  const coverImage = course.coverImage as any
  const imageUrl = coverImage?.url || '/images/course-placeholder.jpg'
  const modules = (course.modules as any[]) || []

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className={`py-12 lg:py-20 bg-gradient-to-br ${themeConfig.gradients.hero}`}>
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left - Content */}
            <div>
              {/* Category & Difficulty */}
              <div className="flex items-center gap-3 mb-4">
                {course.category && (
                  <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
                    {getCategoryLabel(course.category as string)}
                  </span>
                )}
                {course.difficulty && (
                  <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                    {getDifficultyLabel(course.difficulty as string)}
                  </span>
                )}
              </div>

              {/* Title */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-gray-900 mb-6">
                {course.title}
              </h1>

              {/* Short Description */}
              {course.shortDescription && (
                <p className="text-lg text-gray-600 mb-8">
                  {course.shortDescription}
                </p>
              )}

              {/* Stats */}
              <div className="flex flex-wrap gap-6 mb-8">
                {course.lessonsCount && course.lessonsCount > 0 && (
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-primary-500" />
                    <span className="text-gray-700">{course.lessonsCount} lekcií</span>
                  </div>
                )}
                {course.totalDuration && course.totalDuration > 0 && (
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-primary-500" />
                    <span className="text-gray-700">{formatDuration(course.totalDuration)}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-primary-500" />
                  <span className="text-gray-700">Certifikát</span>
                </div>
              </div>

              {/* Instructor */}
              {course.instructor && (
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-lg font-medium text-gray-600">
                      {(course.instructor as string).charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Lektor</p>
                    <p className="font-medium text-gray-900">{course.instructor}</p>
                  </div>
                </div>
              )}

              {/* CTA */}
              {hasAccess ? (
                <Link href={`/kurzy/${slug}/lekcia/0/0`}>
                  <Button size="xl" className="gap-2">
                    <PlayCircle className="w-5 h-5" />
                    {siteConfig.content.cta.startLearning}
                  </Button>
                </Link>
              ) : (
                <div className="flex flex-wrap items-center gap-4">
                  <Link href={`/kurzy/${slug}/kupit`}>
                    <Button size="xl" className="gap-2">
                      {siteConfig.content.cta.buyNow}
                      <span className="font-bold">{formatPrice(course.price || 0)}</span>
                    </Button>
                  </Link>
                  {course.originalPrice && course.originalPrice > (course.price || 0) && (
                    <span className="text-gray-400 line-through">
                      {formatPrice(course.originalPrice)}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Right - Image */}
            <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src={imageUrl}
                alt={course.title}
                fill
                className="object-cover"
                priority
              />
              {course.previewVideoId && (
                <button className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors group">
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <PlayCircle className="w-10 h-10 text-primary-500 ml-1" />
                  </div>
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="container-custom">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-12">
              {/* Popis */}
              {course.description && (
                <div>
                  <h2 className="text-2xl font-heading font-bold text-gray-900 mb-6">
                    O kurze
                  </h2>
                  <div className="prose prose-lg max-w-none">
                    {/* TODO: Render rich text */}
                    <p className="text-gray-600">
                      {course.shortDescription}
                    </p>
                  </div>
                </div>
              )}

              {/* Obsah kurzu */}
              <div>
                <h2 className="text-2xl font-heading font-bold text-gray-900 mb-6">
                  Obsah kurzu
                </h2>
                <div className="space-y-4">
                  {modules.map((module: any, moduleIndex: number) => (
                    <ModuleAccordion 
                      key={moduleIndex}
                      module={module}
                      moduleIndex={moduleIndex}
                      hasAccess={hasAccess}
                      courseSlug={slug}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-4">
                  Čo získate
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600">Doživotný prístup k obsahu</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600">Certifikát po dokončení</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600">Prístup v mobilnej aplikácii</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600">Materiály na stiahnutie</span>
                  </li>
                </ul>

                {!hasAccess && (
                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <div className="text-center mb-4">
                      <div className="text-3xl font-bold text-gray-900">
                        {formatPrice(course.price || 0)}
                      </div>
                      {course.originalPrice && course.originalPrice > (course.price || 0) && (
                        <div className="text-gray-400 line-through">
                          {formatPrice(course.originalPrice)}
                        </div>
                      )}
                    </div>
                    <Link href={`/kurzy/${slug}/kupit`} className="block">
                      <Button className="w-full" size="lg">
                        {siteConfig.content.cta.buyNow}
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

function ModuleAccordion({ 
  module, 
  moduleIndex, 
  hasAccess, 
  courseSlug 
}: { 
  module: any
  moduleIndex: number
  hasAccess: boolean
  courseSlug: string
}) {
  const lessons = module.lessons || []

  return (
    <details className="group bg-white rounded-xl border border-gray-100 overflow-hidden" open={moduleIndex === 0}>
      <summary className="flex items-center justify-between p-4 cursor-pointer list-none hover:bg-gray-50">
        <div className="flex items-center gap-3">
          <span className="w-8 h-8 bg-primary-100 text-primary-600 rounded-lg flex items-center justify-center text-sm font-medium">
            {moduleIndex + 1}
          </span>
          <span className="font-medium text-gray-900">{module.title}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">{lessons.length} lekcií</span>
          <ChevronRight className="w-5 h-5 text-gray-400 group-open:rotate-90 transition-transform" />
        </div>
      </summary>
      <div className="border-t border-gray-100">
        {lessons.map((lesson: any, lessonIndex: number) => (
          <div 
            key={lessonIndex}
            className="flex items-center justify-between p-4 hover:bg-gray-50 border-b border-gray-50 last:border-0"
          >
            <div className="flex items-center gap-3">
              {hasAccess || lesson.isFree ? (
                <PlayCircle className="w-5 h-5 text-primary-500" />
              ) : (
                <Lock className="w-5 h-5 text-gray-400" />
              )}
              <div>
                <p className="text-gray-900">{lesson.title}</p>
                {lesson.duration && (
                  <p className="text-sm text-gray-500">{formatDuration(lesson.duration)}</p>
                )}
              </div>
            </div>
            {(hasAccess || lesson.isFree) ? (
              <Link 
                href={`/kurzy/${courseSlug}/lekcia/${moduleIndex}/${lessonIndex}`}
                className="text-primary-600 hover:text-primary-700 text-sm font-medium"
              >
                Prehrať
              </Link>
            ) : lesson.isFree ? (
              <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">
                Zadarmo
              </span>
            ) : null}
          </div>
        ))}
      </div>
    </details>
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

