/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#17366D",
        lavender: "#AAB3E5",
        "lavender-light": "#ECEEFC",
        blush: "#E49AAF",
        plum: "#765495",
        cream: "#FFF4ED",
        gold: "#BF9040",
      },
      fontFamily: {
        sans: ["Poppins", "sans-serif"],
        display: ["DM Serif Display", "serif"],
      },
      boxShadow: {
        soft: "0 18px 45px rgba(23, 54, 109, 0.10)",
        lift: "0 20px 50px rgba(23, 54, 109, 0.16)",
      },
      backgroundImage: {
        "soft-grid":
          "radial-gradient(circle at center, rgba(118,84,149,.14) 1px, transparent 1px)",
      },
    },
  },
  plugins: [],
};
