import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        // ─── Quanby Legal Brand Colors ──────────────────────────────────────
        // Primary: Deep Navy (matches quanbylegal.com)
        navy: {
          50:  '#f0f4ff',
          100: '#e0e9ff',
          200: '#c7d7fe',
          300: '#a5bafb',
          400: '#8194f8',
          500: '#6270f3',
          600: '#4f52e8',
          700: '#4140cd',
          800: '#3635a6',
          900: '#303283',
          950: '#0F172A',  // Brand deep navy
          DEFAULT: '#0F172A',
        },
        // Accent: Professional Blue
        brand: {
          50:  '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3B82F6',  // Brand accent blue
          600: '#2563eb',
          700: '#1E40AF',  // Brand professional blue
          800: '#1e3a8a',
          900: '#1e3066',
          950: '#172554',
          DEFAULT: '#1E40AF',
        },
        // shadcn/ui tokens mapped to Quanby palette
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        // Status colors for case management
        status: {
          active:    '#22c55e',
          pending:   '#f59e0b',
          urgent:    '#ef4444',
          hold:      '#8b5cf6',
          closed:    '#6b7280',
          won:       '#10b981',
          lost:      '#f43f5e',
        },
        // Priority colors
        priority: {
          urgent: '#dc2626',
          high:   '#ea580c',
          medium: '#ca8a04',
          low:    '#16a34a',
        },
        // Court/compliance gold
        gold: {
          50:  '#fffbeb',
          100: '#fef3c7',
          300: '#fcd34d',
          500: '#f59e0b',
          700: '#b45309',
          DEFAULT: '#f59e0b',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'monospace'],
        serif: ['Merriweather', 'Georgia', 'Cambria', 'serif'],
        legal: ['Times New Roman', 'Times', 'serif'], // For legal documents
      },
      fontSize: {
        'legal-sm': ['10pt', { lineHeight: '1.5' }],
        'legal-base': ['12pt', { lineHeight: '2' }],
        'legal-lg': ['14pt', { lineHeight: '2' }],
      },
      boxShadow: {
        'navy': '0 4px 14px 0 rgba(15, 23, 42, 0.15)',
        'brand': '0 4px 14px 0 rgba(30, 64, 175, 0.20)',
        'card-hover': '0 8px 30px rgba(15, 23, 42, 0.12)',
        'compliance': '0 0 0 2px rgba(245, 158, 11, 0.3)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in-from-left': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        'badge-pulse': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in': 'fade-in 0.3s ease-out',
        'slide-in': 'slide-in-from-left 0.3s ease-out',
        'badge-pulse': 'badge-pulse 2s ease-in-out infinite',
      },
      backgroundImage: {
        'navy-gradient': 'linear-gradient(135deg, #0F172A 0%, #1e3a8a 100%)',
        'brand-gradient': 'linear-gradient(135deg, #1E40AF 0%, #3B82F6 100%)',
        'gold-gradient': 'linear-gradient(135deg, #b45309 0%, #f59e0b 100%)',
        'compliance-stripe': 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(245,158,11,0.05) 10px, rgba(245,158,11,0.05) 20px)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}

export default config
