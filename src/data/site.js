export const SITE_CONFIG = {
  whatsappNumber: "51999999999", // Reemplazar por el número real, sin símbolos.
  whatsappDisplay: "+51 999 999 999",
  instagramHandle: "@bakemehappy.trujillo",
  instagramUrl: "https://www.instagram.com/",
  location: "Trujillo, Perú",
  hours: "Lunes a sábado, 9:00 a.m. - 7:00 p.m.",
  address: "Punto de recojo previa coordinación",
};

export const NAV_LINKS = [
  { label: "Inicio", href: "#/", path: "/" },
  { label: "Quiénes somos", href: "#/quienes-somos", path: "/quienes-somos" },
  { label: "Catálogo", href: "#/catalogo", path: "/catalogo" },
  { label: "Cómo hago mi pedido", href: "#/pedido", path: "/pedido" },
];

export const GENERAL_WHATSAPP_MESSAGE =
  "Hola, vengo de la página web de Bake Me Happy. Quisiera hacer un pedido o consultar por una torta personalizada.";

export function getWhatsAppUrl(message = GENERAL_WHATSAPP_MESSAGE) {
  return `https://wa.me/${SITE_CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
}
