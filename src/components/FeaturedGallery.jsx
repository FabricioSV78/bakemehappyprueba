import {
  ArrowRight,
  Heart,
  MessageCircle,
  Sparkles,
  Star,
} from "lucide-react";
import { products } from "../data/products";
import { getWhatsAppUrl } from "../data/site";

const featuredProductIds = [1, 7, 2, 13, 6, 14];
const featuredProducts = featuredProductIds
  .map((productId) => products.find((product) => product.id === productId))
  .filter(Boolean);

const whatsappMessage =
  "Hola, vengo de la página web de Bake Me Happy. Quisiera consultar por una torta personalizada.";

function getOrbitPosition(index, total) {
  const angle = -90 + (360 / total) * index;
  const radians = (angle * Math.PI) / 180;
  const radius = 38;

  return {
    left: `${50 + Math.cos(radians) * radius}%`,
    top: `${50 + Math.sin(radians) * radius}%`,
  };
}

export default function FeaturedGallery() {
  const centralProduct = featuredProducts[0];
  const orbitProducts = featuredProducts.slice(1);

  return (
    <section
      id="galeria"
      className="section-space relative scroll-mt-20 overflow-hidden border-y border-blush/35 bg-[linear-gradient(135deg,#FFF8F3_0%,#FFFDFC_52%,#F6F3FF_100%)]"
      aria-labelledby="featured-cakes-title"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-soft-grid opacity-35 [background-size:28px_28px]"
        aria-hidden="true"
      />
      <Heart
        className="pointer-events-none absolute left-[5%] top-14 hidden text-blush/65 sm:block"
        size={44}
        strokeWidth={1.4}
        aria-hidden="true"
      />
      <Sparkles
        className="pointer-events-none absolute right-[7%] top-16 text-gold/55"
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

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-10">
        <div className="mx-auto max-w-xl text-center lg:mx-0 lg:text-left">
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
            Una pequeña muestra de tortas personalizadas hechas para
            cumpleaños, fechas especiales y momentos que merecen algo único.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">
            <a
              href="#/catalogo"
              className="button-primary shrink-0 whitespace-nowrap"
            >
              Ver catálogo completo
              <ArrowRight size={18} aria-hidden="true" />
            </a>
            <a
              href={getWhatsAppUrl(whatsappMessage)}
              className="button-secondary shrink-0 whitespace-nowrap"
              target="_blank"
              rel="noreferrer"
            >
              <MessageCircle size={18} aria-hidden="true" />
              Pedir una torta personalizada
            </a>
          </div>
        </div>

        <div
          className="featured-orbit relative mx-auto aspect-square w-full max-w-[21rem] sm:max-w-[29rem] lg:max-w-[36rem]"
          role="group"
          aria-label="Galería circular de tortas destacadas"
        >
          <div
            className="pointer-events-none absolute inset-[5%] rounded-full border border-dashed border-plum/30"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute inset-[17%] rounded-full border border-blush/55"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute inset-[9%] rounded-full bg-white/20 shadow-[inset_0_0_55px_rgba(200,205,247,0.28)]"
            aria-hidden="true"
          />

          <div className="featured-orbit-track absolute inset-0">
            {orbitProducts.map((product, index) => (
              <article
                key={product.id}
                className="absolute -translate-x-1/2 -translate-y-1/2"
                style={getOrbitPosition(index, orbitProducts.length)}
              >
                <div className="featured-orbit-counter">
                  <a
                    href={`#/producto/${product.id}`}
                    className="group/item relative block h-[5.5rem] w-[5.5rem] rounded-full border-[5px] border-white bg-lavender-light shadow-soft transition-transform duration-300 hover:scale-105 focus-visible:scale-105 sm:h-28 sm:w-28 lg:h-32 lg:w-32"
                    aria-label={`Ver ${product.name}`}
                  >
                    <span className="block h-full w-full overflow-hidden rounded-full">
                      <img
                        src={product.image}
                        alt={`${product.name} de Bake Me Happy`}
                        className="h-full w-full object-cover"
                        style={{ objectPosition: product.imagePosition }}
                        loading="lazy"
                        decoding="async"
                        width="224"
                        height="224"
                      />
                    </span>
                    <span className="absolute bottom-0 left-1/2 max-w-[92%] -translate-x-1/2 translate-y-1/2 truncate rounded-full border border-blush/55 bg-white/95 px-2 py-1 text-[8px] font-semibold text-plum shadow-sm sm:px-2.5 sm:text-[9px] lg:text-[10px]">
                      {product.name}
                    </span>
                  </a>
                </div>
              </article>
            ))}
          </div>

          <article className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
            <a
              href={`#/producto/${centralProduct.id}`}
              className="group/central relative block h-32 w-32 rounded-[1.75rem] border-[7px] border-white bg-white shadow-lift transition-transform duration-300 hover:scale-[1.025] focus-visible:scale-[1.025] sm:h-44 sm:w-44 sm:rounded-[2rem] lg:h-52 lg:w-52"
              aria-label={`Ver ${centralProduct.name}, diseño destacado`}
            >
              <span className="block h-full w-full overflow-hidden rounded-[1.3rem] sm:rounded-[1.5rem]">
                <img
                  src={centralProduct.image}
                  alt={`${centralProduct.name}, torta destacada de Bake Me Happy`}
                  className="h-full w-full object-cover"
                  style={{ objectPosition: centralProduct.imagePosition }}
                  loading="lazy"
                  decoding="async"
                  width="416"
                  height="416"
                />
              </span>
              <span className="absolute -bottom-5 left-1/2 w-max max-w-[11rem] -translate-x-1/2 rounded-full border border-blush/60 bg-white px-3 py-1.5 text-center text-[10px] font-semibold text-ink shadow-soft sm:text-xs">
                {centralProduct.name}
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
        </div>
      </div>
    </section>
  );
}
