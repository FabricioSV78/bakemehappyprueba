import { useEffect, useState } from "react";
import { Menu, MessageCircle, Phone, X } from "lucide-react";
import {
  getPhoneUrl,
  getWhatsAppUrl,
  NAV_LINKS,
  SITE_CONFIG,
} from "../data/site";
import CustomOrderModal from "./CustomOrderModal";

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

export default function Header({ currentPath = "/" }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
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
    <header className="fixed inset-x-0 top-0 z-50 border-b border-blush/45 bg-[linear-gradient(180deg,rgba(255,250,246,0.98)_0%,rgba(255,255,255,0.94)_100%)] shadow-[0_12px_32px_rgba(30,50,100,0.08)] backdrop-blur-xl">
      <div className="hidden border-b border-blush/35 bg-[linear-gradient(90deg,rgba(247,200,216,0.32)_0%,rgba(255,255,255,0.88)_48%,rgba(200,205,247,0.32)_100%)] lg:block">
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
          href="#/"
          className="group flex min-w-0 items-center gap-3"
          aria-label="Bake Me Happy, ir al inicio"
          onClick={() => setIsOpen(false)}
        >
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-ink font-display text-xl text-white shadow-soft transition-transform group-hover:rotate-6">
            B
          </span>
          <span className="min-w-0">
            <span className="block truncate font-display text-xl leading-none text-ink">
              Bake Me Happy
            </span>
            <span className="mt-1 block truncate text-[10px] font-semibold uppercase tracking-[0.2em] text-plum">
              Pasteleria artesanal
            </span>
          </span>
        </a>

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Principal">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              aria-current={activePath === link.path ? "page" : undefined}
              className={`text-sm font-medium transition-colors hover:text-plum ${
                activePath === link.path ? "text-plum" : "text-ink/75"
              }`}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <button
          type="button"
          onClick={() => setIsOrderModalOpen(true)}
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

      <div
        id="mobile-navigation"
        className={`overflow-hidden border-t border-blush/35 bg-[linear-gradient(180deg,rgba(255,250,246,0.98)_0%,rgba(255,255,255,0.95)_100%)] shadow-[0_18px_36px_rgba(30,50,100,0.08)] transition-all duration-300 lg:hidden ${
          isOpen ? "max-h-[520px] opacity-100" : "max-h-0 opacity-0"
        }`}
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

          <nav className="mt-2 flex flex-col" aria-label="Movil">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                aria-current={activePath === link.path ? "page" : undefined}
                className={`border-b border-lavender/30 py-4 text-base font-medium ${
                  activePath === link.path ? "text-plum" : "text-ink"
                }`}
              >
                {link.label}
              </a>
            ))}
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                setIsOrderModalOpen(true);
              }}
              className="button-primary mt-5"
            >
              <MessageCircle size={18} aria-hidden="true" />
              Hacer un pedido
            </button>
          </nav>
        </div>
      </div>

      <CustomOrderModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
      />
    </header>
  );
}
