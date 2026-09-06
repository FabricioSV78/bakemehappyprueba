const responsiveAssetPattern = /^(.*)\/_responsive\/(.+)-\d+\.webp$/i;

export function getVersionSourcePath(source) {
  if (typeof source !== "string") return "";

  const match = source.match(responsiveAssetPattern);
  return match ? `${match[1]}/${match[2]}.webp` : source;
}

export function resolveAssetVersion(versions, source) {
  return versions[source] ?? versions[getVersionSourcePath(source)] ?? "";
}
