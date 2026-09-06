export const DEFAULT_SITE_URL = "https://bakemehappyprueba.pages.dev";

export function normalizeSiteUrl(value = DEFAULT_SITE_URL) {
  try {
    const url = new URL(String(value || DEFAULT_SITE_URL).trim());

    if (url.protocol !== "https:" && url.protocol !== "http:") {
      return DEFAULT_SITE_URL;
    }

    url.search = "";
    url.hash = "";
    url.pathname = url.pathname.replace(/\/+$/, "");

    return url.href.replace(/\/+$/, "");
  } catch {
    return DEFAULT_SITE_URL;
  }
}

export function getAbsoluteSiteUrl(path = "/", siteUrl = DEFAULT_SITE_URL) {
  return new URL(path, `${normalizeSiteUrl(siteUrl)}/`).href;
}
