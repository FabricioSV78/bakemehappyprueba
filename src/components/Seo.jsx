import { useEffect } from "react";

const STRUCTURED_DATA_ID = "bake-me-happy-structured-data";

function upsertMeta(attribute, key, content) {
  let meta = document.head.querySelector(`meta[${attribute}="${key}"]`);

  if (!content) {
    meta?.remove();
    return;
  }

  if (!meta) {
    meta = document.createElement("meta");
    meta.setAttribute(attribute, key);
    document.head.append(meta);
  }

  meta.content = content;
}

function updateCanonical(canonicalUrl) {
  let canonical = document.head.querySelector('link[rel="canonical"]');

  if (!canonicalUrl) {
    canonical?.remove();
    return;
  }

  if (!canonical) {
    canonical = document.createElement("link");
    canonical.rel = "canonical";
    document.head.append(canonical);
  }

  canonical.href = canonicalUrl;
}

function updateStructuredData(structuredData) {
  let script = document.getElementById(STRUCTURED_DATA_ID);

  if (!structuredData) {
    script?.remove();
    return;
  }

  if (!script) {
    script = document.createElement("script");
    script.id = STRUCTURED_DATA_ID;
    script.type = "application/ld+json";
    document.head.append(script);
  }

  script.textContent = JSON.stringify(structuredData).replace(/</g, "\\u003c");
}

export default function Seo({
  title,
  description,
  canonicalUrl,
  imageUrl,
  imageAlt,
  robots,
  type,
  structuredData,
}) {
  useEffect(() => {
    document.title = title;
    document.documentElement.lang = "es-PE";

    upsertMeta("name", "description", description);
    upsertMeta("name", "robots", robots);
    upsertMeta("property", "og:locale", "es_PE");
    upsertMeta("property", "og:type", type);
    upsertMeta("property", "og:site_name", "Bake Me Happy");
    upsertMeta("property", "og:title", title);
    upsertMeta("property", "og:description", description);
    upsertMeta("property", "og:url", canonicalUrl);
    upsertMeta("property", "og:image", imageUrl);
    upsertMeta("property", "og:image:alt", imageAlt);
    upsertMeta("name", "twitter:card", "summary_large_image");
    upsertMeta("name", "twitter:title", title);
    upsertMeta("name", "twitter:description", description);
    upsertMeta("name", "twitter:image", imageUrl);
    upsertMeta("name", "twitter:image:alt", imageAlt);

    updateCanonical(canonicalUrl);
    updateStructuredData(structuredData);
  }, [
    canonicalUrl,
    description,
    imageAlt,
    imageUrl,
    robots,
    structuredData,
    title,
    type,
  ]);

  return null;
}
