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
          50:  '#fef2f2', // red-50
          100: '#fee2e2', // red-100
          200: '#fecaca', // red-200
          300: '#fca5a5', // red-300
          400: '#f87171', // red-400
          500: '#ef4444', // red-500
          600: '#dc2626', // red-600
          700: '#b91c1c', // red-700
        },
        violet: {
          400: '#f87171', // mapped to red
          500: '#ef4444',
          600: '#dc2626',
        },
        cyan: {
          400: '#f87171', // mapped to red for compatibility
          500: '#dc2626',
        },
        indigo: {
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
        },
        dark: {
          900: '#0a0a0a', // near-black
          800: '#111111',
          700: '#1a1a1a',
          600: '#262626',
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-gradient': 'linear-gradient(135deg, #0a0a0a 0%, #111111 50%, #0a0a0a 100%)',
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
