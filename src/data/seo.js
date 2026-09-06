import { categories, products } from "./products";
import { SITE_CONFIG } from "./site";
import { getAbsoluteSiteUrl } from "./siteUrl";
import { getAssetUrl } from "../utils/assets";
import { getProductId } from "../utils/productDetail";

const SITE_NAME = "Bake Me Happy";
const DEFAULT_IMAGE = "/images/webp/hero 2.webp";
const LOGO_IMAGE = "/images/webp/LOGO/logo-horizontal-transparent.webp";
const ABOUT_IMAGE = "/images/webp/QUIENES SOMOS/1.webp";
const DEFAULT_ROBOTS = "index, follow";

const PAGE_METADATA = {
  "/": {
    title: "Tortas personalizadas en Trujillo | Bake Me Happy",
    description:
      "Tortas personalizadas, tortas temáticas y postres artesanales en Trujillo para cumpleaños, celebraciones y fechas especiales.",
    canonicalPath: "/",
    image: DEFAULT_IMAGE,
    imageAlt: "Tortas artesanales de Bake Me Happy",
  },
  "/quienes-somos": {
    title: "Quiénes somos | Bake Me Happy Trujillo",
    description:
      "Conoce a Bake Me Happy, pastelería artesanal en Trujillo dedicada a crear tortas personalizadas para celebraciones especiales.",
    canonicalPath: "/quienes-somos",
    image: ABOUT_IMAGE,
    imageAlt: "Tortas artesanales creadas por Bake Me Happy",
  },
  "/tienda": {
    title: "Tortas temáticas y clásicas en Trujillo | Bake Me Happy",
    description:
      "Explora el catálogo de Bake Me Happy: tortas temáticas, tortas clásicas y complementos artesanales para celebrar en Trujillo.",
    canonicalPath: "/tienda",
    image: products[0]?.image ?? DEFAULT_IMAGE,
    imageAlt: "Catálogo de tortas de Bake Me Happy",
  },
  "/pedido": {
    title: "Cómo pedir tu torta | Bake Me Happy Trujillo",
    description:
      "Conoce cómo elegir, personalizar y coordinar tu pedido de torta artesanal con Bake Me Happy en Trujillo.",
    canonicalPath: "/pedido",
    image: DEFAULT_IMAGE,
    imageAlt: "Torta personalizada de Bake Me Happy",
  },
};

function truncateDescription(value, maximumLength = 160) {
  const description = String(value ?? "").replace(/\s+/g, " ").trim();
  if (description.length <= maximumLength) return description;

  const shortened = description
    .slice(0, maximumLength - 1)
    .replace(/\s+\S*$/, "")
    .trim();

  return `${shortened}…`;
}

function getAbsoluteImageUrl(source) {
  const assetUrl = getAssetUrl(source || DEFAULT_IMAGE);
  return new URL(assetUrl, `${SITE_CONFIG.siteUrl}/`).href;
}

function getBusinessStructuredData() {
  const businessId = getAbsoluteSiteUrl("/#business", SITE_CONFIG.siteUrl);

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Bakery",
        "@id": businessId,
        name: SITE_NAME,
        url: getAbsoluteSiteUrl("/", SITE_CONFIG.siteUrl),
        logo: getAbsoluteImageUrl(LOGO_IMAGE),
        image: getAbsoluteImageUrl(DEFAULT_IMAGE),
        description:
          "Pastelería artesanal de Trujillo especializada en tortas temáticas, tortas clásicas y pedidos personalizados.",
        telephone: SITE_CONFIG.whatsappDisplay,
        address: {
          "@type": "PostalAddress",
          streetAddress: "VXQ3+8CM, Covicorti",
          addressLocality: "Trujillo",
          addressRegion: "La Libertad",
          postalCode: "13011",
          addressCountry: "PE",
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: -8.1116685,
          longitude: -79.046463,
        },
        areaServed: "Trujillo, Perú",
        hasMap: SITE_CONFIG.mapsUrl,
        sameAs: [SITE_CONFIG.instagramUrl],
        openingHours: "Mo-Sa 09:00-21:00",
      },
      {
        "@type": "WebSite",
        "@id": getAbsoluteSiteUrl("/#website", SITE_CONFIG.siteUrl),
        name: SITE_NAME,
        url: getAbsoluteSiteUrl("/", SITE_CONFIG.siteUrl),
        inLanguage: "es-PE",
        publisher: { "@id": businessId },
      },
    ],
  };
}

function getProductStructuredData(product, canonicalUrl) {
  const imageSources = product.images?.length
    ? product.images.map((image) =>
        typeof image === "string" ? image : image?.src,
      )
    : [product.image];

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product",
        "@id": `${canonicalUrl}#product`,
        name: product.name,
        description: product.description,
        image: [...new Set(imageSources.filter(Boolean).map(getAbsoluteImageUrl))],
        category: product.category,
        url: canonicalUrl,
        brand: {
          "@type": "Brand",
          name: SITE_NAME,
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Inicio",
            item: getAbsoluteSiteUrl("/", SITE_CONFIG.siteUrl),
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Tienda",
            item: getAbsoluteSiteUrl("/tienda", SITE_CONFIG.siteUrl),
          },
          {
            "@type": "ListItem",
            position: 3,
            name: product.name,
            item: canonicalUrl,
          },
        ],
      },
    ],
  };
}

function createMetadata({
  title,
  description,
  canonicalPath,
  image,
  imageAlt,
  robots = DEFAULT_ROBOTS,
  type = "website",
  structuredData = null,
}) {
  return {
    title,
    description: truncateDescription(description),
    canonicalUrl: canonicalPath
      ? getAbsoluteSiteUrl(canonicalPath, SITE_CONFIG.siteUrl)
      : "",
    imageUrl: getAbsoluteImageUrl(image),
    imageAlt,
    robots,
    type,
    structuredData,
  };
}

export function getSeoForLocation(currentLocation, currentPath) {
  const parsedLocation = new URL(currentLocation, `${SITE_CONFIG.siteUrl}/`);
  const hasQueryParameters = Boolean(parsedLocation.search);

  if (currentPath.startsWith("/producto/")) {
    const productId = getProductId(currentPath);
    const product = products.find((item) => item.id === productId);

    if (!product) {
      return createMetadata({
        title: `Producto no encontrado | ${SITE_NAME}`,
        description: "El producto solicitado no está disponible en la tienda actual.",
        canonicalPath: "",
        image: LOGO_IMAGE,
        imageAlt: `Logo de ${SITE_NAME}`,
        robots: "noindex, nofollow",
      });
    }

    const canonicalPath = `/producto/${product.id}`;
    const canonicalUrl = getAbsoluteSiteUrl(canonicalPath, SITE_CONFIG.siteUrl);
    const description = `${product.description} Consulta los tamaños y precios disponibles en Bake Me Happy, Trujillo.`;
    const isCatalogProduct = categories.includes(product.category);

    return createMetadata({
      title: `${product.name} | Bake Me Happy Trujillo`,
      description,
      canonicalPath,
      image: product.image,
      imageAlt: `${product.name} de Bake Me Happy`,
      robots:
        hasQueryParameters || !isCatalogProduct
          ? "noindex, follow"
          : DEFAULT_ROBOTS,
      type: "product",
      structuredData: isCatalogProduct
        ? getProductStructuredData(product, canonicalUrl)
        : null,
    });
  }

  const pageMetadata = PAGE_METADATA[currentPath];

  if (!pageMetadata) {
    return createMetadata({
      title: `Página no encontrada | ${SITE_NAME}`,
      description: "La página solicitada no está disponible en Bake Me Happy.",
      canonicalPath: "",
      image: LOGO_IMAGE,
      imageAlt: `Logo de ${SITE_NAME}`,
      robots: "noindex, nofollow",
    });
  }

  return createMetadata({
    ...pageMetadata,
    robots: hasQueryParameters ? "noindex, follow" : DEFAULT_ROBOTS,
    structuredData: currentPath === "/" ? getBusinessStructuredData() : null,
  });
}
