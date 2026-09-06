import { useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Heart,
  MessageCircle,
  Sparkles,
  Star,
} from "lucide-react";
import { products } from "../data/products";
import {
  IMAGE_SIZES,
  IMAGE_SOURCE_WIDTHS,
  RESPONSIVE_IMAGE_WIDTHS,
} from "../data/imageDelivery";
import { getProductPriceLabel } from "../utils/productPrice";
import Reveal from "./Reveal";
import AssetImage from "./AssetImage";

const CLASSIC_CAKE_CATEGORY = "Tortas clasicas";

const classicCakes = products.filter(
  (product) =>
    product.category === CLASSIC_CAKE_CATEGORY &&
    product.hasProductImages !== false,
).slice(0, 6);

function getShortCakeName(productName) {
  return productName.replace(/^Torta (de )?/i, "");
}

export default function FeaturedGallery({ onOpenOrderModal }) {
  const carouselRef = useRef(null);
  const [currentCakeIndex, setCurrentCakeIndex] = useState(0);

  const updateCurrentCake = useCallback(() => {
    const carousel = carouselRef.current;
    const firstCard = carousel?.firstElementChild;
    if (!carousel || !firstCard) return;

    const styles = window.getComputedStyle(carousel);
    const gap = Number.parseFloat(styles.columnGap || styles.gap) || 0;
    const step = firstCard.getBoundingClientRect().width + gap;
    const nextIndex = Math.min(
      classicCakes.length - 1,
      Math.max(0, Math.round(carousel.scrollLeft / step)),
    );

    setCurrentCakeIndex(nextIndex);
  }, []);

  const scrollToCake = (cakeIndex) => {
    const carousel = carouselRef.current;
    const cards = carousel?.children;
    if (!carousel || !cards?.length) return;

    const nextIndex = Math.min(
      cards.length - 1,
      Math.max(0, cakeIndex),
    );
    const card = cards[nextIndex];
    const styles = window.getComputedStyle(carousel);
    const gap = Number.parseFloat(styles.columnGap || styles.gap) || 0;
    const step = card.getBoundingClientRect().width + gap;

    carousel.scrollTo({
      left: nextIndex * step,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
    });
    setCurrentCakeIndex(nextIndex);
  };

  useEffect(() => {
    const handleResize = () => updateCurrentCake();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [updateCurrentCake]);

  if (classicCakes.length === 0) return null;

  return (
    <section
      id="galeria"
      className="section-space relative scroll-mt-20 overflow-hidden border-y border-blush/25 bg-[linear-gradient(135deg,#FFF4ED_0%,#FFFAF7_48%,#EFF0FC_100%)]"
      aria-labelledby="featured-cakes-title"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-soft-grid opacity-45 [background-size:28px_28px]"
        aria-hidden="true"
      />
      <Heart
        className="pointer-events-none absolute left-[5%] top-14 hidden text-blush/85 sm:block"
        size={44}
        strokeWidth={1.4}
        aria-hidden="true"
      />
      <Sparkles
        className="pointer-events-none absolute right-[7%] top-16 text-gold/75"
        size={36}
        strokeWidth={1.4}
        aria-hidden="true"
      />
      <Star
        className="pointer-events-none absolute bottom-16 left-[8%] hidden text-lavender sm:block"
        size={28}
        strokeWidth={1.4}
        aria-hidden="true"
      />

      <div className="relative mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)] items-center gap-12 px-5 sm:px-8 lg:grid-cols-[0.72fr_1.28fr] lg:gap-10">
        <Reveal
          className="mx-auto max-w-xl text-center lg:mx-0 lg:text-left"
          direction="left"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-plum">
            Tortas clásicas
          </p>
          <h2
            id="featured-cakes-title"
            className="mt-3 font-display text-4xl leading-[1.08] text-ink sm:text-5xl"
          >
            Sabores clásicos para compartir y celebrar
          </h2>
          <p className="mt-5 text-base leading-7 text-ink/70">
            Recetas artesanales de chocolate, red velvet, zanahoria y tres
            leches, preparadas con ingredientes seleccionados y acabados
            delicados.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">
            <a
              href="/tienda?categoria=Tortas%20clasicas"
              className="button-primary shrink-0 whitespace-nowrap"
            >
              Ver tortas clásicas
              <ArrowRight size={18} aria-hidden="true" />
            </a>
            <button
              type="button"
              onClick={onOpenOrderModal}
              className="button-secondary shrink-0 whitespace-nowrap"
            >
              <MessageCircle size={18} aria-hidden="true" />
              Pedir una torta personalizada
            </button>
          </div>
        </Reveal>

        <Reveal
          className="classic-collage-reveal relative mx-auto w-full max-w-[44rem] lg:h-[34rem] xl:h-[39rem]"
          direction="scale"
          delay={100}
          role="group"
          aria-label="Collage de tortas clásicas"
          aria-describedby="classic-cakes-mobile-hint"
        >
          <p
            id="classic-cakes-mobile-hint"
            className="absolute -top-7 left-0 text-xs font-medium text-ink/60 lg:hidden"
          >
            Desliza para ver más tortas
          </p>
          <div
            className="pointer-events-none absolute -bottom-8 -right-8 h-56 w-56 rounded-full bg-lavender/15 blur-2xl"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute -left-8 -top-8 h-48 w-48 rounded-full bg-blush/20 blur-2xl"
            aria-hidden="true"
          />

          <div
            ref={carouselRef}
            className="classic-cake-collage relative z-10 h-[26rem] sm:h-[29rem] lg:h-full"
            onScroll={updateCurrentCake}
          >
            {classicCakes.map((product, index) => (
              <article
                key={product.id}
                className={`classic-cake-tile classic-cake-tile-${index + 1}`}
                style={{ "--collage-delay": `${100 + index * 90}ms` }}
              >
                <a
                  href={`/producto/${product.id}`}
                  className="group/tile flex h-full min-h-0 flex-col overflow-hidden rounded-[1.5rem] border border-blush/30 bg-white shadow-soft transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-1 hover:border-blush/65 hover:shadow-lift focus-visible:-translate-y-1 focus-visible:border-blush/65 focus-visible:shadow-lift"
                  aria-label={`Ver ${product.name}, ${getProductPriceLabel(product)}`}
                >
                  <span className="relative min-h-0 flex-1 overflow-hidden bg-white">
                    <AssetImage
                      src={product.image}
                      alt={`${product.name} de Bake Me Happy`}
                      className="h-full w-full transform-gpu object-contain transition-[transform,filter] duration-500 ease-out group-hover/tile:scale-[1.035] group-hover/tile:brightness-[1.025] group-hover/tile:saturate-[1.06] group-focus-visible/tile:scale-[1.035]"
                      style={{ objectPosition: product.imagePosition }}
                      loading="lazy"
                      decoding="async"
                      revealWhenReady
                      responsiveWidths={RESPONSIVE_IMAGE_WIDTHS.product}
                      sourceWidth={IMAGE_SOURCE_WIDTHS.product}
                      sizes={IMAGE_SIZES.featuredCard}
                      width="416"
                      height="416"
                    />
                  </span>
                  <span className="flex min-h-[4.25rem] shrink-0 flex-col items-center justify-center border-t border-blush/20 bg-[linear-gradient(135deg,#FFFAF7_0%,#FFF4F7_100%)] px-2.5 py-2 text-center xl:min-h-[4.75rem] xl:px-3">
                    <span className="text-[11px] font-bold leading-[1.2] text-ink xl:text-xs">
                      {getShortCakeName(product.name)}
                    </span>
                    <span className="mt-1 whitespace-nowrap rounded-full border border-lavender/35 bg-lavender-light/70 px-2.5 py-0.5 text-[10px] font-semibold leading-tight text-plum xl:text-[11px]">
                      {getProductPriceLabel(product)}
                    </span>
                  </span>
                </a>
              </article>
            ))}
          </div>

          <div
            className="relative z-20 mt-4 flex items-center justify-center gap-3 lg:hidden"
            aria-label="Controles de tortas clásicas"
          >
            <button
              type="button"
              onClick={() => scrollToCake(currentCakeIndex - 1)}
              disabled={currentCakeIndex === 0}
              className="grid h-12 w-12 place-items-center rounded-full border border-blush/35 bg-white text-ink shadow-sm transition-[color,transform,box-shadow,opacity] duration-200 hover:-translate-y-0.5 hover:text-plum hover:shadow-md disabled:pointer-events-none disabled:opacity-35"
              aria-label="Ver torta anterior"
            >
              <ArrowLeft size={19} aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => scrollToCake(currentCakeIndex + 1)}
              disabled={currentCakeIndex === classicCakes.length - 1}
              className="grid h-12 w-12 place-items-center rounded-full border border-plum/30 bg-white text-plum shadow-sm ring-4 ring-lavender/20 transition-[color,transform,box-shadow,opacity] duration-200 hover:-translate-y-0.5 hover:shadow-md disabled:pointer-events-none disabled:opacity-35"
              aria-label="Ver siguiente torta"
            >
              <ArrowRight size={19} aria-hidden="true" />
            </button>
          </div>

          <Sparkles
            className="pointer-events-none absolute -right-3 -top-4 z-20 text-gold"
            size={20}
            strokeWidth={1.7}
            aria-hidden="true"
          />
          <Heart
            className="pointer-events-none absolute -bottom-4 -left-3 z-20 text-blush"
            size={24}
            strokeWidth={1.7}
            aria-hidden="true"
          />
        </Reveal>
      </div>
    </section>
  );
}
