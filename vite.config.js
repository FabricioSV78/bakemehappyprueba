import process from "node:process";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import {
  DEFAULT_SITE_URL,
  normalizeSiteUrl,
} from "./src/data/siteUrl.js";

const productionOrigin = DEFAULT_SITE_URL;

export default defineConfig(({ mode }) => {
  const environment = loadEnv(mode, process.cwd(), "");
  const siteUrl = normalizeSiteUrl(environment.VITE_SITE_URL);

  return {
    plugins: [
      react(),
      {
        name: "bake-me-happy-site-url",
        transformIndexHtml(html) {
          return html.replaceAll("__SITE_URL__", siteUrl);
        },
      },
    ],
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
  };
});
