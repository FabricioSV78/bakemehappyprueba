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

function insertVersionInFileName(source, version) {
  if (!version) return source;

  const extensionIndex = source.lastIndexOf(".");
  if (extensionIndex <= source.lastIndexOf("/")) return source;

  return `${source.slice(0, extensionIndex)}.${version}${source.slice(extensionIndex)}`;
}

export function getLocalAssetUrl(source) {
  const localUrl = typeof source === "string" ? source : "";
  return appendVersionQuery(localUrl, getAssetVersion(localUrl));
}

export function getAssetUrl(source) {
  const localUrl = typeof source === "string" ? source : "";
  const version = getAssetVersion(localUrl);

  if (
    !R2_ASSETS_ENABLED ||
    !localUrl.startsWith("/") ||
    localUrl.startsWith("//")
  ) {
    return appendVersionQuery(localUrl, version);
  }

  const versionedPath = insertVersionInFileName(localUrl, version);
  return `${normalizeBaseUrl(configuredR2BaseUrl)}${encodeAssetPath(versionedPath)}`;
}

export function buildAssetSrcSet(sources, useR2 = R2_ASSETS_ENABLED) {
  return sources
    .map(({ src, width }) => {
      const url = useR2 ? getAssetUrl(src) : getLocalAssetUrl(src);
      return `${url} ${width}w`;
    })
    .join(", ");
}
