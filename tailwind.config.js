/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        orbitron: ['Orbitron', 'monospace'],
        inter: ['Inter', 'sans-serif'],
      },
      colors: {
        primary: {
          50:  '#f5f3ff', // violet-50
          100: '#ede9fe', // violet-100
          400: '#a78bfa', // violet-400
          500: '#8b5cf6', // violet-500
          600: '#7c3aed', // violet-600
          700: '#6d28d9', // violet-700
        },
        violet: {
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
        },
        cyan: {
          400: '#a78bfa', // mapped to purple for compatibility
          500: '#7c3aed',
        },
        dark: {
          900: '#fafafa', // mapped to bright colors
          800: '#f3f4f6',
          700: '#e5e7eb',
          600: '#d1d5db',
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-gradient': 'linear-gradient(135deg, #ffffff 0%, #f3f4f6 50%, #fafafa 100%)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'typewriter': 'typewriter 3s steps(40) forwards',
        'gradient-shift': 'gradientShift 8s ease infinite',
        'spin-slow': 'spin 8s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        gradientShift: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
