import { useEffect, useState } from "react";
import { Menu, MessageCircle, Phone, X } from "lucide-react";
import {
  getPhoneUrl,
  getWhatsAppUrl,
  NAV_LINKS,
  SITE_CONFIG,
} from "../data/site";
import BrandLockup from "./BrandLockup";

function HeaderContactLink({
  href,
  icon: Icon,
  label,
  value,
  onClick,
  external = false,
  compact = false,
}) {
  return (
    <a
      href={href}
      onClick={onClick}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      aria-label={`${label}: ${value}`}
      className={`group inline-flex items-center gap-2 rounded-full border border-white/65 bg-white/80 text-ink shadow-sm ring-1 ring-blush/35 backdrop-blur transition-all duration-200 hover:-translate-y-0.5 hover:border-plum/25 hover:text-plum ${
        compact ? "px-3 py-2 text-xs" : "px-3.5 py-2 text-sm"
      }`}
    >
      <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-blush/45 text-plum transition-colors group-hover:bg-lavender-light">
        <Icon size={16} strokeWidth={1.9} aria-hidden="true" />
      </span>
      <span className="min-w-0">
        <span className="block text-[10px] font-semibold uppercase tracking-[0.16em] text-plum/80">
          {label}
        </span>
        <span className="block truncate font-medium text-ink">{value}</span>
      </span>
    </a>
  );
}

export default function Header({ currentPath = "/", onOpenOrderModal }) {
  const [isOpen, setIsOpen] = useState(false);
  const activePath = currentPath.startsWith("/producto/")
    ? "/tienda"
    : currentPath === "/catalogo"
      ? "/tienda"
      : currentPath;
  const contactPhones = SITE_CONFIG.contactPhones ?? [];

  useEffect(() => {
    const closeMenu = () => setIsOpen(false);
    window.addEventListener("resize", closeMenu);
    return () => window.removeEventListener("resize", closeMenu);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-blush/30 bg-[linear-gradient(180deg,rgba(255,248,244,0.98)_0%,rgba(255,255,255,0.96)_100%)] shadow-[0_12px_32px_rgba(23,54,109,0.09)] backdrop-blur-xl">
      <div className="hidden border-b border-blush/25 bg-[linear-gradient(90deg,rgba(228,154,175,0.30)_0%,rgba(255,255,255,0.92)_48%,rgba(170,179,229,0.30)_100%)] lg:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-5 py-2.5 sm:px-8">
          <div className="flex min-w-0 flex-wrap items-center gap-3">
            <HeaderContactLink
              href={getWhatsAppUrl()}
              icon={MessageCircle}
              label="WhatsApp"
              value={SITE_CONFIG.whatsappDisplay}
              external
              compact
            />

            {contactPhones.map((phone) => (
              <HeaderContactLink
                key={`${phone.label}-${phone.number}`}
                href={getPhoneUrl(phone.number)}
                icon={Phone}
                label={phone.label}
                value={phone.display}
                compact
              />
            ))}
          </div>

          <p className="text-right text-[11px] font-semibold uppercase tracking-[0.16em] text-plum/85">
            Atencion personalizada para pedidos y consultas
          </p>
        </div>
      </div>

      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-5 sm:px-8">
        <a
          href="/"
          className="group min-w-0 shrink-0"
          onClick={() => setIsOpen(false)}
        >
          <BrandLockup className="transition-transform duration-200 group-hover:-rotate-[0.35deg] group-hover:scale-[1.01]" />
        </a>

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Principal">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              aria-current={activePath === link.path ? "page" : undefined}
              className={`relative py-2 text-sm font-semibold transition-colors after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:origin-center after:rounded-full after:bg-plum after:transition-transform hover:text-plum ${
                activePath === link.path ? "text-plum" : "text-ink/75"
              } ${activePath === link.path ? "after:scale-x-100" : "after:scale-x-0 hover:after:scale-x-100"}`}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <button
          type="button"
          onClick={onOpenOrderModal}
          className="button-primary hidden lg:inline-flex"
        >
          <MessageCircle size={18} aria-hidden="true" />
          Hacer un pedido
        </button>

        <button
          type="button"
          className="grid h-12 w-12 shrink-0 place-items-center rounded-full text-ink transition-colors hover:bg-lavender-light lg:hidden"
          onClick={() => setIsOpen((current) => !current)}
          aria-expanded={isOpen}
          aria-controls="mobile-navigation"
          aria-label={isOpen ? "Cerrar menu" : "Abrir menu"}
        >
          {isOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
      </div>

      {isOpen && (
        <div
          id="mobile-navigation"
          className="overflow-hidden border-t border-blush/25 bg-[linear-gradient(180deg,rgba(255,248,244,0.99)_0%,rgba(255,255,255,0.97)_100%)] shadow-[0_18px_36px_rgba(23,54,109,0.09)] lg:hidden"
        >
          <div className="mx-auto max-w-7xl px-5 py-4 sm:px-8">
            <div className="grid gap-3 border-b border-lavender/30 pb-4">
              <HeaderContactLink
                href={getWhatsAppUrl()}
                icon={MessageCircle}
                label="WhatsApp"
                value={SITE_CONFIG.whatsappDisplay}
                onClick={() => setIsOpen(false)}
                external
              />

              {contactPhones.map((phone) => (
                <HeaderContactLink
                  key={`${phone.label}-${phone.number}-mobile`}
                  href={getPhoneUrl(phone.number)}
                  icon={Phone}
                  label={phone.label}
                  value={phone.display}
                  onClick={() => setIsOpen(false)}
                />
              ))}
            </div>

            <nav className="mt-2 flex flex-col" aria-label="Móvil">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  aria-current={activePath === link.path ? "page" : undefined}
                  className={`border-b border-lavender/30 py-4 text-base font-semibold ${
                    activePath === link.path
                      ? "border-l-4 border-l-plum pl-3 text-plum"
                      : "text-ink"
                  }`}
                >
                  {link.label}
                </a>
              ))}
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  onOpenOrderModal();
                }}
                className="button-primary mt-5"
              >
                <MessageCircle size={18} aria-hidden="true" />
                Hacer un pedido
              </button>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
