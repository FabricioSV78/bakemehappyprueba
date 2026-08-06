const configuredR2BaseUrl = import.meta.env.VITE_R2_PUBLIC_URL?.trim();

export const R2_ASSETS_ENABLED = Boolean(configuredR2BaseUrl);

function normalizeBaseUrl(value) {
  return value?.replace(/\/+$/, "") ?? "";
}

function encodeAssetPath(path) {
  return path
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");
}

export function getLocalAssetUrl(source) {
  return typeof source === "string" ? source : "";
}

export function getAssetUrl(source) {
  const localUrl = getLocalAssetUrl(source);

  if (
    !R2_ASSETS_ENABLED ||
    !localUrl.startsWith("/") ||
    localUrl.startsWith("//")
  ) {
    return localUrl;
  }

  return `${normalizeBaseUrl(configuredR2BaseUrl)}${encodeAssetPath(localUrl)}`;
}

export function buildAssetSrcSet(sources, useR2 = R2_ASSETS_ENABLED) {
  return sources
    .map(({ src, width }) => {
      const url = useR2 ? getAssetUrl(src) : getLocalAssetUrl(src);
      return `${url} ${width}w`;
    })
    .join(", ");
}
