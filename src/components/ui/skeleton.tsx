import { cn } from '@/lib/utils'

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-gray-200', className)}
      {...props}
    />
  )
}

/**
 * Skeleton pre Course Card
 */
function CourseCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
      {/* Image */}
      <Skeleton className="aspect-video w-full" />
      
      {/* Content */}
      <div className="p-6 space-y-4">
        {/* Category */}
        <Skeleton className="h-4 w-20" />
        
        {/* Title */}
        <Skeleton className="h-6 w-3/4" />
        
        {/* Description */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
        
        {/* Stats */}
        <div className="flex gap-4">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
    </div>
  )
}

/**
 * Skeleton pre Dashboard Stats
 */
function DashboardStatsSkeleton() {
  return (
    <div className="grid md:grid-cols-3 gap-6">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <Skeleton className="w-12 h-12 rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

/**
 * Skeleton pre Video Player
 */
function VideoPlayerSkeleton() {
  return (
    <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center">
      <div className="text-center">
        <Skeleton className="w-20 h-20 rounded-full mx-auto mb-4 bg-gray-800" />
        <Skeleton className="h-4 w-32 mx-auto bg-gray-800" />
      </div>
    </div>
  )
}

/**
 * Skeleton pre Lesson sidebar
 */
function LessonSidebarSkeleton() {
  return (
    <div className="space-y-4 p-4">
      {[1, 2, 3].map((module) => (
        <div key={module} className="space-y-2">
          <Skeleton className="h-4 w-24 bg-gray-700" />
          {[1, 2, 3].map((lesson) => (
            <Skeleton key={lesson} className="h-10 w-full bg-gray-700" />
          ))}
        </div>
      ))}
    </div>
  )
}

export { 
  Skeleton, 
  CourseCardSkeleton, 
  DashboardStatsSkeleton, 
  VideoPlayerSkeleton,
  LessonSidebarSkeleton,
}


