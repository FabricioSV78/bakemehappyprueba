import { Eye } from "lucide-react";
import { getProductPriceLabel } from "../utils/productPrice";

export default function ProductCard({ product }) {
  const mainPrice = getProductPriceLabel(product);
  const showTwoTierTag =
    product.category === "Tortas tematicas" &&
    product.tags?.some((tag) => tag.toLowerCase() === "2 pisos");

  return (
    <article className="flex h-full min-w-0 flex-col overflow-hidden rounded-lg border border-blush/35 bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-plum/30 hover:shadow-soft">
      <div className="relative aspect-[6/5] overflow-hidden bg-blush/30">
        <img
          src={product.image}
          alt={`${product.name} de Bake Me Happy`}
          className="h-full w-full object-cover"
          style={{ objectPosition: product.imagePosition }}
          loading="lazy"
          width="560"
          height="448"
        />
        {showTwoTierTag && (
          <span className="pointer-events-none absolute left-2.5 top-2.5 z-20 max-w-[72%] truncate rounded-full bg-white/92 px-2.5 py-1 text-[10px] font-semibold text-plum shadow-sm">
            2 pisos
          </span>
        )}
        <a
          href={`#/producto/${product.id}`}
          className="absolute bottom-2.5 right-2.5 z-10 grid h-11 w-11 place-items-center rounded-full border border-blush/30 bg-white/95 text-plum shadow-sm transition-colors duration-200 hover:border-plum/30 hover:bg-white"
          aria-label={`Configurar ${product.name}`}
        >
          <Eye size={18} aria-hidden="true" />
        </a>
      </div>

      <div className="flex min-w-0 flex-col items-center bg-[linear-gradient(180deg,#FFFFFF_0%,#FFF0F5_100%)] px-4 py-3.5 text-center">
        <h3 className="min-w-0 font-display text-lg leading-tight text-ink">
          {product.name}
        </h3>
        <div className="mt-3 flex w-full justify-center border-t border-blush/25 pt-2.5">
          <span className="inline-flex min-h-8 items-center rounded-full border border-lavender/30 bg-lavender-light px-3.5 text-sm font-semibold text-plum">
            {mainPrice}
          </span>
        </div>
      </div>
    </article>
  );
}
