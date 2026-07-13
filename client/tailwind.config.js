/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#12181F',
          light: '#1A222C',
          lighter: '#232D3A',
        },
        paper: '#F7F8FA',
        accent: {
          DEFAULT: '#FF6A3D',
          dark: '#E5551F',
          light: '#FFE4D8',
        },
        teal: {
          DEFAULT: '#2FA1A0',
          dark: '#238584',
          light: '#DCF3F2',
        },
        line: '#E4E7EC',
        muted: '#667085',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        soft: '0 1px 2px rgba(18,24,31,0.04), 0 4px 16px rgba(18,24,31,0.06)',
        card: '0 2px 8px rgba(18,24,31,0.05), 0 8px 24px rgba(18,24,31,0.06)',
        glow: '0 0 0 1px rgba(255,106,61,0.15), 0 8px 24px rgba(255,106,61,0.18)',
      },
      borderRadius: {
        xl2: '1.25rem',
      },
      keyframes: {
        'fade-in': { '0%': { opacity: 0, transform: 'translateY(6px)' }, '100%': { opacity: 1, transform: 'translateY(0)' } },
        'route-dash': { '0%': { strokeDashoffset: 24 }, '100%': { strokeDashoffset: 0 } },
      },
      animation: {
        'fade-in': 'fade-in 0.4s ease-out',
        'route-dash': 'route-dash 1.2s linear infinite',
      },
    },
  },
  plugins: [],
};
