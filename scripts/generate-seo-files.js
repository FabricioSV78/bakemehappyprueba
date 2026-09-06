import { writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { loadEnv } from "vite";
import { categories, products } from "../src/data/products.js";
import {
  getAbsoluteSiteUrl,
  normalizeSiteUrl,
} from "../src/data/siteUrl.js";

const projectRoot = fileURLToPath(new URL("../", import.meta.url));
const publicDirectory = new URL("../public/", import.meta.url);
const environment = {
  ...loadEnv("production", projectRoot, ""),
  ...process.env,
};
const siteUrl = normalizeSiteUrl(environment.VITE_SITE_URL);
const catalogProducts = products.filter((product) =>
  categories.includes(product.category),
);
const pagePaths = [
  "/",
  "/quienes-somos",
  "/tienda",
  "/pedido",
  ...catalogProducts.map((product) => `/producto/${product.id}`),
];

function escapeXml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

const sitemapEntries = pagePaths
  .map(
    (path) =>
      `  <url>\n    <loc>${escapeXml(getAbsoluteSiteUrl(path, siteUrl))}</loc>\n  </url>`,
  )
  .join("\n");
const sitemap = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  sitemapEntries,
  "</urlset>",
  "",
].join("\n");
const robots = [
  "User-agent: *",
  "Allow: /",
  "Disallow: /api/",
  "",
  `Sitemap: ${getAbsoluteSiteUrl("/sitemap.xml", siteUrl)}`,
  "",
].join("\n");

await Promise.all([
  writeFile(new URL("sitemap.xml", publicDirectory), sitemap, "utf8"),
  writeFile(new URL("robots.txt", publicDirectory), robots, "utf8"),
]);

console.log(
  `SEO preparado: ${pagePaths.length} URL(s) publicas en sitemap.xml.`,
);
