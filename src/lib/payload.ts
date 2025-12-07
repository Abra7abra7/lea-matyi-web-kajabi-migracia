import { getPayload } from 'payload'
import config from '@payload-config'

// Singleton pattern pre Payload instanciu
let payloadInstance: Awaited<ReturnType<typeof getPayload>> | null = null

/**
 * Získa Payload instanciu (Server-side only)
 */
export async function getPayloadClient() {
  if (payloadInstance) return payloadInstance
  
  payloadInstance = await getPayload({ config })
  return payloadInstance
}

/**
 * Získa všetky publikované kurzy
 */
export async function getPublishedCourses() {
  const payload = await getPayloadClient()
  
  const courses = await payload.find({
    collection: 'courses',
    where: {
      status: {
        equals: 'published',
      },
    },
    sort: '-createdAt',
    depth: 1,
  })
  
  return courses.docs
}

/**
 * Získa kurz podľa slug
 */
export async function getCourseBySlug(slug: string) {
  const payload = await getPayloadClient()
  
  const courses = await payload.find({
    collection: 'courses',
    where: {
      slug: {
        equals: slug,
      },
    },
    depth: 2,
    limit: 1,
  })
  
  return courses.docs[0] || null
}

/**
 * Získa používateľa podľa ID
 */
export async function getUserById(id: string) {
  const payload = await getPayloadClient()
  
  const user = await payload.findByID({
    collection: 'users',
    id,
    depth: 1,
  })
  
  return user
}

/**
 * Aktualizuje progress používateľa v kurze
 */
export async function updateCourseProgress(
  userId: string,
  courseId: string,
  lessonKey: string // format: "moduleIndex-lessonIndex"
) {
  const payload = await getPayloadClient()
  
  const user = await payload.findByID({
    collection: 'users',
    id: userId,
    depth: 0,
  })
  
  const courseProgress = (user.courseProgress as any[]) || []
  const existingProgress = courseProgress.find((p: any) => p.course === courseId)
  
  if (existingProgress) {
    const completedLessons = existingProgress.completedLessons || []
    if (!completedLessons.includes(lessonKey)) {
      completedLessons.push(lessonKey)
    }
    
    existingProgress.completedLessons = completedLessons
    existingProgress.lastWatchedLesson = lessonKey
  } else {
    courseProgress.push({
      course: courseId,
      completedLessons: [lessonKey],
      lastWatchedLesson: lessonKey,
      percentComplete: 0,
    })
  }
  
  await payload.update({
    collection: 'users',
    id: userId,
    data: {
      courseProgress,
    },
  })
}


