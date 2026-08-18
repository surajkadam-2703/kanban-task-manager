/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        kanban: {
          bg: "#020617",
          card: "#020617",
          border: "#1f2937",
          primary: "#6366f1",
          primarySoft: "#4f46e5",
          accent: "#22d3ee",
        },
      },
      boxShadow: {
        glow: "0 0 40px rgba(79, 70, 229, 0.35)",
      },
    },
  },
  plugins: [],
};