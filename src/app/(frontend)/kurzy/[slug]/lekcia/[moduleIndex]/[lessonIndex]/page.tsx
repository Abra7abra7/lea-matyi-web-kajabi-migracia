import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { getCourseBySlug } from '@/lib/payload'
import { getCurrentUser, userOwnsCourse } from '@/lib/auth'
import { formatDuration } from '@/lib/utils'
import { siteConfig } from '@/config'
import { 
  ChevronLeft, ChevronRight, CheckCircle, 
  FileText, Download, PlayCircle, Lock,
  List
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { VideoPlayer } from '@/components/VideoPlayer'

interface Props {
  params: Promise<{ 
    slug: string
    moduleIndex: string
    lessonIndex: string 
  }>
}

export async function generateMetadata({ params }: Props) {
  const { slug, moduleIndex, lessonIndex } = await params
  const course = await getCourseBySlug(slug)
  
  if (!course) return { title: 'Kurz nenájdený' }
  
  const modules = (course.modules as any[]) || []
  const module = modules[parseInt(moduleIndex)]
  const lesson = module?.lessons?.[parseInt(lessonIndex)]
  
  if (!lesson) return { title: 'Lekcia nenájdená' }
  
  return {
    title: `${lesson.title} | ${course.title}`,
  }
}

export default async function LessonPage({ params }: Props) {
  const { slug, moduleIndex: modIdxStr, lessonIndex: lesIdxStr } = await params
  const moduleIndex = parseInt(modIdxStr)
  const lessonIndex = parseInt(lesIdxStr)
  
  const course = await getCourseBySlug(slug)
  if (!course) notFound()
  
  const user = await getCurrentUser()
  const hasAccess = userOwnsCourse(user, String(course.id))
  
  const modules = (course.modules as any[]) || []
  const currentModule = modules[moduleIndex]
  const currentLesson = currentModule?.lessons?.[lessonIndex]
  
  if (!currentLesson) notFound()
  
  // Kontrola prístupu
  if (!hasAccess && !currentLesson.isFree) {
    redirect(`/kurzy/${slug}?access_denied=true`)
  }

  // Navigácia medzi lekciami
  const flatLessons = modules.flatMap((m: any, mIdx: number) => 
    (m.lessons || []).map((l: any, lIdx: number) => ({
      ...l,
      moduleIndex: mIdx,
      lessonIndex: lIdx,
      moduleName: m.title,
    }))
  )
  
  const currentFlatIndex = flatLessons.findIndex(
    (l: any) => l.moduleIndex === moduleIndex && l.lessonIndex === lessonIndex
  )
  
  const prevLesson = currentFlatIndex > 0 ? flatLessons[currentFlatIndex - 1] : null
  const nextLesson = currentFlatIndex < flatLessons.length - 1 ? flatLessons[currentFlatIndex + 1] : null

  return (
    <main className="min-h-screen bg-gray-900">
      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden lg:block w-80 flex-shrink-0 bg-gray-800 h-screen sticky top-0 overflow-y-auto">
          {/* Header */}
          <div className="p-4 border-b border-gray-700">
            <Link 
              href={`/kurzy/${slug}`}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              <span className="text-sm">Späť na kurz</span>
            </Link>
            <h2 className="mt-4 font-semibold text-white truncate">{course.title}</h2>
          </div>

          {/* Modules */}
          <nav className="p-4 space-y-4">
            {modules.map((module: any, mIdx: number) => (
              <div key={mIdx}>
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Modul {mIdx + 1}: {module.title}
                </h3>
                <ul className="space-y-1">
                  {module.lessons?.map((lesson: any, lIdx: number) => {
                    const isActive = mIdx === moduleIndex && lIdx === lessonIndex
                    const isAccessible = hasAccess || lesson.isFree
                    
                    return (
                      <li key={lIdx}>
                        {isAccessible ? (
                          <Link
                            href={`/kurzy/${slug}/lekcia/${mIdx}/${lIdx}`}
                            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                              isActive 
                                ? 'bg-primary-500 text-white' 
                                : 'text-gray-300 hover:bg-gray-700'
                            }`}
                          >
                            <PlayCircle className="w-4 h-4 flex-shrink-0" />
                            <span className="truncate">{lesson.title}</span>
                          </Link>
                        ) : (
                          <div className="flex items-center gap-3 px-3 py-2 text-sm text-gray-500">
                            <Lock className="w-4 h-4 flex-shrink-0" />
                            <span className="truncate">{lesson.title}</span>
                          </div>
                        )}
                      </li>
                    )
                  })}
                </ul>
              </div>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <div className="flex-1 min-h-screen flex flex-col">
          {/* Video Player Area */}
          <div className="aspect-video bg-black relative flex items-center justify-center">
            {currentLesson.videoId ? (
              <VideoPlayer videoId={currentLesson.videoId} />
            ) : (
              <div className="text-center text-gray-400">
                <PlayCircle className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>Video nie je k dispozícii</p>
              </div>
            )}
          </div>

          {/* Lesson Info */}
          <div className="flex-1 bg-gray-900 p-6 lg:p-8">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
              <span>{currentModule.title}</span>
              <span>•</span>
              <span>Lekcia {lessonIndex + 1}</span>
              {currentLesson.duration && (
                <>
                  <span>•</span>
                  <span>{formatDuration(currentLesson.duration)}</span>
                </>
              )}
            </div>

            {/* Title */}
            <h1 className="text-2xl lg:text-3xl font-bold text-white mb-4">
              {currentLesson.title}
            </h1>

            {/* Description */}
            {currentLesson.description && (
              <p className="text-gray-400 mb-8 max-w-3xl">
                {currentLesson.description}
              </p>
            )}

            {/* Resources */}
            {currentLesson.resources && currentLesson.resources.length > 0 && (
              <div className="mb-8">
                <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Materiály na stiahnutie
                </h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  {currentLesson.resources.map((resource: any, idx: number) => (
                    <a
                      key={idx}
                      href={resource.file?.url}
                      download
                      className="flex items-center gap-3 p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      <Download className="w-5 h-5 text-primary-400" />
                      <span className="text-gray-300">{resource.title}</span>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between pt-6 border-t border-gray-800">
              {prevLesson ? (
                <Link
                  href={`/kurzy/${slug}/lekcia/${prevLesson.moduleIndex}/${prevLesson.lessonIndex}`}
                  className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                  <div className="text-left">
                    <div className="text-xs text-gray-500">Predchádzajúca</div>
                    <div className="text-sm">{prevLesson.title}</div>
                  </div>
                </Link>
              ) : (
                <div />
              )}

              {nextLesson ? (
                <Link
                  href={`/kurzy/${slug}/lekcia/${nextLesson.moduleIndex}/${nextLesson.lessonIndex}`}
                  className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                >
                  <div className="text-right">
                    <div className="text-xs text-gray-500">Ďalšia</div>
                    <div className="text-sm">{nextLesson.title}</div>
                  </div>
                  <ChevronRight className="w-5 h-5" />
                </Link>
              ) : (
                <Link href={`/kurzy/${slug}`}>
                  <Button variant="default">
                    <CheckCircle className="w-4 h-4" />
                    Dokončiť kurz
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Toggle */}
      <button className="lg:hidden fixed bottom-6 right-6 w-14 h-14 bg-primary-500 text-white rounded-full shadow-lg flex items-center justify-center">
        <List className="w-6 h-6" />
      </button>
    </main>
  )
}

