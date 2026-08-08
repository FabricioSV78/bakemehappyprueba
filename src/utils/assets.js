import { assetVersions } from "../data/assetVersions.generated";

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
