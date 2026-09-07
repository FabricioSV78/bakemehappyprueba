import process from "node:process";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import {
  DEFAULT_SITE_URL,
  normalizeSiteUrl,
} from "./src/data/siteUrl.js";
import { categories, products } from "./src/data/products.js";
import {
  CATALOG_PRELOAD,
  IMAGE_ASSETS,
  IMAGE_SIZES,
  IMAGE_SOURCE_WIDTHS,
  RESPONSIVE_IMAGE_WIDTHS,
  getCatalogPreloadCount,
  getResponsiveWidthsForSource,
} from "./src/data/imageDelivery.js";
import { assetVersions } from "./src/data/assetVersions.generated.js";
import { resolveAssetVersion } from "./src/utils/assetVersion.js";

const productionOrigin = DEFAULT_SITE_URL;
const logoSource = IMAGE_ASSETS.logo;
const heroSource = IMAGE_ASSETS.heroPrimary;
const aboutSource = IMAGE_ASSETS.aboutPrimary;
const catalogProducts = products.filter((product) =>
  categories.includes(product.category),
);

function normalizeAssetBaseUrl(value) {
  const candidate = value?.trim();
  if (!candidate) return "";

  try {
    const url = new URL(candidate);
    if (url.protocol !== "https:" && url.protocol !== "http:") return "";

    return `${url.origin}${url.pathname.replace(/\/+$/, "")}`;
  } catch {
    return "";
  }
}

function getAssetRecord(product) {
  return [product.image, resolveAssetVersion(assetVersions, product.image)];
}

function getInitialImagePreloadScript(assetBaseUrl) {
  const catalogRecords = Object.fromEntries(
    ["Todos", ...categories].map((category) => {
      const matchingProducts =
        category === "Todos"
          ? catalogProducts
          : catalogProducts.filter((product) => product.category === category);

      return [
        category,
        matchingProducts
          .slice(0, CATALOG_PRELOAD.desktopCount)
          .map(getAssetRecord),
      ];
    }),
  );
  const productRecords = Object.fromEntries(
    products
      .filter(
        (product) =>
          product.image && getResponsiveWidthsForSource(product.image).length,
      )
      .map((product) => [String(product.id), getAssetRecord(product)]),
  );
  const heroRecord = [
    heroSource,
    resolveAssetVersion(assetVersions, heroSource),
  ];
  const aboutRecord = [
    aboutSource,
    resolveAssetVersion(assetVersions, aboutSource),
  ];
  const logoRecord = [
    logoSource,
    resolveAssetVersion(assetVersions, logoSource),
  ];

  return `(() => {
    const assetBase = ${JSON.stringify(assetBaseUrl)};
    const catalog = ${JSON.stringify(catalogRecords)};
    const products = ${JSON.stringify(productRecords)};
    const hero = ${JSON.stringify(heroRecord)};
    const about = ${JSON.stringify(aboutRecord)};
    const logo = ${JSON.stringify(logoRecord)};
    const widths = ${JSON.stringify(RESPONSIVE_IMAGE_WIDTHS.product)};
    const failedStorageKey = "bmh:r2-failed-assets:v1";
    let failed = [];
    try {
      const storedFailures = JSON.parse(sessionStorage.getItem(failedStorageKey) || "[]");
      failed = Array.isArray(storedFailures) ? storedFailures : [];
    } catch {}
    const encodePath = (source) => source.split("/").map((part) => encodeURIComponent(part).replace(/%26/gi, "&")).join("/");
    const responsivePath = (source, width) => {
      const slash = source.lastIndexOf("/");
      return source.slice(0, slash) + "/_responsive/" + source.slice(slash + 1, -5) + "-" + width + ".webp";
    };
    const addPreload = ([source, version], sizes, priority, responsiveWidths = widths, sourceWidth = ${IMAGE_SOURCE_WIDTHS.product}) => {
      if (!source) return;
      const base = assetBase && !failed.includes(source) ? assetBase : "";
      const url = (path) => base + encodePath(path) + (version ? "?v=" + encodeURIComponent(version) : "");
      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "image";
      link.type = "image/webp";
      link.href = url(source);
      link.setAttribute("imagesrcset", [...responsiveWidths.map((width) => url(responsivePath(source, width)) + " " + width + "w"), url(source) + " " + sourceWidth + "w"].join(", "));
      link.setAttribute("imagesizes", sizes);
      link.fetchPriority = priority;
      document.head.append(link);
    };
    const pathname = location.pathname.length > 1 ? location.pathname.replace(/\\/+$/, "") : "/";
    addPreload(logo, ${JSON.stringify(IMAGE_SIZES.logo)}, "high", ${JSON.stringify(RESPONSIVE_IMAGE_WIDTHS.logo)}, ${IMAGE_SOURCE_WIDTHS.logo});
    if (pathname === "/") {
      addPreload(hero, ${JSON.stringify(IMAGE_SIZES.hero)}, "high", ${JSON.stringify(RESPONSIVE_IMAGE_WIDTHS.hero)}, ${IMAGE_SOURCE_WIDTHS.hero});
      return;
    }
    if (pathname === "/quienes-somos") {
      addPreload(about, ${JSON.stringify(IMAGE_SIZES.editorial)}, "high", ${JSON.stringify(RESPONSIVE_IMAGE_WIDTHS.product)}, 1536);
      return;
    }
    if (pathname === "/tienda") {
      const category = new URLSearchParams(location.search).get("categoria") || "Todos";
      const isDesktop = matchMedia(${JSON.stringify(CATALOG_PRELOAD.desktopMedia)}).matches;
      const preloadCount = isDesktop ? ${getCatalogPreloadCount(true)} : ${getCatalogPreloadCount(false)};
      (catalog[category] || catalog.Todos).slice(0, preloadCount).forEach((record, index) => addPreload(record, ${JSON.stringify(IMAGE_SIZES.catalogCard)}, index === 0 ? "high" : "auto"));
      return;
    }
    const productMatch = pathname.match(/^\\/producto\\/(\\d+)$/);
    if (productMatch && products[productMatch[1]]) {
      addPreload(products[productMatch[1]], ${JSON.stringify(IMAGE_SIZES.productDetail)}, "high");
    }
  })();`;
}

export default defineConfig(({ mode }) => {
  const environment = loadEnv(mode, process.cwd(), "");
  const siteUrl = normalizeSiteUrl(environment.VITE_SITE_URL);
  const assetBaseUrl = normalizeAssetBaseUrl(environment.VITE_R2_PUBLIC_URL);
  const assetOrigin = assetBaseUrl ? new URL(assetBaseUrl).origin : "";

  return {
    plugins: [
      react(),
      {
        name: "bake-me-happy-site-url",
        transformIndexHtml(html) {
          const tags = [
            {
              tag: "script",
              children: getInitialImagePreloadScript(assetBaseUrl),
              injectTo: "head",
            },
          ];

          if (assetOrigin) {
            tags.unshift(
              {
                tag: "link",
                attrs: { rel: "dns-prefetch", href: assetOrigin },
                injectTo: "head-prepend",
              },
              {
                tag: "link",
                attrs: {
                  rel: "preconnect",
                  href: assetOrigin,
                  crossorigin: "anonymous",
                },
                injectTo: "head-prepend",
              },
            );
          }

          return {
            html: html.replaceAll("__SITE_URL__", siteUrl),
            tags,
          };
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
