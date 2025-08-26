export interface AgencyConfig {
  name: string
  logo?: string
  email: string
  phone: string
  address: string
  website?: string
  tagline?: string
}

export interface ThemeConfig {
  id: string
  name: string
  description: string
  colors: {
    primary: string
    secondary: string
    accent: string
    background: string
    surface: string
    text: string
    textSecondary: string
    border: string
  }
  fonts: {
    heading: string
    body: string
  }
  styles: {
    borderRadius: string
    shadow: string
    gradient: string
  }
}

export const themes: ThemeConfig[] = [
  {
    id: 'dark-luxe',
    name: 'Dark Luxe',
    description: 'Sophisticated dark theme with gold accents. Perfect for luxury and tech brands.',
    colors: {
      primary: '#d4af37',
      secondary: '#00ffff',
      accent: '#ffd700',
      background: '#0a0a0a',
      surface: '#1a1a1a',
      text: '#e2e8f0',
      textSecondary: '#a0a0a0',
      border: '#333333'
    },
    fonts: {
      heading: 'Inter, sans-serif',
      body: 'Inter, sans-serif'
    },
    styles: {
      borderRadius: '12px',
      shadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
      gradient: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)'
    }
  },
  {
    id: 'minimal-elegance',
    name: 'Minimal Elegance',
    description: 'Clean white background with subtle accents. Apple-inspired premium design.',
    colors: {
      primary: '#007AFF',
      secondary: '#5856D6',
      accent: '#FF9500',
      background: '#ffffff',
      surface: '#f8f9fa',
      text: '#1d1d1f',
      textSecondary: '#86868b',
      border: '#e5e5e7'
    },
    fonts: {
      heading: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif',
      body: 'SF Pro Text, -apple-system, BlinkMacSystemFont, sans-serif'
    },
    styles: {
      borderRadius: '8px',
      shadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      gradient: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)'
    }
  },
  {
    id: 'geometric-futurism',
    name: 'Geometric Futurism',
    description: 'Modern geometric shapes with vibrant gradients. Creative and tech-forward.',
    colors: {
      primary: '#6366f1',
      secondary: '#ec4899',
      accent: '#f59e0b',
      background: '#0f172a',
      surface: '#1e293b',
      text: '#f1f5f9',
      textSecondary: '#94a3b8',
      border: '#334155'
    },
    fonts: {
      heading: 'Inter, sans-serif',
      body: 'Inter, sans-serif'
    },
    styles: {
      borderRadius: '16px',
      shadow: '0 8px 32px rgba(99, 102, 241, 0.2)',
      gradient: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)'
    }
  },
  {
    id: 'corporate-modern',
    name: 'Corporate Modern',
    description: 'Professional blue and green palette. Perfect for B2B and corporate clients.',
    colors: {
      primary: '#2563eb',
      secondary: '#059669',
      accent: '#dc2626',
      background: '#ffffff',
      surface: '#f8fafc',
      text: '#1e293b',
      textSecondary: '#64748b',
      border: '#e2e8f0'
    },
    fonts: {
      heading: 'Inter, sans-serif',
      body: 'Inter, sans-serif'
    },
    styles: {
      borderRadius: '6px',
      shadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
      gradient: 'linear-gradient(135deg, #2563eb 0%, #059669 100%)'
    }
  },
  {
    id: 'magazine-style',
    name: 'Magazine Style',
    description: 'Bold typography with creative layouts. Perfect for creative industries.',
    colors: {
      primary: '#000000',
      secondary: '#dc2626',
      accent: '#fbbf24',
      background: '#ffffff',
      surface: '#fefefe',
      text: '#000000',
      textSecondary: '#6b7280',
      border: '#d1d5db'
    },
    fonts: {
      heading: 'Playfair Display, serif',
      body: 'Inter, sans-serif'
    },
    styles: {
      borderRadius: '0px',
      shadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
      gradient: 'linear-gradient(135deg, #000000 0%, #dc2626 100%)'
    }
  }
]

export const defaultAgencyConfig: AgencyConfig = {
  name: 'LoopXO',
  email: 'hello@loopxo.com',
  phone: '+91 98765 43210',
  address: 'Mumbai, Maharashtra, India',
  website: 'https://loopxo.com',
  tagline: 'A Digital Agency'
}

export function getTheme(themeId: string): ThemeConfig {
  return themes.find(theme => theme.id === themeId) || themes[0]
}

