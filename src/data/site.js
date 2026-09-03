export const SITE_CONFIG = {
  whatsappNumber: "51986943948", // Reemplazar por el numero real, sin simbolos.
  whatsappDisplay: "+51 986 943 948",
  instagramHandle: "@bakemehappy.pe_",
  instagramUrl: "https://www.instagram.com/bakemehappy.pe_/",
  mapsUrl: "https://maps.app.goo.gl/dD4yH5LMTx65mfHo7?g_st=am",
  mapEmbedUrl:
    "https://www.google.com/maps?q=-8.1116685%2C-79.046463&z=17&output=embed",
  mapLabel: "Bake Me Happy",
  mapAddress: "VXQ3+8CM, Covicorti, Trujillo, La Libertad 13011, Perú",
  location: "Trujillo, Peru",
  hours: "Lunes a sabado, 9:00 a.m. - 9:00 p.m.",
  address: "Punto de recojo previa coordinacion",
};

export const NAV_LINKS = [
  { label: "Inicio", href: "/", path: "/" },
  { label: "Quienes somos", href: "/quienes-somos", path: "/quienes-somos" },
  { label: "Tienda", href: "/tienda", path: "/tienda" },
  { label: "Como hago mi pedido", href: "/pedido", path: "/pedido" },
];

export const GENERAL_WHATSAPP_MESSAGE =
  "Hola, vengo de la pagina web de Bake Me Happy. Quisiera hacer un pedido o consultar por una torta personalizada.";

export function getDirectWhatsAppUrl(message = GENERAL_WHATSAPP_MESSAGE) {
  return `https://wa.me/${SITE_CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export function getWhatsAppUrl(message = GENERAL_WHATSAPP_MESSAGE) {
  const directUrl = getDirectWhatsAppUrl(message);
  const trackingPath = `/whatsapp/index.html#${encodeURIComponent(directUrl)}`;

  return typeof window === "undefined"
    ? trackingPath
    : new URL(trackingPath, window.location.origin).href;
}
