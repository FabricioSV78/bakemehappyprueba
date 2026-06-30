import { useEffect, useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { products } from "../data/products";

const featuredProductIds = [1, 7, 14, 15];
const featuredCakes = featuredProductIds
  .map((productId) => products.find((product) => product.id === productId))
  .filter(Boolean)
  .map((product) => ({
    id: String(product.id),
    name: product.name,
    detail: product.servings,
    image: product.image,
    imagePosition: product.imagePosition ?? "center",
  }));

const AUTOPLAY_MS = 4200;

export default function FeaturedGallery() {
  const [slideIndex, setSlideIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [hasTransition, setHasTransition] = useState(true);
  const [visibleCards, setVisibleCards] = useState(() => {
    if (typeof window === "undefined") {
      return 1;
    }

    if (window.innerWidth >= 1024) {
      return 3;
    }

    if (window.innerWidth >= 640) {
      return 2;
    }

    return 1;
  });
  const clonedCakes = [
    ...featuredCakes,
    ...featuredCakes.slice(0, visibleCards),
  ];

  useEffect(() => {
    function syncVisibleCards() {
      if (window.innerWidth >= 1024) {
        setVisibleCards(3);
        return;
      }

      if (window.innerWidth >= 640) {
        setVisibleCards(2);
        return;
      }

      setVisibleCards(1);
    }

    syncVisibleCards();
    window.addEventListener("resize", syncVisibleCards);

    return () => window.removeEventListener("resize", syncVisibleCards);
  }, []);

  useEffect(() => {
    if (isPaused) {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      setHasTransition(true);
      setSlideIndex((currentIndex) =>
        currentIndex >= featuredCakes.length ? currentIndex : currentIndex + 1,
      );
    }, AUTOPLAY_MS);

    return () => window.clearInterval(intervalId);
  }, [isPaused]);

  function goToSlide(index) {
    setHasTransition(true);
    setSlideIndex(index);
  }

  function handlePrevious() {
    setHasTransition(true);
    setSlideIndex((currentIndex) => {
      if (currentIndex >= featuredCakes.length) {
        return featuredCakes.length - 1;
      }

      return currentIndex === 0 ? featuredCakes.length - 1 : currentIndex - 1;
    });
  }

  function handleNext() {
    setHasTransition(true);
    setSlideIndex((currentIndex) =>
      currentIndex >= featuredCakes.length ? 1 : currentIndex + 1,
    );
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
        <div className="mb-8 flex flex-col gap-5 sm:mb-10 lg:flex-row lg:items-end lg:justify-between">
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

          <a
            href="#/catalogo"
            className="button-secondary w-full sm:w-auto lg:shrink-0"
          >
            Ver catálogo completo
            <ArrowRight size={18} aria-hidden="true" />
          </a>
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
                }`}
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
                    <div className="group overflow-hidden rounded-lg border border-blush/45 bg-white p-2 shadow-sm transition-shadow duration-300 hover:shadow-soft">
                      <div className="aspect-[5/4] overflow-hidden rounded-md bg-blush/20">
                        <img
                          src={cake.image}
                          alt={
                            index < featuredCakes.length
                              ? `${cake.name}, torta elaborada por Bake Me Happy`
                              : ""
                          }
                          className="h-full w-full object-cover"
                          style={{ objectPosition: cake.imagePosition }}
                          loading="lazy"
                          decoding="async"
                          width="560"
                          height="448"
                        />
                      </div>

                      <div className="px-2 pb-3 pt-4 text-center">
                        <h3 className="font-display text-xl leading-tight text-ink sm:text-[1.7rem]">
                          {cake.name}
                        </h3>
                        <p className="mt-1.5 text-sm font-medium text-plum/80">
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
