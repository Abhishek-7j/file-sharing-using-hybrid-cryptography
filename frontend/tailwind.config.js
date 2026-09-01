/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          bg: "#020617",
          card: "rgba(15, 23, 42, 0.65)",
          border: "rgba(56, 189, 248, 0.2)",
          cyan: "#00f0ff",
          blue: "#3b82f6",
          navy: "#0b132b",
          indigo: "#1c2541",
          gold: "#f59e0b",
          emerald: "#10b981",
          rose: "#f43f5e"
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace']
      },
      boxShadow: {
        'cyan-glow': '0 0 25px rgba(0, 240, 255, 0.35)',
        'blue-glow': '0 0 25px rgba(59, 130, 246, 0.35)',
        'rose-glow': '0 0 25px rgba(244, 63, 94, 0.35)',
        'hud': '0 8px 32px 0 rgba(0, 0, 0, 0.45)'
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 20s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'scan': 'scan 3s linear infinite'
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        scan: {
          '0%': { top: '0%' },
          '100%': { top: '100%' }
        }
      }
    },
  },
  plugins: [],
}
