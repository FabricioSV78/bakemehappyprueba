import process from "node:process";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import {
  DEFAULT_SITE_URL,
  normalizeSiteUrl,
} from "./src/data/siteUrl.js";
import { assetVersions } from "./src/data/assetVersions.generated.js";
import { resolveAssetVersion } from "./src/utils/assetVersion.js";

const productionOrigin = DEFAULT_SITE_URL;
const logoSource = "/images/webp/LOGO/logo-cake-transparent.webp";
const heroSource = "/images/webp/hero 2.webp";

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

function encodeAssetPath(source) {
  return source
    .split("/")
    .map((segment) =>
      encodeURIComponent(segment).replace(/%26/gi, "&"),
    )
    .join("/");
}

function getResponsiveAssetPath(source, width) {
  const lastSlash = source.lastIndexOf("/");
  const directory = source.slice(0, lastSlash);
  const fileName = source.slice(lastSlash + 1, -5);

  return `${directory}/_responsive/${fileName}-${width}.webp`;
}

function getBuildAssetUrl(source, assetBaseUrl) {
  const encodedPath = encodeAssetPath(source);
  const baseUrl = assetBaseUrl ? `${assetBaseUrl}${encodedPath}` : encodedPath;
  const version = resolveAssetVersion(assetVersions, source);

  return version ? `${baseUrl}?v=${encodeURIComponent(version)}` : baseUrl;
}

function getBuildAssetSrcSet(source, widths, sourceWidth, assetBaseUrl) {
  const candidates = widths
    .map((width) => ({ source: getResponsiveAssetPath(source, width), width }))
    .filter((candidate) => resolveAssetVersion(assetVersions, candidate.source));

  candidates.push({ source, width: sourceWidth });

  return candidates
    .map(
      (candidate) =>
        `${getBuildAssetUrl(candidate.source, assetBaseUrl)} ${candidate.width}w`,
    )
    .join(", ");
}

export default defineConfig(({ mode }) => {
  const environment = loadEnv(mode, process.cwd(), "");
  const siteUrl = normalizeSiteUrl(environment.VITE_SITE_URL);
  const assetBaseUrl = normalizeAssetBaseUrl(environment.VITE_R2_PUBLIC_URL);
  const assetOrigin = assetBaseUrl ? new URL(assetBaseUrl).origin : "";
  const logoUrl = getBuildAssetUrl(logoSource, assetBaseUrl);
  const logoSrcSet = getBuildAssetSrcSet(
    logoSource,
    [128, 192],
    512,
    assetBaseUrl,
  );
  const heroUrl = getBuildAssetUrl(heroSource, assetBaseUrl);
  const heroSrcSet = getBuildAssetSrcSet(
    heroSource,
    [800, 1400],
    1672,
    assetBaseUrl,
  );

  return {
    plugins: [
      react(),
      {
        name: "bake-me-happy-site-url",
        transformIndexHtml(html) {
          const tags = [
            {
              tag: "link",
              attrs: {
                rel: "preload",
                as: "image",
                href: logoUrl,
                imagesrcset: logoSrcSet,
                imagesizes: "60px",
                fetchpriority: "high",
                type: "image/webp",
              },
              injectTo: "head",
            },
            {
              tag: "script",
              children: `if (window.location.pathname === "/") { const link = document.createElement("link"); link.rel = "preload"; link.as = "image"; link.href = ${JSON.stringify(heroUrl)}; link.imageSrcset = ${JSON.stringify(heroSrcSet)}; link.imageSizes = "100vw"; link.fetchPriority = "high"; document.head.append(link); }`,
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
