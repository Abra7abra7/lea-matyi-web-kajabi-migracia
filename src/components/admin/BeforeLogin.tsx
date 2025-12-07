'use client'

import React from 'react'

export const BeforeLogin: React.FC = () => {
  return (
    <div style={{
      textAlign: 'center',
      marginBottom: '24px',
    }}>
      {/* Logo */}
      <div style={{
        width: '64px',
        height: '64px',
        borderRadius: '16px',
        background: 'linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 16px',
        boxShadow: '0 8px 24px rgba(236, 72, 153, 0.3)',
      }}>
        <svg 
          width="36" 
          height="36" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="white" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
          <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
        </svg>
      </div>
      
      {/* Title */}
      <h1 style={{
        fontSize: '24px',
        fontWeight: 700,
        color: 'var(--theme-text)',
        marginBottom: '8px',
      }}>
        Beauty Academy
      </h1>
      
      {/* Subtitle */}
      <p style={{
        fontSize: '14px',
        color: 'var(--theme-elevation-500)',
      }}>
        Administračný panel pre správu kurzov
      </p>
    </div>
  )
}

export default BeforeLogin


