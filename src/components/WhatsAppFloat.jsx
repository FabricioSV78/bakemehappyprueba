import { MessageCircle } from "lucide-react";
import { getWhatsAppUrl } from "../data/site";

export default function WhatsAppFloat() {
  return (
    <a
      href={getWhatsAppUrl()}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-4 right-4 z-40 grid h-14 w-14 place-items-center rounded-full bg-[#167D4B] text-white shadow-lift transition-transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#167D4B] sm:bottom-5 sm:right-5"
      aria-label="Escribir a Bake Me Happy por WhatsApp"
    >
      <MessageCircle size={25} fill="currentColor" aria-hidden="true" />
    </a>
  );
}
