import { assetVersions } from "../data/assetVersions.generated";

const configuredR2BaseUrl = import.meta.env.VITE_R2_PUBLIC_URL?.trim();

export const R2_ASSETS_ENABLED = Boolean(configuredR2BaseUrl);
const imagePreloadCache = new Map();

function normalizeBaseUrl(value) {
  return value?.replace(/\/+$/, "") ?? "";
}

function encodeAssetPath(path) {
  return path
    .split("/")
    .map((segment) => encodeURIComponent(segment))
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

export function preloadAsset(source) {
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
