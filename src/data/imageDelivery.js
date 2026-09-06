export const IMAGE_ASSETS = Object.freeze({
  logo: "/images/webp/LOGO/logo-cake-transparent.webp",
  heroPrimary: "/images/webp/hero 2.webp",
  aboutPrimary: "/images/webp/QUIENES SOMOS/1.webp",
});

export const RESPONSIVE_IMAGE_WIDTHS = Object.freeze({
  product: Object.freeze([480, 960, 1200]),
  galleryPreview: Object.freeze([960, 1200]),
  hero: Object.freeze([800, 1400]),
  logo: Object.freeze([128, 192]),
});

export const IMAGE_SOURCE_WIDTHS = Object.freeze({
  product: 1402,
  hero: 1672,
  logo: 512,
});

export const IMAGE_SIZES = Object.freeze({
  catalogCard:
    "(min-width: 1800px) 290px, (min-width: 1280px) calc((100vw - 460px) / 3), (min-width: 1024px) calc((100vw - 426px) / 2), (min-width: 768px) calc((100vw - 112px) / 3), (min-width: 640px) calc((100vw - 88px) / 2), (min-width: 420px) calc((100vw - 56px) / 2), calc(100vw - 44px)",
  productDetail:
    "(min-width: 1280px) 600px, (min-width: 1024px) calc(50vw - 3.5rem), (min-width: 640px) calc(100vw - 10rem), calc(100vw - 3rem)",
  productThumbnail: "(min-width: 640px) 112px, 30vw",
  featuredCard:
    "(min-width: 1024px) 220px, (min-width: 640px) calc(100vw - 4.25rem), calc(100vw - 2.75rem)",
  editorial: "(min-width: 768px) 46vw, calc(100vw - 40px)",
  addOn: "64px",
  hero: "100vw",
  logo: "60px",
});

export const R2_FALLBACK_TIMEOUT_MS = 3000;

export function getResponsiveWidthsForSource(source) {
  const normalizedSource = typeof source === "string" ? source : "";
  const fileName = normalizedSource.slice(normalizedSource.lastIndexOf("/") + 1);

  if (/^[123]\.webp$/i.test(fileName)) {
    return RESPONSIVE_IMAGE_WIDTHS.product;
  }

  if (/\/hero (?:2|3)\.webp$/i.test(normalizedSource)) {
    return RESPONSIVE_IMAGE_WIDTHS.hero;
  }

  if (normalizedSource.endsWith("/LOGO/logo-cake-transparent.webp")) {
    return RESPONSIVE_IMAGE_WIDTHS.logo;
  }

  return [];
}
