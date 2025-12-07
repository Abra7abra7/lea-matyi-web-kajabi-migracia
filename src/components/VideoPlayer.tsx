'use client'

import { useEffect, useRef, useState } from 'react'
import { PlayCircle, Pause, Volume2, VolumeX, Maximize, Settings, Loader2 } from 'lucide-react'

interface VideoPlayerProps {
  videoId: string
  signedToken?: string
  poster?: string
  title?: string
  onProgress?: (progress: number) => void
  onComplete?: () => void
  autoplay?: boolean
}

export function VideoPlayer({
  videoId,
  signedToken,
  poster,
  title,
  onProgress,
  onComplete,
  autoplay = false,
}: VideoPlayerProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Cloudflare Stream iframe URL
  const accountId = process.env.NEXT_PUBLIC_CLOUDFLARE_ACCOUNT_ID
  
  // Ak máme signed token, použijeme ho
  const videoSrc = signedToken
    ? `https://customer-${accountId}.cloudflarestream.com/${signedToken}/iframe`
    : `https://customer-${accountId}.cloudflarestream.com/${videoId}/iframe`

  // Parameters pre iframe
  const params = new URLSearchParams({
    autoplay: autoplay ? 'true' : 'false',
    preload: 'auto',
    loop: 'false',
    muted: 'false',
    controls: 'true',
    defaultTextTrack: 'sk',
  })

  const iframeSrc = `${videoSrc}?${params.toString()}`

  useEffect(() => {
    // Listen for messages from iframe (progress, completion, etc.)
    const handleMessage = (event: MessageEvent) => {
      if (event.origin.includes('cloudflarestream.com')) {
        const { type, data } = event.data || {}
        
        switch (type) {
          case 'progress':
            onProgress?.(data.percent)
            break
          case 'ended':
            onComplete?.()
            break
          case 'error':
            setError('Nastala chyba pri prehrávaní videa')
            break
        }
      }
    }

    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [onProgress, onComplete])

  // Fallback ak nie je nakonfigurovaný Cloudflare
  if (!accountId) {
    return (
      <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center">
        <div className="text-center text-gray-400">
          <PlayCircle className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p className="text-sm">Video prehrávač</p>
          <p className="text-xs mt-1 opacity-70">Cloudflare Stream nie je nakonfigurovaný</p>
          <p className="text-xs mt-1 opacity-50">Video ID: {videoId}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative aspect-video bg-black rounded-lg overflow-hidden group">
      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 z-10">
          <div className="text-center text-white">
            <Loader2 className="w-12 h-12 animate-spin mx-auto mb-2" />
            <p className="text-sm opacity-70">Načítavam video...</p>
          </div>
        </div>
      )}

      {/* Error overlay */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 z-10">
          <div className="text-center text-white">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <PlayCircle className="w-8 h-8 text-red-400" />
            </div>
            <p className="text-sm">{error}</p>
            <button 
              onClick={() => {
                setError(null)
                setIsLoading(true)
              }}
              className="mt-4 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm transition-colors"
            >
              Skúsiť znova
            </button>
          </div>
        </div>
      )}

      {/* Cloudflare Stream iframe */}
      <iframe
        ref={iframeRef}
        src={iframeSrc}
        style={{
          border: 'none',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
        }}
        allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
        allowFullScreen
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false)
          setError('Nepodarilo sa načítať video')
        }}
      />

      {/* Title overlay (shows on hover) */}
      {title && (
        <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          <h3 className="text-white font-medium truncate">{title}</h3>
        </div>
      )}
    </div>
  )
}

/**
 * Jednoduchý video placeholder pre demo účely
 */
export function VideoPlaceholder({ 
  videoId, 
  title 
}: { 
  videoId: string
  title?: string 
}) {
  return (
    <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg flex items-center justify-center">
      <div className="text-center">
        <div className="w-20 h-20 bg-primary-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <PlayCircle className="w-10 h-10 text-primary-400" />
        </div>
        {title && (
          <p className="text-white font-medium mb-2">{title}</p>
        )}
        <p className="text-gray-400 text-sm">Video ID: {videoId}</p>
        <p className="text-gray-500 text-xs mt-2">
          Cloudflare Stream integrácia
        </p>
      </div>
    </div>
  )
}

