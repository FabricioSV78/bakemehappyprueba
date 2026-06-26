import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const featuredCakes = [
  {
    id: "butterfly",
    name: "Butterfly Lavender",
    detail: "Buttercream · Diseño floral",
    image: "/images/bake-me-happy-hero.jpg",
    imagePosition: "72% center",
  },
  {
    id: "confetti",
    name: "Confetti Pastel",
    detail: "Buttercream · Cumpleaños",
    image: "/images/FONDO.jpg",
    imagePosition: "76% center",
  },
  {
    id: "celebration",
    name: "Pink Celebration",
    detail: "Diseño personalizado",
    image: "/images/fondo1.jpg",
    imagePosition: "76% center",
  },
  {
    id: "mini-lavender",
    name: "Mini Lavender",
    detail: "Formato personal · Buttercream",
    image: "/images/bake-me-happy-hero.jpg",
    imagePosition: "90% 84%",
  },
];

const AUTOPLAY_MS = 4200;
const clonedCakes = [...featuredCakes, ...featuredCakes.slice(0, 3)];

export default function FeaturedGallery() {
  const [slideIndex, setSlideIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [hasTransition, setHasTransition] = useState(true);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (isPaused || prefersReducedMotion) {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      setHasTransition(true);
      setSlideIndex((currentIndex) => currentIndex + 1);
    }, AUTOPLAY_MS);

    return () => window.clearInterval(intervalId);
  }, [isPaused]);

  function goToSlide(index) {
    setHasTransition(true);
    setSlideIndex(index);
  }

  function handlePrevious() {
    setHasTransition(true);
    setSlideIndex((currentIndex) =>
      currentIndex === 0 ? featuredCakes.length - 1 : currentIndex - 1,
    );
  }

  function handleNext() {
    setHasTransition(true);
    setSlideIndex((currentIndex) => currentIndex + 1);
  }

  function handleTransitionEnd() {
    if (slideIndex < featuredCakes.length) {
      return;
    }

    setHasTransition(false);
    setSlideIndex(0);
  }

  const activeDot = slideIndex % featuredCakes.length;

  return (
    <section
      id="galeria"
      className="section-space scroll-mt-20 overflow-hidden bg-cream"
      aria-labelledby="featured-cakes-title"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="mb-8 sm:mb-10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-plum">
              Creaciones destacadas
            </p>
            <h2
              id="featured-cakes-title"
              className="mt-2 max-w-2xl font-display text-3xl leading-tight text-ink sm:text-4xl lg:text-5xl"
            >
              Tortas hechas para celebrar
            </h2>
          </div>
        </div>

        <div
          className="[--carousel-gap:1rem] [--visible-cards:1] sm:[--carousel-gap:1.25rem] sm:[--visible-cards:2] lg:[--visible-cards:3]"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onFocus={() => setIsPaused(true)}
          onBlur={() => setIsPaused(false)}
        >
          <div className="relative lg:px-16">
            <button
              type="button"
              onClick={handlePrevious}
              className="absolute left-0 top-[42%] z-10 hidden h-12 w-12 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-ink/15 bg-white text-ink shadow-soft transition-colors duration-200 hover:border-plum hover:text-plum focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-plum focus-visible:ring-offset-2 lg:inline-flex"
              aria-label="Ver tortas anteriores"
            >
              <ChevronLeft size={21} aria-hidden="true" />
            </button>

            <div className="overflow-hidden">
              <div
                className={`flex gap-[var(--carousel-gap)] ${
                  hasTransition
                    ? "transition-transform duration-[400ms] ease-out"
                    : ""
                } motion-reduce:transition-none`}
                style={{
                  "--slide-index": slideIndex,
                  transform:
                    "translate3d(calc(-1 * var(--slide-index) * (((100% - (var(--visible-cards) - 1) * var(--carousel-gap)) / var(--visible-cards)) + var(--carousel-gap))), 0, 0)",
                }}
                onTransitionEnd={handleTransitionEnd}
                aria-live="off"
              >
                {clonedCakes.map((cake, index) => (
                  <article
                    key={`${cake.id}-${index}`}
                    className="min-w-0 shrink-0"
                    style={{
                      flexBasis:
                        "calc((100% - (var(--visible-cards) - 1) * var(--carousel-gap)) / var(--visible-cards))",
                    }}
                    aria-hidden={
                      index >= featuredCakes.length ? "true" : undefined
                    }
                  >
                    <div className="group overflow-hidden rounded-lg border border-blush/45 bg-white p-2 shadow-soft">
                      <div className="aspect-square overflow-hidden rounded-md bg-lavender-light">
                        <img
                          src={cake.image}
                          alt={
                            index < featuredCakes.length
                              ? `${cake.name}, torta elaborada por Bake Me Happy`
                              : ""
                          }
                          className="h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.025] motion-reduce:transition-none"
                          style={{ objectPosition: cake.imagePosition }}
                          loading="lazy"
                          decoding="async"
                          width="720"
                          height="720"
                        />
                      </div>

                      <div className="px-2 pb-3 pt-4 text-center">
                        <h3 className="font-display text-xl leading-tight text-ink sm:text-2xl">
                          {cake.name}
                        </h3>
                        <p className="mt-1.5 text-sm text-ink/65">
                          {cake.detail}
                        </p>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={handleNext}
              className="absolute right-0 top-[42%] z-10 hidden h-12 w-12 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-ink text-white shadow-soft transition-colors duration-200 hover:bg-plum focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-plum focus-visible:ring-offset-2 lg:inline-flex"
              aria-label="Ver siguientes tortas"
            >
              <ChevronRight size={21} aria-hidden="true" />
            </button>
          </div>

          <div className="mt-6 flex items-center justify-center gap-2">
            {featuredCakes.map((cake, index) => (
              <button
                key={cake.id}
                type="button"
                onClick={() => goToSlide(index)}
                className={`h-2.5 cursor-pointer rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-plum focus-visible:ring-offset-2 ${
                  activeDot === index ? "w-8 bg-plum" : "w-2.5 bg-blush"
                }`}
                aria-label={`Mostrar ${cake.name}`}
                aria-pressed={activeDot === index}
              />
            ))}
          </div>

          <div className="mt-4 flex items-center justify-center gap-2 lg:hidden">
            <button
              type="button"
              onClick={handlePrevious}
              className="inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-ink/15 bg-white text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-plum focus-visible:ring-offset-2"
              aria-label="Ver torta anterior"
            >
              <ChevronLeft size={20} aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-ink text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-plum focus-visible:ring-offset-2"
              aria-label="Ver siguiente torta"
            >
              <ChevronRight size={20} aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
