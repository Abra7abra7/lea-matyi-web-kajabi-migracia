import { cookies } from 'next/headers'

// Types
export interface User {
  id: string
  email: string
  firstName?: string
  lastName?: string
  role: 'admin' | 'customer'
  purchasedCourses?: { id: string }[]
}

export interface AuthResult {
  user: User | null
  token: string | null
}

// Payload cookie name
const PAYLOAD_TOKEN_COOKIE = 'payload-token'

/**
 * Získa aktuálne prihláseného používateľa (Server Component)
 */
export async function getCurrentUser(): Promise<User | null> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get(PAYLOAD_TOKEN_COOKIE)?.value
    
    if (!token) return null
    
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/users/me`,
      {
        headers: {
          Authorization: `JWT ${token}`,
        },
        cache: 'no-store',
      }
    )
    
    if (!response.ok) return null
    
    const data = await response.json()
    return data.user || null
  } catch (error) {
    console.error('Error getting current user:', error)
    return null
  }
}

/**
 * Prihlásenie používateľa
 */
export async function login(email: string, password: string): Promise<AuthResult> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/users/login`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    }
  )
  
  const data = await response.json()
  
  if (!response.ok) {
    throw new Error(data.message || 'Prihlásenie zlyhalo')
  }
  
  return {
    user: data.user,
    token: data.token,
  }
}

/**
 * Registrácia nového používateľa
 */
export async function register(
  email: string,
  password: string,
  firstName?: string,
  lastName?: string
): Promise<AuthResult> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/users`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
        firstName,
        lastName,
        role: 'customer',
      }),
    }
  )
  
  const data = await response.json()
  
  if (!response.ok) {
    throw new Error(data.message || 'Registrácia zlyhala')
  }
  
  // Po registrácii automaticky prihlásiť
  return login(email, password)
}

/**
 * Odhlásenie používateľa
 */
export async function logout(): Promise<void> {
  await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/users/logout`,
    {
      method: 'POST',
      credentials: 'include',
    }
  )
}

/**
 * Reset hesla - poslanie emailu
 */
export async function forgotPassword(email: string): Promise<void> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/users/forgot-password`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    }
  )
  
  if (!response.ok) {
    const data = await response.json()
    throw new Error(data.message || 'Nepodarilo sa odoslať email')
  }
}

/**
 * Reset hesla - nastavenie nového
 */
export async function resetPassword(token: string, password: string): Promise<void> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/users/reset-password`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token, password }),
    }
  )
  
  if (!response.ok) {
    const data = await response.json()
    throw new Error(data.message || 'Nepodarilo sa resetovať heslo')
  }
}

/**
 * Kontrola či používateľ vlastní kurz
 */
export function userOwnsCourse(user: User | null, courseId: string): boolean {
  if (!user) return false
  if (user.role === 'admin') return true
  
  return user.purchasedCourses?.some(course => course.id === courseId) ?? false
}


