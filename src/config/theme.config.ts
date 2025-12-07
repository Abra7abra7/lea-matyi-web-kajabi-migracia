export const themeConfig = {
  // ═══════════════════════════════════════════════════════════
  // FARBY - Primárna paleta
  // ═══════════════════════════════════════════════════════════
  colors: {
    primary: {
      50: '#fdf2f8',
      100: '#fce7f3',
      200: '#fbcfe8',
      300: '#f9a8d4',
      400: '#f472b6',
      500: '#ec4899',
      600: '#db2777',
      700: '#be185d',
      800: '#9d174d',
      900: '#831843',
      950: '#500724',
    },
    
    secondary: {
      50: '#faf5ff',
      100: '#f3e8ff',
      200: '#e9d5ff',
      300: '#d8b4fe',
      400: '#c084fc',
      500: '#a855f7',
      600: '#9333ea',
      700: '#7c3aed',
      800: '#6b21a8',
      900: '#581c87',
      950: '#3b0764',
    },
    
    accent: {
      50: '#fffbeb',
      100: '#fef3c7',
      200: '#fde68a',
      300: '#fcd34d',
      400: '#fbbf24',
      500: '#f59e0b',
      600: '#d97706',
      700: '#b45309',
      800: '#92400e',
      900: '#78350f',
      950: '#451a03',
    },
    
    success: {
      50: '#f0fdf4',
      500: '#22c55e',
      700: '#15803d',
    },
    
    error: {
      50: '#fef2f2',
      500: '#ef4444',
      700: '#b91c1c',
    },
  },
  
  // ═══════════════════════════════════════════════════════════
  // GRADIENTY
  // ═══════════════════════════════════════════════════════════
  gradients: {
    hero: 'from-pink-50 via-white to-rose-50',
    heroDark: 'from-gray-900 via-gray-800 to-gray-900',
    text: 'from-pink-500 to-rose-500',
    textAlt: 'from-pink-500 to-purple-500',
    button: 'from-pink-500 to-pink-600',
    buttonHover: 'from-pink-600 to-pink-700',
    cardOverlay: 'from-black/60 to-transparent',
  },
  
  // ═══════════════════════════════════════════════════════════
  // FONTY
  // ═══════════════════════════════════════════════════════════
  fonts: {
    heading: {
      name: 'Playfair Display',
      weights: [400, 500, 600, 700],
      fallback: 'serif',
    },
    body: {
      name: 'Inter',
      weights: [400, 500, 600, 700],
      fallback: 'sans-serif',
    },
  },
  
  // ═══════════════════════════════════════════════════════════
  // BORDER RADIUS
  // ═══════════════════════════════════════════════════════════
  radius: {
    none: '0',
    sm: '0.25rem',
    DEFAULT: '0.5rem',
    md: '0.75rem',
    lg: '1rem',
    xl: '1.5rem',
    '2xl': '2rem',
    full: '9999px',
  },
  
  // ═══════════════════════════════════════════════════════════
  // BOX SHADOWS
  // ═══════════════════════════════════════════════════════════
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
    glow: '0 4px 14px 0 rgba(236, 72, 153, 0.4)',
    glowLg: '0 8px 25px 0 rgba(236, 72, 153, 0.5)',
  },
  
  // ═══════════════════════════════════════════════════════════
  // ANIMÁCIE
  // ═══════════════════════════════════════════════════════════
  animation: {
    duration: {
      instant: '0ms',
      fast: '150ms',
      DEFAULT: '300ms',
      slow: '500ms',
      slower: '700ms',
    },
    easing: {
      DEFAULT: 'cubic-bezier(0.4, 0, 0.2, 1)',
      in: 'cubic-bezier(0.4, 0, 1, 1)',
      out: 'cubic-bezier(0, 0, 0.2, 1)',
      inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    },
  },
  
  // ═══════════════════════════════════════════════════════════
  // SPACING
  // ═══════════════════════════════════════════════════════════
  spacing: {
    section: '6rem',
    container: '1.5rem',
  },
} as const

export type ThemeConfig = typeof themeConfig


