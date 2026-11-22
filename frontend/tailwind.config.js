/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Premium Dark Blue / Indigo base
                brand: {
                    50: '#EEF2FF',
                    100: '#E0E7FF',
                    200: '#C7D2FE',
                    300: '#A5B4FC',
                    400: '#818CF8',
                    500: '#6366F1',
                    600: '#4F46E5',
                    700: '#4338CA',
                    800: '#3730A3',
                    900: '#312E81',
                    950: '#1E1B4B',
                },
                // Vibrant Violet/Fuchsia for gradients and accents
                accent: {
                    50: '#FDF4FF',
                    100: '#FAE8FF',
                    200: '#F0D0FF',
                    300: '#E879F9',
                    400: '#D946EF',
                    500: '#C026D3',
                    600: '#A21CAF',
                    700: '#86198F',
                    800: '#701A75',
                    900: '#4A044E',
                },
                // Gold for premium/promotions
                gold: {
                    50: '#FFFBEB',
                    100: '#FEF3C7',
                    400: '#FBBF24',
                    500: '#F59E0B',
                    600: '#D97706',
                },
                // Custom slate extension
                slate: {
                    850: '#1A2235',
                    925: '#0D1526',
                    975: '#070C1A',
                },
            },
            fontFamily: {
                sans: ['Plus Jakarta Sans', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
                heading: ['Outfit', 'sans-serif'],
            },
            animation: {
                'fade-in': 'fadeIn 0.5s ease-out',
                'slide-up': 'slideUp 0.5s ease-out',
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'gradient': 'gradient-x 4s ease infinite',
                'float': 'float 6s ease-in-out infinite',
                'spin-slow': 'spin 8s linear infinite',
                'ping-slow': 'ping-slow 2s ease-out infinite',
                'shimmer': 'shimmer 2s linear infinite',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(10px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                'gradient-x': {
                    '0%, 100%': { backgroundPosition: '0% 50%' },
                    '50%': { backgroundPosition: '100% 50%' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-12px)' },
                },
                'ping-slow': {
                    '0%': { transform: 'scale(1)', opacity: '0.6' },
                    '100%': { transform: 'scale(2)', opacity: '0' },
                },
                shimmer: {
                    '0%': { backgroundPosition: '-200% 0' },
                    '100%': { backgroundPosition: '200% 0' },
                },
            },
            backgroundSize: {
                '200%': '200% 200%',
            },
            boxShadow: {
                'glow-brand': '0 0 30px rgba(99, 102, 241, 0.35)',
                'glow-brand-lg': '0 0 60px rgba(99, 102, 241, 0.45)',
                'glow-accent': '0 0 30px rgba(192, 38, 211, 0.35)',
                'glow-white': '0 0 30px rgba(255, 255, 255, 0.1)',
                'inner-glow': 'inset 0 0 30px rgba(99, 102, 241, 0.1)',
                'card': '0 4px 24px rgba(0,0,0,0.08)',
                'card-hover': '0 20px 60px rgba(0,0,0,0.15)',
                'card-dark': '0 4px 30px rgba(0,0,0,0.4)',
                'card-dark-hover': '0 20px 60px rgba(0,0,0,0.6)',
            },
            backdropBlur: {
                xs: '2px',
            },
        },
    },
    plugins: [],
}
