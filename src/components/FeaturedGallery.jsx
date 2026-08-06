import {
  ArrowRight,
  Heart,
  MessageCircle,
  Sparkles,
  Star,
} from "lucide-react";
import { products } from "../data/products";
import { getProductPriceLabel } from "../utils/productPrice";
import Reveal from "./Reveal";
import AssetImage from "./AssetImage";

const featuredProductIds = [101, 102, 103, 104, 105, 106];
const featuredProducts = featuredProductIds
  .map((productId) => products.find((product) => product.id === productId))
  .filter(Boolean);

export default function FeaturedGallery({ onOpenOrderModal }) {
  const centralProduct = featuredProducts[0];
  const orbitProducts = featuredProducts.slice(1);

  return (
    <section
      id="galeria"
      className="section-space relative hidden scroll-mt-20 overflow-hidden border-y border-blush/25 bg-[linear-gradient(135deg,#FFF4ED_0%,#FFFAF7_48%,#EFF0FC_100%)] lg:block"
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

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-[0.72fr_1.28fr] lg:gap-10">
        <Reveal
          className="mx-auto max-w-xl text-center lg:mx-0 lg:text-left"
          direction="left"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-plum">
            Creaciones destacadas
          </p>
          <h2
            id="featured-cakes-title"
            className="mt-3 font-display text-4xl leading-[1.08] text-ink sm:text-5xl"
          >
            Diseños dulces que inspiran tu próxima celebración
          </h2>
          <p className="mt-5 text-base leading-7 text-ink/70">
            Una pequeña muestra de tortas tematicas hechas para
            cumpleaños, fechas especiales y momentos que merecen algo único.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">
            <a
              href="#/tienda"
              className="button-primary shrink-0 whitespace-nowrap"
            >
              Ver tienda completa
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
          className="featured-orbit relative mx-auto aspect-square w-full max-w-[42rem]"
          direction="scale"
          delay={100}
          role="group"
          aria-label="Galería circular de tortas destacadas"
        >
          <div
            className="pointer-events-none absolute inset-[5%] rounded-full border border-dashed border-plum/30"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute inset-[17%] rounded-full border border-blush/30"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute inset-[9%] rounded-full bg-white/30 shadow-[inset_0_0_55px_rgba(158,168,238,0.42)]"
            aria-hidden="true"
          />

          <div className="absolute inset-0">
            {orbitProducts.map((product, index) => (
              <article
                key={product.id}
                className="featured-orbit-item absolute -translate-x-1/2 -translate-y-1/2"
                style={{ "--orbit-index": index }}
              >
                <div>
                  <a
                    href={`#/producto/${product.id}`}
                    className="group/item relative block h-28 w-28 rounded-full border-[5px] border-white bg-lavender-light shadow-soft transition-[border-color,box-shadow] duration-300 hover:border-blush/55 hover:shadow-[0_18px_40px_rgba(23,54,109,0.18)] focus-visible:border-blush/55 focus-visible:shadow-[0_18px_40px_rgba(23,54,109,0.18)] sm:h-36 sm:w-36 lg:h-40 lg:w-40"
                    aria-label={`Ver ${product.name}, ${getProductPriceLabel(product)}`}
                  >
                    <span className="block h-full w-full overflow-hidden rounded-full">
                      <AssetImage
                        src={product.image}
                        alt={`${product.name} de Bake Me Happy`}
                        className="h-full w-full transform-gpu object-cover transition-[transform,filter] duration-500 ease-out group-hover/item:scale-[1.04] group-hover/item:brightness-[1.04] group-hover/item:saturate-[1.08] group-focus-visible/item:scale-[1.04] group-focus-visible/item:brightness-[1.04] group-focus-visible/item:saturate-[1.08]"
                        style={{ objectPosition: product.imagePosition }}
                        loading="lazy"
                        decoding="async"
                        width="224"
                        height="224"
                      />
                    </span>
                    <span className="featured-orbit-label absolute left-1/2 top-[calc(100%-0.35rem)] z-10 flex w-max min-w-[6.5rem] -translate-x-1/2 items-center justify-center rounded-full border border-blush/25 bg-white px-3 py-1.5 text-center shadow-sm sm:min-w-[7rem]">
                      <span className="block whitespace-nowrap text-[11px] font-bold leading-tight text-plum sm:text-xs">
                        {getProductPriceLabel(product)}
                      </span>
                    </span>
                  </a>
                </div>
              </article>
            ))}
          </div>

          <article className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
            <a
              href={`#/producto/${centralProduct.id}`}
              className="group/central relative block h-[7.75rem] w-[7.75rem] rounded-[1.65rem] border-[7px] border-white bg-white shadow-lift transition-[border-color,box-shadow] duration-300 hover:border-blush/55 hover:shadow-[0_24px_55px_rgba(23,54,109,0.22)] focus-visible:border-blush/55 focus-visible:shadow-[0_24px_55px_rgba(23,54,109,0.22)] sm:h-44 sm:w-44 sm:rounded-[1.85rem] lg:h-52 lg:w-52"
              aria-label={`Ver ${centralProduct.name}, ${getProductPriceLabel(centralProduct)}`}
            >
              <span className="block h-full w-full overflow-hidden rounded-[1.3rem] sm:rounded-[1.5rem]">
                <AssetImage
                  src={centralProduct.image}
                  alt={`${centralProduct.name}, torta destacada de Bake Me Happy`}
                  className="h-full w-full transform-gpu object-cover transition-[transform,filter] duration-500 ease-out group-hover/central:scale-[1.04] group-hover/central:brightness-[1.04] group-hover/central:saturate-[1.08] group-focus-visible/central:scale-[1.04] group-focus-visible/central:brightness-[1.04] group-focus-visible/central:saturate-[1.08]"
                  style={{ objectPosition: centralProduct.imagePosition }}
                  loading="lazy"
                  decoding="async"
                  width="416"
                  height="416"
                />
              </span>
              <span className="featured-orbit-label absolute left-1/2 top-[calc(100%-0.25rem)] z-10 flex w-max min-w-[7rem] -translate-x-1/2 items-center justify-center rounded-full border border-blush/25 bg-white px-3.5 py-2 text-center shadow-soft">
                <span className="block whitespace-nowrap text-xs font-bold leading-tight text-plum sm:text-sm">
                  {getProductPriceLabel(centralProduct)}
                </span>
              </span>
            </a>
          </article>

          <Sparkles
            className="pointer-events-none absolute left-[12%] top-[27%] z-20 text-gold"
            size={20}
            strokeWidth={1.7}
            aria-hidden="true"
          />
          <Heart
            className="pointer-events-none absolute bottom-[21%] right-[10%] z-20 text-blush"
            size={24}
            strokeWidth={1.7}
            aria-hidden="true"
          />
        </Reveal>
      </div>
    </section>
  );
}
