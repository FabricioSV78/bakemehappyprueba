import { Eye } from "lucide-react";

function getCurrencyAmount(value) {
  if (!value || !value.toLowerCase().includes("s/")) return null;

  const [, rawAmount] = value.match(/s\/\s*([\d.,]+)/i) ?? [];
  const amount = Number(rawAmount?.replace(",", "."));
  return Number.isFinite(amount) ? amount : null;
}

function formatSoles(amount) {
  return `S/ ${new Intl.NumberFormat("es-PE").format(amount)}`;
}

function getProductPriceLabel(product) {
  const numericPrices = (product.prices ?? [])
    .map((price) => getCurrencyAmount(price))
    .filter((price) => price !== null);
  const variablePrice = (product.prices?.length ?? 0) > 1;

  if (numericPrices.length) {
    const minimumPrice = Math.min(...numericPrices);
    return variablePrice
      ? `Desde ${formatSoles(minimumPrice)}`
      : formatSoles(minimumPrice);
  }

  if (product.price) {
    const price = getCurrencyAmount(product.price);
    if (price !== null && product.price.toLowerCase().includes("desde")) {
      return `Desde ${formatSoles(price)}`;
    }

    return product.price;
  }

  return "Consultar";
}

export default function ProductCard({ product }) {
  const mainPrice = getProductPriceLabel(product);
  const showTwoTierTag =
    product.category === "Tortas tematicas" &&
    product.tags?.some((tag) => tag.toLowerCase() === "2 pisos");

  return (
    <article className="group flex h-full min-w-0 flex-col overflow-hidden rounded-lg border border-blush/45 bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-plum/25 hover:shadow-soft">
      <div className="relative aspect-[6/5] overflow-hidden bg-blush/20">
        <img
          src={product.image}
          alt={`${product.name} de Bake Me Happy`}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
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

      <div className="flex min-w-0 flex-col items-center bg-[linear-gradient(180deg,#FFFFFF_0%,#FFF9FC_100%)] px-4 py-3.5 text-center">
        <h3 className="min-w-0 font-display text-lg leading-tight text-ink">
          {product.name}
        </h3>
        <div className="mt-3 flex w-full justify-center border-t border-blush/35 pt-2.5">
          <span className="inline-flex min-h-8 items-center rounded-full bg-lavender-light px-3.5 text-sm font-semibold text-plum">
            {mainPrice}
          </span>
        </div>
      </div>
    </article>
  );
}
