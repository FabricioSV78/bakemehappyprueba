import { assetVersions } from "../data/assetVersions.generated";

function normalizeBaseUrl(value) {
  const candidate = value?.trim();
  if (!candidate) return "";

  try {
    const url = new URL(candidate);
    if (url.protocol !== "https:" && url.protocol !== "http:") return "";

    url.search = "";
    url.hash = "";
    return `${url.origin}${url.pathname.replace(/\/+$/, "")}`;
  } catch {
    return "";
  }
}

const configuredR2BaseUrl = normalizeBaseUrl(
  import.meta.env.VITE_R2_PUBLIC_URL,
);

export const R2_ASSETS_ENABLED = Boolean(configuredR2BaseUrl);
const R2_ASSET_ORIGIN = R2_ASSETS_ENABLED
  ? new URL(configuredR2BaseUrl).origin
  : "";
const imagePreloadCache = new Map();

function ensureConnectionHint(rel, href) {
  if (!href || document.head.querySelector(`link[rel="${rel}"][href="${href}"]`)) {
    return;
  }

  const link = document.createElement("link");
  link.rel = rel;
  link.href = href;
  document.head.append(link);
}

/**
 * Abre anticipadamente la conexion al dominio R2. Solo se ejecuta cuando la
 * variable publica contiene una URL valida; en local no agrega ningun recurso.
 */
export function initializeAssetDelivery() {
  if (typeof document === "undefined" || !R2_ASSET_ORIGIN) return;

  ensureConnectionHint("dns-prefetch", R2_ASSET_ORIGIN);
  ensureConnectionHint("preconnect", R2_ASSET_ORIGIN);
}

function encodeAssetPath(path) {
  return path
    .split("/")
    .map((segment) =>
      // `&` es válido dentro del path. Mantenerlo evita que Vite/Pages busque
      // literalmente una carpeta llamada `%26` en nombres como "You & Me".
      encodeURIComponent(segment).replace(/%26/gi, "&"),
    )
    .join("/");
}

function getAssetVersion(source) {
  return assetVersions[source] ?? "";
}

function appendVersionQuery(source, version) {
  if (!version) return source;

  const [url, fragment] = source.split("#", 2);
  const separator = url.includes("?") ? "&" : "?";
  const versionedUrl = `${url}${separator}v=${encodeURIComponent(version)}`;
  return fragment ? `${versionedUrl}#${fragment}` : versionedUrl;
}

export function getLocalAssetUrl(source) {
  const localUrl = typeof source === "string" ? source : "";
  const version = getAssetVersion(localUrl);

  if (!localUrl.startsWith("/") || localUrl.startsWith("//")) {
    return appendVersionQuery(localUrl, version);
  }

  return appendVersionQuery(encodeAssetPath(localUrl), version);
}

export function getAssetUrl(source) {
  const localUrl = typeof source === "string" ? source : "";
  const version = getAssetVersion(localUrl);

  if (
    !R2_ASSETS_ENABLED ||
    !localUrl.startsWith("/") ||
    localUrl.startsWith("//")
  ) {
    return getLocalAssetUrl(localUrl);
  }

  const remoteUrl = `${normalizeBaseUrl(configuredR2BaseUrl)}${encodeAssetPath(localUrl)}`;
  return appendVersionQuery(remoteUrl, version);
}

function loadDecodedImage(source, fallbackSource) {
  return new Promise((resolve) => {
    const image = new Image();
    let attemptedFallback = false;

    const finish = async () => {
      try {
        await image.decode?.();
      } catch {
        // onload confirma que el recurso es utilizable aunque decode no exista.
      }
      resolve(true);
    };

    image.decoding = "async";
    image.onload = finish;
    image.onerror = () => {
      if (!attemptedFallback && fallbackSource && source !== fallbackSource) {
        attemptedFallback = true;
        image.src = fallbackSource;
        return;
      }

      resolve(false);
    };
    image.src = source;
  });
}

function preloadAsset(source) {
  if (typeof Image === "undefined" || !source) return Promise.resolve(false);

  const remoteSource = getAssetUrl(source);
  const localSource = getLocalAssetUrl(source);
  const cacheKey = `${remoteSource}|${localSource}`;

  if (!imagePreloadCache.has(cacheKey)) {
    imagePreloadCache.set(
      cacheKey,
      loadDecodedImage(remoteSource, localSource),
    );
  }

  return imagePreloadCache.get(cacheKey);
}

export function preloadProductAssets(product) {
  const sources = product?.images?.length
    ? product.images.map((image) =>
        typeof image === "string" ? image : image?.src,
      )
    : [product?.image];

  const [primarySource, ...secondarySources] = [
    ...new Set(sources.filter(Boolean)),
  ];

  if (!primarySource) return Promise.resolve([]);

  return preloadAsset(primarySource).then(() =>
    Promise.allSettled(secondarySources.map(preloadAsset)),
  );
}
