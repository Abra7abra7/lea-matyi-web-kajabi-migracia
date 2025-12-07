'use client'

import React from 'react'

export const Icon: React.FC = () => {
  return (
    <div style={{
      width: '32px',
      height: '32px',
      borderRadius: '8px',
      background: 'linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <svg 
        width="18" 
        height="18" 
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
  )
}

export default Icon


