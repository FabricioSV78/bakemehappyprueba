/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Cambio 2: tokens semánticos. Los alias existentes se conservan para
        // no alterar visualmente componentes previos ni dificultar reversiones.
        ink: "rgb(var(--color-ink) / <alpha-value>)",
        lavender: "rgb(var(--color-lavender) / <alpha-value>)",
        "lavender-light": "rgb(var(--color-lavender-light) / <alpha-value>)",
        blush: "rgb(var(--color-blush) / <alpha-value>)",
        plum: "rgb(var(--color-plum) / <alpha-value>)",
        cream: "rgb(var(--color-cream) / <alpha-value>)",
        gold: "rgb(var(--color-gold) / <alpha-value>)",
        brand: {
          ink: "rgb(var(--color-ink) / <alpha-value>)",
          lavender: "rgb(var(--color-lavender) / <alpha-value>)",
          blush: "rgb(var(--color-blush) / <alpha-value>)",
          plum: "rgb(var(--color-plum) / <alpha-value>)",
        },
        surface: {
          page: "rgb(var(--color-cream) / <alpha-value>)",
          soft: "rgb(var(--color-lavender-light) / <alpha-value>)",
          card: "rgb(var(--color-white) / <alpha-value>)",
        },
      },
      fontFamily: {
        // Super Dream conserva la identidad de los títulos; Poppins cubre
        // cuerpo, navegación y controles con archivos locales optimizados.
        sans: ["Poppins", "Arial", "sans-serif"],
        display: ["Super Dream", "Poppins", "Arial", "sans-serif"],
        accent: ["MindBlue", "Caveat", "cursive"],
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
