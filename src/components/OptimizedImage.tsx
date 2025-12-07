'use client'

import Image, { ImageProps } from 'next/image'
import { useState } from 'react'
import { cn } from '@/lib/utils'

interface OptimizedImageProps extends Omit<ImageProps, 'onLoad'> {
  fallback?: string
}

/**
 * Optimalizovaný Image komponent s:
 * - Lazy loading
 * - Blur placeholder
 * - Error fallback
 * - Fade-in animácia
 */
export function OptimizedImage({
  src,
  alt,
  className,
  fallback = '/images/placeholder.jpg',
  ...props
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)

  return (
    <Image
      src={error ? fallback : src}
      alt={alt}
      className={cn(
        'duration-700 ease-in-out',
        isLoading ? 'scale-105 blur-lg' : 'scale-100 blur-0',
        className
      )}
      onLoad={() => setIsLoading(false)}
      onError={() => {
        setError(true)
        setIsLoading(false)
      }}
      loading="lazy"
      {...props}
    />
  )
}

/**
 * Hero obrázok s priority loading
 */
export function HeroImage({
  src,
  alt,
  className,
  ...props
}: Omit<OptimizedImageProps, 'priority'>) {
  const [isLoading, setIsLoading] = useState(true)

  return (
    <Image
      src={src}
      alt={alt}
      className={cn(
        'duration-500 ease-out',
        isLoading ? 'opacity-0' : 'opacity-100',
        className
      )}
      onLoad={() => setIsLoading(false)}
      priority
      {...props}
    />
  )
}

/**
 * Thumbnail obrázok
 */
export function ThumbnailImage({
  src,
  alt,
  className,
  ...props
}: OptimizedImageProps) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      className={cn('object-cover', className)}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      {...props}
    />
  )
}


