import { DashboardStatsSkeleton, CourseCardSkeleton } from '@/components/ui/skeleton'

export default function DashboardLoading() {
  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="container-custom">
        {/* Header Skeleton */}
        <div className="mb-8 space-y-2">
          <div className="h-9 w-64 bg-gray-200 rounded-lg animate-pulse" />
          <div className="h-5 w-48 bg-gray-200 rounded-lg animate-pulse" />
        </div>

        {/* Stats Skeleton */}
        <div className="mb-12">
          <DashboardStatsSkeleton />
        </div>

        {/* Kurzy Section Skeleton */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-40 bg-gray-200 rounded animate-pulse" />
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <CourseCardSkeleton key={i} />
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}


