/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#1E3264",
        lavender: "#C8CDF7",
        "lavender-light": "#F2F3FF",
        blush: "#F7C8D8",
        plum: "#8E75B6",
        cream: "#FFF8F3",
        gold: "#D8A84F",
      },
      fontFamily: {
        sans: ["Poppins", "sans-serif"],
        display: ["DM Serif Display", "serif"],
      },
      boxShadow: {
        soft: "0 18px 45px rgba(30, 50, 100, 0.10)",
        lift: "0 20px 50px rgba(30, 50, 100, 0.16)",
      },
      backgroundImage: {
        "soft-grid":
          "radial-gradient(circle at center, rgba(142,117,182,.15) 1px, transparent 1px)",
      },
    },
  },
  plugins: [],
};
