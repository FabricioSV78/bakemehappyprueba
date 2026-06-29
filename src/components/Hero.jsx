import { useEffect, useState } from "react";
import { ArrowRight, MessageCircle, Sparkles } from "lucide-react";
import { getWhatsAppUrl } from "../data/site";

const HERO_SLIDES = [
  {
    src: "/images/webp/bake-me-happy-hero.webp",
    position:
      "object-[73%_32%] sm:object-[70%_34%] lg:object-[68%_44%]",
  },
  {
    src: "/images/webp/FONDO.webp",
    position:
      "object-[78%_50%] sm:object-[75%_50%] lg:object-[68%_50%]",
  },
  {
    src: "/images/webp/fondo1.webp",
    position:
      "object-[76%_50%] sm:object-[74%_50%] lg:object-[68%_50%]",
  },
];

const SLIDE_INTERVAL_MS = 2000;

export default function Hero() {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % HERO_SLIDES.length);
    }, SLIDE_INTERVAL_MS);

    return () => window.clearInterval(intervalId);
  }, []);

  return (
    <section
      id="inicio"
      className="relative isolate flex min-h-svh overflow-hidden bg-[#f9f1f3]"
    >
      <div className="absolute inset-0 -z-20" aria-hidden="true">
        {HERO_SLIDES.map((slide, index) => (
          <img
            key={slide.src}
            src={slide.src}
            alt=""
            className={`absolute inset-0 h-full w-full object-cover ${slide.position} transition-opacity duration-1000 ease-in-out ${
              index === activeSlide ? "opacity-100" : "opacity-0"
            }`}
            fetchPriority={index === 0 ? "high" : "auto"}
            loading="eager"
            decoding="async"
          />
        ))}
      </div>

      <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(255,248,243,0.05)_0%,rgba(255,248,243,0.18)_30%,rgba(255,248,243,0.94)_61%,rgba(255,248,243,0.99)_100%)] sm:bg-[linear-gradient(90deg,rgba(255,248,243,0.99)_0%,rgba(255,248,243,0.96)_35%,rgba(255,248,243,0.68)_57%,rgba(255,248,243,0.12)_82%,rgba(255,248,243,0.03)_100%)]" />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(18,42,94,0.06)_0%,transparent_24%,transparent_76%,rgba(255,248,243,0.28)_100%)]" />

      <div className="mx-auto flex min-h-svh w-full max-w-7xl items-end px-5 pb-10 pt-28 sm:items-center sm:px-8 sm:pb-16 sm:pt-28 lg:pb-12">
        <div className="w-full min-w-0 max-w-2xl sm:max-w-xl lg:max-w-2xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-plum/20 bg-white/75 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-plum backdrop-blur">
            <Sparkles size={15} aria-hidden="true" />
            Tu pastelería virtual en Trujillo
          </div>
          <h1 className="break-words font-display text-5xl leading-[0.98] text-ink sm:text-6xl lg:text-7xl">
            Bake Me Happy
          </h1>
          <p className="mt-4 max-w-full break-words text-xl font-semibold leading-snug text-plum sm:max-w-xl sm:text-2xl">
            Tortas y postres personalizados para momentos especiales
          </p>
          <p className="mt-5 max-w-full break-words text-base leading-7 text-ink/75 sm:max-w-xl sm:text-lg">
            Creamos tortas temáticas, postres clásicos y detalles dulces
            personalizados para cumpleaños, celebraciones y fechas especiales.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href={getWhatsAppUrl()}
              target="_blank"
              rel="noreferrer"
              className="button-primary w-full sm:w-auto"
            >
              <MessageCircle size={19} aria-hidden="true" />
              Hacer mi pedido
            </a>
            <a href="#/catalogo" className="button-secondary w-full sm:w-auto">
              Ver catálogo
              <ArrowRight size={18} aria-hidden="true" />
            </a>
          </div>
          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium text-ink/65">
            <span>Diseños personalizados</span>
            <span>Precios referenciales</span>
            <span>Delivery coordinado</span>
          </div>
        </div>
      </div>

      <div
        className="pointer-events-none absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2 sm:bottom-6"
        aria-hidden="true"
      >
        {HERO_SLIDES.map((slide, index) => (
          <span
            key={slide.src}
            className={`h-1.5 rounded-full transition-all duration-500 ${
              index === activeSlide
                ? "w-7 bg-ink"
                : "w-1.5 bg-white/90 shadow-sm"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
