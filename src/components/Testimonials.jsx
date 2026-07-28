import { useEffect, useRef, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Quote,
  Star,
} from "lucide-react";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import { testimonials } from "../data/testimonials";

const CAROUSEL_GAP = 24;
const CAROUSEL_INTERVAL = 8000;
const CAROUSEL_COPIES = 3;

function TestimonialCard({ testimonial, index }) {
  return (
    <figure
      className={`flex h-full flex-col rounded-lg border p-6 sm:p-7 ${
        index % 2 === 1
          ? "border-lavender/30 bg-[#F3F3FC]"
          : "border-blush/30 bg-[#FFFAF7]"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div
          className="flex gap-1 text-gold"
          aria-label={`Calificación: ${testimonial.rating} de 5 estrellas`}
        >
          {Array.from({ length: 5 }, (_, starIndex) => starIndex + 1).map(
            (star) => (
              <Star
                key={star}
                size={16}
                fill={star <= testimonial.rating ? "currentColor" : "none"}
                aria-hidden="true"
              />
            ),
          )}
        </div>
        <Quote
          size={34}
          strokeWidth={1.2}
          className="shrink-0 text-plum/35"
          aria-hidden="true"
        />
      </div>

      <blockquote className="mt-6 flex-1 text-base leading-7 text-ink/80">
        "{testimonial.quote}"
      </blockquote>

      <figcaption className="mt-7 border-t border-ink/10 pt-5">
        <span className="block font-semibold text-ink">{testimonial.name}</span>
        <span className="mt-1 block text-xs font-medium uppercase tracking-[0.13em] text-plum">
          {testimonial.source}
        </span>
      </figcaption>
    </figure>
  );
}

export default function Testimonials() {
  const viewportRef = useRef(null);
  const hasMeasuredRef = useRef(false);
  const animationFrameRef = useRef(null);
  const [slideWidth, setSlideWidth] = useState(0);
  const [trackIndex, setTrackIndex] = useState(0);
  const [transitionEnabled, setTransitionEnabled] = useState(false);

  const repeatedTestimonials = Array.from(
    { length: CAROUSEL_COPIES },
    (_, copyIndex) =>
      testimonials.map((testimonial, testimonialIndex) => ({
        testimonial,
        testimonialIndex,
        copyIndex,
      })),
  ).flat();

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return undefined;

    const updateCarouselSize = () => {
      const viewportWidth = viewport.clientWidth;
      const visibleSlides =
        viewportWidth >= 900 ? 3 : viewportWidth >= 600 ? 2 : 1;
      const nextSlideWidth =
        (viewportWidth - CAROUSEL_GAP * (visibleSlides - 1)) / visibleSlides;

      setTransitionEnabled(false);
      setSlideWidth(nextSlideWidth);

      if (!hasMeasuredRef.current) {
        setTrackIndex(testimonials.length);
        hasMeasuredRef.current = true;
      }

      window.cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = window.requestAnimationFrame(() => {
        setTransitionEnabled(true);
      });
    };

    updateCarouselSize();
    const resizeObserver = new ResizeObserver(updateCarouselSize);
    resizeObserver.observe(viewport);

    return () => {
      resizeObserver.disconnect();
      window.cancelAnimationFrame(animationFrameRef.current);
    };
  }, []);

  useEffect(() => {
    if (!slideWidth) return undefined;

    const interval = window.setInterval(() => {
      setTransitionEnabled(true);
      setTrackIndex((currentIndex) => currentIndex + 1);
    }, CAROUSEL_INTERVAL);

    return () => window.clearInterval(interval);
  }, [slideWidth]);

  const moveCarousel = (direction) => {
    setTransitionEnabled(true);
    setTrackIndex((currentIndex) => currentIndex + direction);
  };

  const resetTrackPosition = () => {
    setTransitionEnabled(false);
    setTrackIndex(testimonials.length);
    window.cancelAnimationFrame(animationFrameRef.current);
    animationFrameRef.current = window.requestAnimationFrame(() => {
      setTransitionEnabled(true);
    });
  };

  const handleTransitionEnd = () => {
    if (
      trackIndex <= 0 ||
      trackIndex >= testimonials.length * (CAROUSEL_COPIES - 1)
    ) {
      resetTrackPosition();
    }
  };

  return (
    <section
      id="testimonios"
      className="section-space scroll-mt-20 overflow-hidden bg-cream"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex justify-center">
          <SectionHeading
            eyebrow="Clientes felices"
            title="Celebraciones que dejan un dulce recuerdo"
            description="Cada mensaje nos inspira a seguir creando pedidos que se vean tan bien como saben."
          />
        </div>

        <Reveal className="mt-12">
          <div>
            <div
              ref={viewportRef}
              className="overflow-hidden"
              role="region"
              aria-roledescription="carrusel"
              aria-label="Reseñas de clientes"
            >
              <div
                className="flex items-stretch gap-6"
                style={{
                  transform: `translate3d(${-trackIndex * (slideWidth + CAROUSEL_GAP)}px, 0, 0)`,
                  transition: transitionEnabled
                    ? "transform 650ms cubic-bezier(0.22, 1, 0.36, 1)"
                    : "none",
                }}
                onTransitionEnd={handleTransitionEnd}
                aria-hidden="true"
              >
                {repeatedTestimonials.map(
                  ({ testimonial, testimonialIndex, copyIndex }) => (
                    <div
                      key={`${copyIndex}-${testimonial.id}`}
                      className="shrink-0"
                      style={{ width: `${slideWidth}px` }}
                    >
                      <TestimonialCard
                        testimonial={testimonial}
                        index={testimonialIndex}
                      />
                    </div>
                  ),
                )}
              </div>
            </div>

            <div className="sr-only">
              {testimonials.map((testimonial) => (
                <article key={testimonial.id}>
                  <h3>{testimonial.name}</h3>
                  <p>{testimonial.quote}</p>
                  <p>{testimonial.rating} de 5 estrellas</p>
                </article>
              ))}
            </div>

            <div className="mt-7 flex items-center justify-center gap-3">
              <button
                type="button"
                className="grid h-11 w-11 place-items-center rounded-full border border-blush/30 bg-white text-ink shadow-sm transition-colors hover:border-plum/35 hover:text-plum focus:outline-none focus:ring-4 focus:ring-plum/10"
                onClick={() => moveCarousel(-1)}
                aria-label="Mostrar reseñas anteriores"
              >
                <ChevronLeft size={19} aria-hidden="true" />
              </button>
              <button
                type="button"
                className="grid h-11 w-11 place-items-center rounded-full border border-blush/30 bg-white text-ink shadow-sm transition-colors hover:border-plum/35 hover:text-plum focus:outline-none focus:ring-4 focus:ring-plum/10"
                onClick={() => moveCarousel(1)}
                aria-label="Mostrar reseñas siguientes"
              >
                <ChevronRight size={19} aria-hidden="true" />
              </button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
