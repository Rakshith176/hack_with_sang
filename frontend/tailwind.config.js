/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        mesh: {
          bg: "#0B0F17",
          panel: "#111827",
          border: "#1F2937",
          accent: "#3B82F6",
          emerald: "#10B981",
          amber: "#F59E0B",
          rose: "#EF4444"
        }
      }
    },
  },
  plugins: [],
}