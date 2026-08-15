export const SITE_CONFIG = {
  whatsappNumber: "51986943948", // Reemplazar por el numero real, sin simbolos.
  whatsappDisplay: "+51 986 943 948",
  contactPhones: [
    {
      label: "Llamadas y pedidos",
      number: "51986943948",
      display: "+51 986 943 948",
    },
  ],
  instagramHandle: "@bakemehappy.pe_",
  instagramUrl: "https://www.instagram.com/bakemehappy.pe_/",
  location: "Trujillo, Peru",
  hours: "Lunes a sabado, 9:00 a.m. - 10:30 p.m.",
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

export function getPhoneUrl(number) {
  const normalizedNumber = String(number).replace(/[^\d+]/g, "");
  return normalizedNumber.startsWith("+")
    ? `tel:${normalizedNumber}`
    : `tel:+${normalizedNumber}`;
}
