import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Utility pre zlúčenie Tailwind tried
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formátuje cenu v EUR
 */
export function formatPrice(price: number, currency: string = 'EUR'): string {
  return new Intl.NumberFormat('sk-SK', {
    style: 'currency',
    currency,
  }).format(price)
}

/**
 * Formátuje dátum
 */
export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat('sk-SK', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(date))
}

/**
 * Vytvorí slug z textu
 */
export function createSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
}

/**
 * Truncate text
 */
export function truncate(text: string, length: number): string {
  if (text.length <= length) return text
  return text.slice(0, length).trim() + '...'
}

/**
 * Formát trvanie v minútach na hh:mm
 */
export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  
  if (hours === 0) return `${mins}min`
  if (mins === 0) return `${hours}h`
  return `${hours}h ${mins}min`
}


