import { useEffect, useRef, useState } from "react";
import { ArrowRight, CakeSlice, MessageCircle } from "lucide-react";
import AssetImage from "./AssetImage";

const HERO_SLIDES = [
  {
    src: "/images/webp/hero 2.webp",
    position:
      "object-[83%_50%] sm:object-[90%_34%] lg:object-[68%_50%]",
    mobileTop: "-10%",
    mobileHeight: "110%",
  },
  {
    src: "/images/webp/hero 3.webp",
    position:
      "object-[71%_48%] sm:object-[77%_30%] lg:object-[68%_50%]",
    mobileTop: "-8%",
    mobileHeight: "108%",
  },
];

const SLIDE_INTERVAL_MS = 5000;

export default function Hero({ onOpenOrderModal }) {
  const [activeSlide, setActiveSlide] = useState(0);
  const [firstSlideReady, setFirstSlideReady] = useState(false);
  const [slidesReady, setSlidesReady] = useState(false);
  const [autoPlayEnabled, setAutoPlayEnabled] = useState(false);
  const loadedSlidesRef = useRef(new Set());

  const markSlideAsLoaded = (index) => {
    loadedSlidesRef.current.add(index);
    if (index === 0) setFirstSlideReady(true);
    if (loadedSlidesRef.current.size === HERO_SLIDES.length) {
      setSlidesReady(true);
    }
  };

  useEffect(() => {
    if (autoPlayEnabled) return undefined;

    const enableAutoPlay = () => setAutoPlayEnabled(true);
    const passiveOptions = { once: true, passive: true };

    window.addEventListener("pointerdown", enableAutoPlay, passiveOptions);
    window.addEventListener("wheel", enableAutoPlay, passiveOptions);
    window.addEventListener("keydown", enableAutoPlay, { once: true });

    return () => {
      window.removeEventListener("pointerdown", enableAutoPlay);
      window.removeEventListener("wheel", enableAutoPlay);
      window.removeEventListener("keydown", enableAutoPlay);
    };
  }, [autoPlayEnabled]);

  useEffect(() => {
    if (
      !slidesReady ||
      !autoPlayEnabled ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % HERO_SLIDES.length);
    }, SLIDE_INTERVAL_MS);

    return () => window.clearInterval(intervalId);
  }, [autoPlayEnabled, slidesReady]);

  return (
    <section
      id="inicio"
      className="relative isolate mt-20 flex min-h-[max(42rem,calc(100svh-5rem))] overflow-hidden bg-[#F2DEE6] lg:mt-[9.375rem] lg:min-h-[max(42rem,calc(100svh-9.375rem))]"
    >
      <div className="absolute inset-0 -z-20" aria-hidden="true">
        {HERO_SLIDES.map((slide, index) => {
          if (index > 0 && !firstSlideReady) return null;

          return (
            <AssetImage
              key={slide.src}
              src={slide.src}
              alt=""
              className={`hero-slide-image absolute inset-0 h-full w-full object-cover ${slide.position} transition-[opacity,transform] duration-[1400ms] ease-out motion-reduce:transition-none ${
                index === activeSlide
                  ? "scale-100 opacity-100"
                  : "scale-[1.018] opacity-0"
              }`}
              style={{
                "--hero-mobile-top": slide.mobileTop,
                "--hero-mobile-height": slide.mobileHeight,
              }}
              fetchPriority={index === 0 ? "high" : "low"}
              loading={index === 0 ? "eager" : "lazy"}
              decoding="async"
              onLoad={() => markSlideAsLoaded(index)}
            />
          );
        })}
      </div>

      <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(255,241,231,0.02)_0%,rgba(255,241,231,0.06)_42%,rgba(255,241,231,0.84)_61%,rgba(255,241,231,0.98)_75%,rgba(255,241,231,0.99)_100%)] lg:bg-[linear-gradient(90deg,rgba(255,241,231,0.98)_0%,rgba(255,241,231,0.90)_31%,rgba(255,241,231,0.52)_53%,rgba(255,241,231,0.08)_78%,rgba(255,241,231,0.02)_100%)]" />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(23,54,109,0.10)_0%,transparent_24%,transparent_76%,rgba(234,134,168,0.20)_100%)]" />

      <div
        className="brand-sprinkles-panel absolute left-[max(1rem,calc((100vw-80rem)/2))] top-1/2 -z-[5] hidden h-28 w-28 -translate-y-[13rem] rounded-full opacity-60 lg:block"
        aria-hidden="true"
      />

      <div className="mx-auto flex min-h-[max(42rem,calc(100svh-5rem))] w-full max-w-7xl items-end px-5 pb-12 pt-24 sm:px-8 sm:pb-14 lg:min-h-[max(42rem,calc(100svh-9.375rem))] lg:items-center lg:pb-12 lg:pt-0">
        <div className="w-full min-w-0 max-w-2xl sm:max-w-xl lg:max-w-2xl">
          <div
            className="hero-reveal mb-4 inline-flex items-center gap-2 rounded-full border border-plum/35 bg-white/88 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-plum backdrop-blur sm:mb-6 sm:px-4 sm:py-2 sm:text-xs sm:tracking-[0.16em]"
            style={{ "--hero-delay": "60ms" }}
          >
            <CakeSlice size={15} aria-hidden="true" />
            Tu pastelería virtual en Trujillo
          </div>
          <h1
            className="hero-reveal break-words font-display text-[clamp(2.6rem,12vw,3.5rem)] font-semibold leading-[0.98] text-ink sm:text-6xl lg:text-7xl"
            style={{ "--hero-delay": "150ms" }}
          >
            Bake Me Happy
          </h1>
          <p
            className="hero-reveal mt-3 max-w-full break-words text-lg font-semibold leading-snug text-plum sm:mt-4 sm:max-w-xl sm:text-2xl"
            style={{ "--hero-delay": "230ms" }}
          >
            Tortas y postres personalizados para momentos especiales
          </p>
          <p
            className="hero-reveal mt-3 max-w-full break-words text-sm leading-6 text-ink/75 sm:mt-5 sm:max-w-xl sm:text-lg sm:leading-7"
            style={{ "--hero-delay": "310ms" }}
          >
            Creamos tortas temáticas, postres clásicos y detalles dulces
            personalizados para cumpleaños, celebraciones y fechas especiales.
          </p>
          <div
            className="hero-reveal mt-5 flex flex-col gap-3 min-[380px]:flex-row sm:mt-8"
            style={{ "--hero-delay": "390ms" }}
          >
            <button
              type="button"
              onClick={onOpenOrderModal}
              className="button-primary w-full min-[380px]:min-w-0 min-[380px]:flex-1 sm:w-auto sm:flex-none"
            >
              <MessageCircle size={19} aria-hidden="true" />
              Hacer mi pedido
            </button>
            <a
              href="/tienda"
              className="button-secondary w-full min-[380px]:min-w-0 min-[380px]:flex-1 sm:w-auto sm:flex-none"
            >
              Ver tienda
              <ArrowRight size={18} aria-hidden="true" />
            </a>
          </div>
         
        </div>
      </div>

      <div
        className="absolute bottom-1 left-1/2 flex -translate-x-1/2 items-center sm:bottom-2"
        role="group"
        aria-label="Seleccionar imagen del inicio"
      >
        {HERO_SLIDES.map((slide, index) => (
          <button
            type="button"
            key={slide.src}
            className="group grid h-10 w-10 place-items-center rounded-full"
            onClick={() => setActiveSlide(index)}
            disabled={!slidesReady}
            aria-label={`Mostrar imagen ${index + 1} de ${HERO_SLIDES.length}`}
            aria-current={index === activeSlide ? "true" : undefined}
          >
            <span
              className={`h-1.5 rounded-full transition-all duration-500 group-hover:bg-plum group-focus-visible:bg-plum ${
                index === activeSlide
                  ? "w-7 bg-ink"
                  : "w-1.5 bg-white shadow-sm ring-1 ring-ink/10"
              }`}
              aria-hidden="true"
            />
          </button>
        ))}
      </div>
    </section>
  );
}
