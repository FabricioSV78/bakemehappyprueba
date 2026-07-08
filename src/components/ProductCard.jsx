import { Eye } from "lucide-react";

export default function ProductCard({ product }) {
  const mainPrice = product.price ?? product.prices?.[0] ?? "Consultar";
  const showTwoTierTag =
    product.category === "Tortas tematicas" &&
    product.tags?.some((tag) => tag.toLowerCase() === "2 pisos");

  return (
    <article className="group flex h-full min-w-0 flex-col overflow-hidden rounded-lg border border-blush/45 bg-white shadow-sm">
      <div className="relative aspect-[5/4] overflow-hidden bg-blush/20">
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
          <span className="absolute left-2.5 top-2.5 max-w-[72%] truncate rounded-full bg-white/92 px-2.5 py-1 text-[10px] font-semibold text-plum shadow-sm">
            2 pisos
          </span>
        )}
        <a
          href={`#/producto/${product.id}`}
          className="absolute bottom-2.5 right-2.5 grid h-11 w-11 place-items-center rounded-full bg-white text-plum shadow-soft ring-4 ring-blush/45"
          aria-label={`Configurar ${product.name}`}
        >
          <Eye size={18} aria-hidden="true" />
        </a>
      </div>

      <div className="flex min-w-0 flex-1 flex-col bg-[linear-gradient(180deg,#FFFFFF_0%,#FFF9FC_100%)] p-3">
        <h3 className="min-w-0 font-display text-base leading-tight text-ink">
          {product.name}
        </h3>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-blush/35 pt-2.5">
          <span className="rounded-full bg-lavender-light px-2.5 py-1 text-[10px] font-semibold text-plum">
            {product.servings}
          </span>
          <span className="text-sm font-semibold text-plum">{mainPrice}</span>
        </div>
      </div>
    </article>
  );
}
