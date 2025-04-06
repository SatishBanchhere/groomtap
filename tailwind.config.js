/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#E6EFEF',
          100: '#CCDFE0',
          200: '#99BFC0',
          300: '#669FA0',
          400: '#337F80',
          500: '#3B7B7B', // Main teal color
          600: '#2A6364',
          700: '#1F4A4B',
          800: '#153233',
          900: '#0A191A',
        },
        secondary: {
          50: '#E6F4F6',
          100: '#CCE9ED',
          200: '#99D3DB',
          300: '#66BDC9',
          400: '#33A7B7',
          500: '#0091A5',
          600: '#007484',
          700: '#005763',
          800: '#003A42',
          900: '#001D21',
        },
        background: '#F8F5F5',
        surface: '#FFFFFF',
        text: {
          primary: '#1E293B',
          secondary: '#64748B',
          muted: '#94A3B8'
        }
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' }
        },
        pulse: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.5 }
        },
        wave: {
          '0%': { transform: 'rotate(0.0deg)' },
          '10%': { transform: 'rotate(14deg)' },
          '20%': { transform: 'rotate(-8deg)' },
          '30%': { transform: 'rotate(14deg)' },
          '40%': { transform: 'rotate(-4deg)' },
          '50%': { transform: 'rotate(10.0deg)' },
          '60%': { transform: 'rotate(0.0deg)' },
          '100%': { transform: 'rotate(0.0deg)' },
        },
        bounce: {
          '0%, 100%': { 
            transform: 'translateY(-5%)',
            animationTimingFunction: 'cubic-bezier(0.8, 0, 1, 1)'
          },
          '50%': {
            transform: 'translateY(0)',
            animationTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)'
          }
        },
        slideUp: {
          '0%': { 
            transform: 'translateY(100%)',
            opacity: 0
          },
          '100%': {
            transform: 'translateY(0)',
            opacity: 1
          }
        },
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 }
        },
        scaleIn: {
          '0%': { 
            transform: 'scale(0.9)',
            opacity: 0
          },
          '100%': {
            transform: 'scale(1)',
            opacity: 1
          }
        },
        rotateIn: {
          '0%': { 
            transform: 'rotate(-180deg)',
            opacity: 0
          },
          '100%': {
            transform: 'rotate(0)',
            opacity: 1
          }
        }
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        pulse: 'pulse 3s ease-in-out infinite',
        wave: 'wave 2.5s ease-in-out infinite',
        bounce: 'bounce 1s infinite',
        slideUp: 'slideUp 0.5s ease-out',
        fadeIn: 'fadeIn 0.5s ease-out',
        scaleIn: 'scaleIn 0.5s ease-out',
        rotateIn: 'rotateIn 0.5s ease-out'
      }
    },
  },
  plugins: [],
} 