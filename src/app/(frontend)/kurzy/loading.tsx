import { CourseCardSkeleton } from '@/components/ui/skeleton'
import { themeConfig } from '@/config'

export default function CoursesLoading() {
  return (
    <main className="min-h-screen">
      {/* Hero Skeleton */}
      <section className={`py-16 bg-gradient-to-br ${themeConfig.gradients.hero}`}>
        <div className="container-custom">
          <div className="max-w-3xl space-y-4">
            <div className="h-12 w-64 bg-gray-200 rounded-lg animate-pulse" />
            <div className="h-6 w-96 bg-gray-200 rounded-lg animate-pulse" />
          </div>
        </div>
      </section>

      {/* Kurzy Grid Skeleton */}
      <section className="py-16">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <CourseCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}

