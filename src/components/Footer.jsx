import { Instagram, MessageCircle } from "lucide-react";
import { getWhatsAppUrl, NAV_LINKS, SITE_CONFIG } from "../data/site";

export default function Footer() {
  return (
    <footer className="bg-ink text-white">
      <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
        <div className="grid gap-10 border-b border-white/15 pb-10 md:grid-cols-[1.2fr_1fr_1fr]">
          <div>
            <a href="#/" className="font-display text-3xl">
              Bake Me Happy
            </a>
            <p className="mt-3 text-sm text-white/60">Pastelería artesanal</p>
            <p className="mt-5 max-w-sm text-sm leading-6 text-white/55">
              Tortas y postres personalizados hechos con dedicación para tus
              momentos más especiales.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-blush">
              Navegación
            </h3>
            <div className="mt-5 grid grid-cols-2 gap-x-5 gap-y-3">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-sm text-white/60 transition-colors hover:text-white"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-blush">
              Contacto
            </h3>
            <div className="mt-5 flex flex-col gap-3">
              <a
                href={getWhatsAppUrl()}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-3 text-sm text-white/60 hover:text-white"
              >
                <MessageCircle size={18} aria-hidden="true" />
                {SITE_CONFIG.whatsappDisplay}
              </a>
              <a
                href={SITE_CONFIG.instagramUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-3 text-sm text-white/60 hover:text-white"
              >
                <Instagram size={18} aria-hidden="true" />
                {SITE_CONFIG.instagramHandle}
              </a>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 pt-7 text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <p>
            Copyright {new Date().getFullYear()} Bake Me Happy. 
          </p>
          <p>Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
