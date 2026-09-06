import { MessageCircle } from "lucide-react";
import { getWhatsAppUrl } from "../data/site";

export default function WhatsAppFloat() {
  return (
    <a
      href={getWhatsAppUrl()}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-5 right-5 z-40 hidden h-14 w-14 place-items-center rounded-full bg-[#167D4B] text-white shadow-lift transition-transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#167D4B] xl:grid"
      aria-label="Escribir a Bake Me Happy por WhatsApp"
    >
      <MessageCircle size={23} fill="currentColor" aria-hidden="true" />
    </a>
  );
}
