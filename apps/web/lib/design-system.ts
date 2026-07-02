// Design System Constants - Matching Landing Page Style
// This ensures consistency across the entire application

export const colors = {
  // Primary Brand Colors (from landing page)
  electricBlue: '#00D4FF',
  neonOrange: '#FF6B35',
  electricViolet: '#8B5CF6',

  // Backgrounds
  darkBg: {
    primary: 'rgb(15, 23, 42)',    // slate-900
    secondary: 'rgb(30, 41, 59)',   // slate-800
    tertiary: 'rgb(51, 65, 85)',    // slate-700
  },

  lightBg: {
    primary: 'rgb(249, 250, 251)',  // gray-50
    secondary: 'rgb(255, 255, 255)', // white
    tertiary: 'rgb(243, 244, 246)',  // gray-100
  },

  // Text Colors
  text: {
    primary: 'rgb(15, 23, 42)',      // slate-900
    secondary: 'rgb(71, 85, 105)',    // slate-600
    tertiary: 'rgb(148, 163, 184)',   // slate-400
    inverse: 'rgb(255, 255, 255)',    // white
    muted: 'rgb(148, 163, 184)',      // slate-400
  },

  // Status Colors
  success: '#10B981',  // green-500
  error: '#EF4444',    // red-500
  warning: '#F59E0B',  // amber-500
  info: '#3B82F6',     // blue-500
} as const

export const gradients = {
  primary: 'bg-gradient-to-r from-[#00D4FF] to-[#8B5CF6]',
  secondary: 'bg-gradient-to-r from-[#FF6B35] to-[#EF4444]',
  accent: 'bg-gradient-to-r from-[#8B5CF6] to-[#EC4899]',
  dark: 'bg-gradient-to-br from-slate-900 via-slate-800 to-black',
} as const

export const shadows = {
  sm: 'shadow-sm',
  md: 'shadow-md',
  lg: 'shadow-lg',
  xl: 'shadow-xl',
  '2xl': 'shadow-2xl',
  primary: 'shadow-lg shadow-[#00D4FF]/25 hover:shadow-[#00D4FF]/40',
  secondary: 'shadow-lg shadow-[#FF6B35]/25 hover:shadow-[#FF6B35]/40',
  accent: 'shadow-lg shadow-[#8B5CF6]/25 hover:shadow-[#8B5CF6]/40',
} as const

export const spacing = {
  xs: '0.5rem',   // 8px
  sm: '0.75rem',  // 12px
  md: '1rem',     // 16px
  lg: '1.5rem',   // 24px
  xl: '2rem',     // 32px
  '2xl': '3rem',  // 48px
} as const

export const borderRadius = {
  sm: '0.375rem',  // 6px
  md: '0.5rem',    // 8px
  lg: '0.75rem',   // 12px
  xl: '1rem',      // 16px
  '2xl': '1.5rem', // 24px
  full: '9999px',
} as const

export const typography = {
  fontFamily: {
    sans: 'ui-sans-serif, system-ui, sans-serif',
    inter: "'Inter', ui-sans-serif, system-ui, sans-serif",
  },
  fontSize: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem',// 30px
    '4xl': '2.25rem', // 36px
  },
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    black: '900',
  },
} as const

// Currency configuration
export const currencies = {
  USD: { symbol: '$', code: 'USD', name: 'US Dollar' },
  EUR: { symbol: '€', code: 'EUR', name: 'Euro' },
  GBP: { symbol: '£', code: 'GBP', name: 'British Pound' },
  INR: { symbol: '₹', code: 'INR', name: 'Indian Rupee' },
  CAD: { symbol: 'C$', code: 'CAD', name: 'Canadian Dollar' },
  AUD: { symbol: 'A$', code: 'AUD', name: 'Australian Dollar' },
} as const

export type CurrencyCode = keyof typeof currencies

// Country/Region to Currency mapping
export const countryCurrencyMap: Record<string, CurrencyCode> = {
  // United States
  'United States': 'USD',
  'USA': 'USD',
  'US': 'USD',

  // India
  'India': 'INR',
  'Maharashtra': 'INR',
  'Mumbai': 'INR',

  // United Kingdom
  'United Kingdom': 'GBP',
  'UK': 'GBP',
  'England': 'GBP',
  'Scotland': 'GBP',
  'Wales': 'GBP',

  // European Union
  'Germany': 'EUR',
  'France': 'EUR',
  'Spain': 'EUR',
  'Italy': 'EUR',
  'Netherlands': 'EUR',

  // Canada
  'Canada': 'CAD',

  // Australia
  'Australia': 'AUD',
}

// Helper function to detect currency from client location/country
export function getCurrencyFromLocation(location: string): CurrencyCode {
  // Check if location contains any country/region name
  for (const [country, currency] of Object.entries(countryCurrencyMap)) {
    if (location.toLowerCase().includes(country.toLowerCase())) {
      return currency
    }
  }
  // Default to INR for India-based clients (since default address is in Mumbai)
  return 'INR'
}

// Default currency (can be changed based on user preference)
export const DEFAULT_CURRENCY: CurrencyCode = 'INR'

// Helper function to format currency
export function formatCurrency(amount: number, currency: CurrencyCode = DEFAULT_CURRENCY): string {
  const currencyInfo = currencies[currency]
  return `${currencyInfo.symbol}${amount.toLocaleString()}`
}

// Tailwind class utilities
export const buttonClasses = {
  primary: `bg-gradient-to-r from-[#00D4FF] to-[#8B5CF6] hover:from-[#00D4FF]/80 hover:to-[#8B5CF6]/80 text-white font-bold shadow-lg shadow-[#00D4FF]/25 hover:shadow-[#00D4FF]/40 transition-all duration-300`,
  secondary: `border-2 border-[#00D4FF] text-[#00D4FF] hover:bg-[#00D4FF] hover:text-slate-900 font-bold transition-all duration-300`,
  accent: `bg-gradient-to-r from-[#FF6B35] to-[#EF4444] hover:from-[#FF6B35]/80 hover:to-[#EF4444]/80 text-white font-bold shadow-lg shadow-[#FF6B35]/25 hover:shadow-[#FF6B35]/40 transition-all duration-300`,
} as const

export const cardClasses = {
  default: 'bg-white rounded-lg border border-slate-200 shadow-md hover:shadow-lg transition-all duration-300',
  dark: 'bg-slate-900/50 backdrop-blur-sm border-2 border-slate-700 shadow-2xl hover:shadow-[#00D4FF]/20 transition-all duration-300',
} as const

export const inputClasses = {
  default: 'w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#00D4FF] focus:ring-2 focus:ring-[#00D4FF]/20 transition-colors',
  error: 'border-red-500 focus:border-red-500 focus:ring-red-500/20',
} as const

export const labelClasses = {
  default: 'block text-sm font-medium text-slate-700 mb-2',
  required: 'block text-sm font-medium text-slate-700 mb-2 after:content-["*"] after:ml-0.5 after:text-red-500',
} as const
