import { useEffect, useState } from "react";
import { Menu, MessageCircle, X } from "lucide-react";
import { getWhatsAppUrl, NAV_LINKS } from "../data/site";

export default function Header({ currentPath = "/" }) {
  const [isOpen, setIsOpen] = useState(false);
  const activePath = currentPath.startsWith("/producto/")
    ? "/catalogo"
    : currentPath;

  useEffect(() => {
    const closeMenu = () => setIsOpen(false);
    window.addEventListener("resize", closeMenu);
    return () => window.removeEventListener("resize", closeMenu);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/60 bg-cream/90 backdrop-blur-lg">
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
              Pastelería artesanal
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

        <a
          href={getWhatsAppUrl()}
          target="_blank"
          rel="noreferrer"
          className="button-primary hidden lg:inline-flex"
        >
          <MessageCircle size={18} aria-hidden="true" />
          Hacer un pedido
        </a>

        <button
          type="button"
          className="grid h-12 w-12 shrink-0 place-items-center rounded-full text-ink transition-colors hover:bg-lavender-light lg:hidden"
          onClick={() => setIsOpen((current) => !current)}
          aria-expanded={isOpen}
          aria-controls="mobile-navigation"
          aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
        >
          {isOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
      </div>

      <div
        id="mobile-navigation"
        className={`overflow-hidden border-t border-lavender/40 bg-cream transition-all duration-300 lg:hidden ${
          isOpen ? "max-h-[520px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <nav className="mx-auto flex max-w-7xl flex-col px-5 py-4" aria-label="Movil">
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
          <a
            href={getWhatsAppUrl()}
            target="_blank"
            rel="noreferrer"
            className="button-primary mt-5"
          >
            <MessageCircle size={18} aria-hidden="true" />
            Hacer un pedido
          </a>
        </nav>
      </div>
    </header>
  );
}
