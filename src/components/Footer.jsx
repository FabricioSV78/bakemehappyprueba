import { Clock3, Instagram, MapPin, MessageCircle, Phone } from "lucide-react";
import {
  getPhoneUrl,
  getWhatsAppUrl,
  NAV_LINKS,
  SITE_CONFIG,
} from "../data/site";
import BrandLockup from "./BrandLockup";
import Reveal from "./Reveal";

const linkClass =
  "text-sm leading-6 text-white/65 transition-colors hover:text-white";

export default function Footer() {
  const contactPhones = SITE_CONFIG.contactPhones ?? [];

  return (
    <footer className="brand-scallop-top bg-ink text-white">
      <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-14">
        <Reveal className="grid gap-10 border-b border-white/15 pb-10 sm:grid-cols-2 lg:grid-cols-[1.35fr_0.8fr_1fr_1fr] lg:gap-8">
          <div className="sm:col-span-2 lg:col-span-1">
            <a
              href="#/"
              className="inline-flex rounded-lg"
              aria-label="Bake Me Happy, volver al inicio"
            >
              <BrandLockup size="footer" inverted />
            </a>
            <p className="mt-5 max-w-sm text-sm leading-6 text-white/65">
              Tortas y postres personalizados hechos con dedicación para tus
              momentos más especiales.
            </p>
          </div>

          <nav aria-label="Navegación del pie de página">
            <h2 className="text-xs font-bold uppercase tracking-[0.16em] text-blush">
              Navegación
            </h2>
            <div className="mt-5 flex flex-col gap-2.5">
              {NAV_LINKS.map((link) => (
                <a key={link.href} href={link.href} className={linkClass}>
                  {link.label}
                </a>
              ))}
            </div>
          </nav>

          <section aria-labelledby="footer-attention-title">
            <h2
              id="footer-attention-title"
              className="text-xs font-bold uppercase tracking-[0.16em] text-blush"
            >
              Atención
            </h2>
            <div className="mt-5 flex flex-col gap-3.5">
              <p className="flex items-start gap-3 text-sm leading-6 text-white/65">
                <MapPin className="mt-0.5 shrink-0 text-blush" size={17} aria-hidden="true" />
                <span>
                  {SITE_CONFIG.location}
                  <span className="block text-white/50">{SITE_CONFIG.address}</span>
                </span>
              </p>
              <p className="flex items-start gap-3 text-sm leading-6 text-white/65">
                <Clock3 className="mt-0.5 shrink-0 text-blush" size={17} aria-hidden="true" />
                {SITE_CONFIG.hours}
              </p>
            </div>
          </section>

          <section aria-labelledby="footer-contact-title">
            <h2
              id="footer-contact-title"
              className="text-xs font-bold uppercase tracking-[0.16em] text-blush"
            >
              Contacto
            </h2>
            <div className="mt-5 flex flex-col gap-3.5">
              <a
                href={getWhatsAppUrl()}
                target="_blank"
                rel="noreferrer"
                className={`inline-flex items-center gap-3 ${linkClass}`}
              >
                <MessageCircle className="shrink-0 text-blush" size={18} aria-hidden="true" />
                {SITE_CONFIG.whatsappDisplay}
              </a>
              {contactPhones.map((phone) => (
                <a
                  key={`${phone.label}-${phone.number}-footer`}
                  href={getPhoneUrl(phone.number)}
                  className={`inline-flex items-center gap-3 ${linkClass}`}
                >
                  <Phone className="shrink-0 text-blush" size={18} aria-hidden="true" />
                  <span>
                    <span className="block text-[10px] uppercase tracking-wider text-white/45">
                      {phone.label}
                    </span>
                    {phone.display}
                  </span>
                </a>
              ))}
              <a
                href={SITE_CONFIG.instagramUrl}
                target="_blank"
                rel="noreferrer"
                className={`inline-flex items-center gap-3 ${linkClass}`}
              >
                <Instagram className="shrink-0 text-blush" size={18} aria-hidden="true" />
                {SITE_CONFIG.instagramHandle}
              </a>
            </div>
          </section>
        </Reveal>

        <div className="flex flex-col gap-2 pt-7 text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Bake Me Happy.</p>
          <p>Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
