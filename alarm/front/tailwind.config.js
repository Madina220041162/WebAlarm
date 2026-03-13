/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class", // CRITICAL: This allows the .dark class to work
  theme: {
    extend: {
      colors: {
        "primary": "#6366f1",
        "secondary": "#f472b6",
        "accent": "#fbbf24",
        "danger": "#ef4444",
      },
      fontFamily: {
        "sans": ["Plus Jakarta Sans", "sans-serif"]
      },
      borderRadius: {
        "DEFAULT": "1rem",
        "lg": "1.5rem",
        "xl": "2.5rem",
      },
      animation: {
        'bounce-slow': 'bounce 3s infinite',
      }
    },
  },
  plugins: [],
}