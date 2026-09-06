import { assetVersions } from "../data/assetVersions.generated";
import {
  IMAGE_SIZES,
  IMAGE_SOURCE_WIDTHS,
  R2_FALLBACK_TIMEOUT_MS,
  RESPONSIVE_IMAGE_WIDTHS,
  getResponsiveWidthsForSource,
} from "../data/imageDelivery";
import { getVersionSourcePath, resolveAssetVersion } from "./assetVersion";

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
const failedRemoteAssets = new Set();
const FAILED_REMOTE_ASSETS_STORAGE_KEY = "bmh:r2-failed-assets:v1";

function restoreFailedRemoteAssets() {
  if (typeof window === "undefined") return;

  try {
    const storedAssets = JSON.parse(
      window.sessionStorage.getItem(FAILED_REMOTE_ASSETS_STORAGE_KEY) ?? "[]",
    );

    if (Array.isArray(storedAssets)) {
      storedAssets.forEach((source) => {
        if (typeof source === "string") failedRemoteAssets.add(source);
      });
    }
  } catch {
    // La entrega de imagenes debe seguir funcionando si sessionStorage no esta disponible.
  }
}

restoreFailedRemoteAssets();

function getFailureCacheKey(source) {
  return getVersionSourcePath(typeof source === "string" ? source : "");
}

export function hasRemoteAssetFailed(source) {
  return failedRemoteAssets.has(getFailureCacheKey(source));
}

export function rememberRemoteAssetFailure(source) {
  const cacheKey = getFailureCacheKey(source);
  if (!cacheKey || failedRemoteAssets.has(cacheKey)) return;

  failedRemoteAssets.add(cacheKey);

  if (typeof window === "undefined") return;

  try {
    window.sessionStorage.setItem(
      FAILED_REMOTE_ASSETS_STORAGE_KEY,
      JSON.stringify([...failedRemoteAssets]),
    );
  } catch {
    // El Set en memoria mantiene la proteccion aunque el almacenamiento este bloqueado.
  }
}

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
  return resolveAssetVersion(assetVersions, source);
}

export function getResponsiveAssetPath(source, width) {
  if (
    typeof source !== "string" ||
    !source.startsWith("/") ||
    !source.toLowerCase().endsWith(".webp") ||
    !Number.isFinite(width)
  ) {
    return "";
  }

  const lastSlash = source.lastIndexOf("/");
  const directory = source.slice(0, lastSlash);
  const fileName = source.slice(lastSlash + 1, -5);

  return `${directory}/_responsive/${fileName}-${width}.webp`;
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
    hasRemoteAssetFailed(localUrl) ||
    !localUrl.startsWith("/") ||
    localUrl.startsWith("//")
  ) {
    return getLocalAssetUrl(localUrl);
  }

  const remoteUrl = `${normalizeBaseUrl(configuredR2BaseUrl)}${encodeAssetPath(localUrl)}`;
  return appendVersionQuery(remoteUrl, version);
}

export function getAssetSrcSet(
  source,
  widths = [],
  sourceWidth,
  { local = false } = {},
) {
  const getUrl = local ? getLocalAssetUrl : getAssetUrl;
  const supportedWidths = new Set(getResponsiveWidthsForSource(source));
  const candidates = widths
    .map((width) => Number.parseInt(width, 10))
    .filter(
      (width) =>
        Number.isFinite(width) && width > 0 && supportedWidths.has(width),
    )
    .map((width) => ({
      source: getResponsiveAssetPath(source, width),
      width,
    }))
    .filter((candidate) => getAssetVersion(candidate.source));
  const originalWidth = Number.parseInt(sourceWidth, 10);

  if (Number.isFinite(originalWidth) && originalWidth > 0) {
    candidates.push({ source, width: originalWidth });
  }

  return candidates
    .filter(
      (candidate, index, collection) =>
        collection.findIndex((item) => item.width === candidate.width) === index,
    )
    .sort((left, right) => left.width - right.width)
    .map((candidate) => `${getUrl(candidate.source)} ${candidate.width}w`)
    .join(", ");
}

function loadDecodedImage({
  assetSource,
  fetchPriority,
  source,
  sourceSet,
  fallbackSource,
  fallbackSourceSet,
  sizes,
}) {
  return new Promise((resolve) => {
    const image = new Image();
    let attemptedFallback = source === fallbackSource;
    let fallbackTimer;
    let settled = false;

    const finishRequest = (result) => {
      if (settled) return;
      settled = true;
      if (fallbackTimer) window.clearTimeout(fallbackTimer);
      resolve(result);
    };

    const switchToLocalFallback = () => {
      if (attemptedFallback || !fallbackSource || source === fallbackSource) {
        return false;
      }

      attemptedFallback = true;
      rememberRemoteAssetFailure(assetSource);
      image.srcset = fallbackSourceSet;
      image.src = fallbackSource;
      return true;
    };

    const finish = async () => {
      try {
        await image.decode?.();
      } catch {
        // onload confirma que el recurso es utilizable aunque decode no exista.
      }
      finishRequest(true);
    };

    image.decoding = "async";
    image.fetchPriority = fetchPriority;
    image.onload = finish;
    image.onerror = () => {
      if (switchToLocalFallback()) return;

      finishRequest(false);
    };
    image.sizes = sizes;
    image.srcset = sourceSet;
    image.src = source;

    if (!attemptedFallback) {
      fallbackTimer = window.setTimeout(() => {
        switchToLocalFallback();
      }, R2_FALLBACK_TIMEOUT_MS);
    }
  });
}

export function preloadImageAsset(
  source,
  {
    fetchPriority = "auto",
    responsiveWidths = RESPONSIVE_IMAGE_WIDTHS.product,
    sizes = IMAGE_SIZES.productDetail,
    sourceWidth = IMAGE_SOURCE_WIDTHS.product,
  } = {},
) {
  if (typeof Image === "undefined" || !source) return Promise.resolve(false);

  const remoteSource = getAssetUrl(source);
  const localSource = getLocalAssetUrl(source);
  const remoteSourceSet = getAssetSrcSet(
    source,
    responsiveWidths,
    sourceWidth,
  );
  const localSourceSet = getAssetSrcSet(source, responsiveWidths, sourceWidth, {
    local: true,
  });
  const cacheKey = `${remoteSourceSet}|${localSourceSet}|${sizes}`;

  if (!imagePreloadCache.has(cacheKey)) {
    imagePreloadCache.set(
      cacheKey,
      loadDecodedImage({
        assetSource: source,
        fetchPriority,
        source: remoteSource,
        sourceSet: remoteSourceSet,
        fallbackSource: localSource,
        fallbackSourceSet: localSourceSet,
        sizes,
      }),
    );
  }

  return imagePreloadCache.get(cacheKey);
}

function scheduleIdleTask(task) {
  if (typeof window === "undefined") return Promise.resolve([]);

  return new Promise((resolve) => {
    const runTask = () => Promise.resolve(task()).then(resolve);

    if ("requestIdleCallback" in window) {
      window.requestIdleCallback(runTask, { timeout: 1200 });
    } else {
      window.setTimeout(runTask, 120);
    }
  });
}

export function preloadCatalogProductImage(product, fetchPriority = "auto") {
  return preloadImageAsset(product?.image, {
    fetchPriority,
    responsiveWidths: RESPONSIVE_IMAGE_WIDTHS.product,
    sizes: IMAGE_SIZES.catalogCard,
    sourceWidth: IMAGE_SOURCE_WIDTHS.product,
  });
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

  return preloadImageAsset(primarySource, { fetchPriority: "high" }).then(
    (primaryResult) =>
      scheduleIdleTask(() =>
        Promise.allSettled(
          secondarySources.map((source) =>
            preloadImageAsset(source, { fetchPriority: "low" }),
          ),
        ).then((secondaryResults) => [primaryResult, ...secondaryResults]),
      ),
  );
}
