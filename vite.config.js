import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const productionOrigin = "https://bakemehappyprueba.pages.dev";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api/uploads": {
        target: productionOrigin,
        changeOrigin: true,
        // Solo aplica al proxy local; el sitio publicado sigue usando HTTPS directo.
        secure: false,
        headers: {
          Origin: productionOrigin,
        },
      },
    },
  },
});
