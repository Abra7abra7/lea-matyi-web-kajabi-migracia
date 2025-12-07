'use client'

import React, { useState, useCallback } from 'react'
import { useField } from '@payloadcms/ui'

interface CloudflareVideoFieldProps {
  path: string
  label?: string
  required?: boolean
}

export const CloudflareVideoField: React.FC<CloudflareVideoFieldProps> = ({
  path,
  label = 'Cloudflare Video ID',
  required = false,
}) => {
  const { value, setValue } = useField<string>({ path })
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)

  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('video/')) {
      setError('Prosím nahrajte video súbor')
      return
    }

    // Max 200MB
    if (file.size > 200 * 1024 * 1024) {
      setError('Video nesmie presiahnuť 200MB')
      return
    }

    setUploading(true)
    setError(null)
    setProgress(0)

    try {
      // Step 1: Get upload URL from our API
      const initRes = await fetch('/api/cloudflare/upload-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: file.name,
          maxDurationSeconds: 3600 * 2, // 2 hours max
        }),
      })

      if (!initRes.ok) {
        const errorData = await initRes.json()
        throw new Error(errorData.error || 'Nepodarilo sa inicializovať upload')
      }

      const { uploadURL, videoId } = await initRes.json()

      // Step 2: Upload to Cloudflare Stream via TUS
      const xhr = new XMLHttpRequest()
      
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded / event.total) * 100)
          setProgress(percent)
        }
      })

      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          setValue(videoId)
          setUploading(false)
          setProgress(100)
        } else {
          throw new Error('Upload zlyhal')
        }
      })

      xhr.addEventListener('error', () => {
        throw new Error('Upload zlyhal')
      })

      xhr.open('POST', uploadURL)
      xhr.setRequestHeader('Content-Type', file.type)
      xhr.send(file)

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Nepodarilo sa nahrať video')
      setUploading(false)
    }
  }, [setValue])

  const handleManualInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value)
  }

  const clearVideo = () => {
    setValue('')
    setProgress(0)
    setError(null)
  }

  return (
    <div className="field-type text" style={{ marginBottom: '24px' }}>
      <label className="field-label" style={{
        display: 'block',
        marginBottom: '8px',
        fontSize: '13px',
        fontWeight: 500,
        color: 'var(--theme-elevation-800)',
      }}>
        {label}
        {required && <span style={{ color: '#ef4444', marginLeft: '4px' }}>*</span>}
      </label>

      {/* Current Value Display */}
      {value && (
        <div style={{
          marginBottom: '12px',
          padding: '16px',
          background: 'var(--theme-elevation-50)',
          borderRadius: '8px',
          border: '1px solid var(--theme-elevation-150)',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '12px',
          }}>
            <span style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: '#10b981',
              fontSize: '13px',
              fontWeight: 500,
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              Video nahrané
            </span>
            <button
              type="button"
              onClick={clearVideo}
              style={{
                padding: '4px 12px',
                fontSize: '12px',
                background: 'var(--theme-elevation-100)',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                color: 'var(--theme-elevation-600)',
              }}
            >
              Odstrániť
            </button>
          </div>
          
          {/* Video Preview */}
          <div style={{
            position: 'relative',
            paddingBottom: '56.25%',
            background: '#000',
            borderRadius: '6px',
            overflow: 'hidden',
          }}>
            <iframe
              src={`https://customer-${process.env.NEXT_PUBLIC_CLOUDFLARE_CUSTOMER_CODE || 'CUSTOMER_CODE'}.cloudflarestream.com/${value}/iframe`}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                border: 'none',
              }}
              allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
              allowFullScreen
            />
          </div>
          
          <div style={{
            marginTop: '8px',
            fontSize: '11px',
            color: 'var(--theme-elevation-500)',
            fontFamily: 'monospace',
          }}>
            ID: {value}
          </div>
        </div>
      )}

      {/* Upload Section */}
      {!value && (
        <div style={{
          border: '2px dashed var(--theme-elevation-200)',
          borderRadius: '8px',
          padding: '32px',
          textAlign: 'center',
          background: uploading ? 'var(--theme-elevation-50)' : 'transparent',
          transition: 'all 0.2s ease',
        }}>
          {uploading ? (
            <div>
              <div style={{
                width: '48px',
                height: '48px',
                margin: '0 auto 16px',
                borderRadius: '50%',
                border: '3px solid var(--theme-elevation-200)',
                borderTopColor: '#ec4899',
                animation: 'spin 1s linear infinite',
              }} />
              <p style={{
                fontSize: '14px',
                color: 'var(--theme-text)',
                marginBottom: '8px',
              }}>
                Nahrávam video...
              </p>
              <div style={{
                width: '100%',
                height: '8px',
                background: 'var(--theme-elevation-150)',
                borderRadius: '4px',
                overflow: 'hidden',
              }}>
                <div style={{
                  width: `${progress}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, #ec4899, #f43f5e)',
                  transition: 'width 0.3s ease',
                }} />
              </div>
              <p style={{
                marginTop: '8px',
                fontSize: '13px',
                color: 'var(--theme-elevation-500)',
              }}>
                {progress}%
              </p>
            </div>
          ) : (
            <>
              <svg 
                width="48" 
                height="48" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="var(--theme-elevation-400)"
                strokeWidth="1.5"
                style={{ margin: '0 auto 16px' }}
              >
                <path d="m16 6-4-4-4 4" />
                <path d="M12 2v13" />
                <path d="M20 15v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-4" />
              </svg>
              <p style={{
                fontSize: '14px',
                color: 'var(--theme-text)',
                marginBottom: '4px',
              }}>
                Pretiahnite video sem alebo
              </p>
              <label style={{
                display: 'inline-block',
                padding: '8px 16px',
                background: 'linear-gradient(135deg, #ec4899, #f43f5e)',
                color: 'white',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: 500,
                marginTop: '8px',
              }}>
                Vyberte súbor
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />
              </label>
              <p style={{
                marginTop: '12px',
                fontSize: '12px',
                color: 'var(--theme-elevation-500)',
              }}>
                Maximálna veľkosť: 200MB
              </p>
            </>
          )}
        </div>
      )}

      {/* Error */}
      {error && (
        <div style={{
          marginTop: '8px',
          padding: '8px 12px',
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.2)',
          borderRadius: '6px',
          color: '#ef4444',
          fontSize: '13px',
        }}>
          {error}
        </div>
      )}

      {/* Manual Input */}
      <div style={{ marginTop: '16px' }}>
        <details>
          <summary style={{
            fontSize: '12px',
            color: 'var(--theme-elevation-500)',
            cursor: 'pointer',
            marginBottom: '8px',
          }}>
            Alebo zadajte Cloudflare Video ID manuálne
          </summary>
          <input
            type="text"
            value={value || ''}
            onChange={handleManualInput}
            placeholder="napr. 5d5bc37ffcc12345678901234567890"
            style={{
              width: '100%',
              padding: '10px 12px',
              background: 'var(--theme-input-bg)',
              border: '1px solid var(--theme-elevation-150)',
              borderRadius: '6px',
              fontSize: '14px',
              color: 'var(--theme-text)',
              fontFamily: 'monospace',
            }}
          />
        </details>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

export default CloudflareVideoField


