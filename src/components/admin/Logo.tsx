'use client'

import React from 'react'

export const Logo: React.FC = () => {
  return (
    <div className="logo-wrapper" style={{
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '8px 0',
    }}>
      {/* Gradient Icon */}
      <div style={{
        width: '40px',
        height: '40px',
        borderRadius: '10px',
        background: 'linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 14px rgba(236, 72, 153, 0.3)',
      }}>
        <svg 
          width="24" 
          height="24" 
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
      
      {/* Text */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
      }}>
        <span style={{
          fontSize: '16px',
          fontWeight: 700,
          color: 'var(--theme-text)',
          lineHeight: 1.2,
        }}>
          Beauty Academy
        </span>
        <span style={{
          fontSize: '11px',
          color: 'var(--theme-elevation-500)',
          fontWeight: 500,
        }}>
          Admin Panel
        </span>
      </div>
    </div>
  )
}

export default Logo

