import { ChevronDown, Minus, Plus } from "lucide-react";
import { getProductPriceLabel } from "../../utils/productPrice";
import AssetImage from "../AssetImage";

function ComplementItems({ options, selectedItems, onQuantityChange }) {
  return (
    <div className="mt-2 divide-y divide-blush/25 sm:mt-4 sm:grid sm:gap-3 sm:divide-y-0">
      {options.map((option) => {
        const quantity = selectedItems[option.id] ?? 0;
        const isSelected = quantity > 0;

        return (
          <div
            key={option.id}
            className={`grid gap-3 px-1 py-3 min-[430px]:grid-cols-[minmax(0,1fr)_auto] min-[430px]:items-center sm:rounded-lg sm:border sm:px-3 sm:transition-colors ${
              isSelected
                ? "sm:border-plum/40 sm:bg-blush/15"
                : "sm:border-blush/30 sm:bg-white"
            }`}
          >
            <div className="flex min-w-0 items-center gap-3">
              <div
                className={`h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-cream ring-1 sm:h-16 sm:w-16 ${
                  isSelected ? "ring-plum/40" : "ring-blush/25"
                }`}
              >
                <AssetImage
                  src={option.image}
                  alt={option.name}
                  className="h-full w-full object-cover"
                  style={{ objectPosition: option.imagePosition ?? "center" }}
                  loading="lazy"
                  decoding="async"
                  width="96"
                  height="96"
                />
              </div>
              <div className="min-w-0">
                <p
                  className={`text-sm font-semibold ${
                    isSelected ? "text-plum" : "text-ink"
                  }`}
                >
                  {option.name}
                </p>
                <p className="mt-0.5 text-sm text-ink/58">
                  {getProductPriceLabel(option)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 justify-self-start min-[430px]:justify-self-end">
              <button
                type="button"
                onClick={() => onQuantityChange(option.id, quantity - 1)}
                disabled={!isSelected}
                aria-label={`Restar ${option.name}`}
                className="grid h-9 w-9 place-items-center rounded-full border border-blush/30 bg-white text-ink transition-colors hover:border-plum/30 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Minus size={15} aria-hidden="true" />
              </button>
              <span className="min-w-7 text-center text-sm font-semibold text-ink">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => onQuantityChange(option.id, quantity + 1)}
                aria-label={`Agregar ${option.name}`}
                className="grid h-9 w-9 place-items-center rounded-full border border-blush/30 bg-white text-ink transition-colors hover:border-plum/30"
              >
                <Plus size={15} aria-hidden="true" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function ComplementAddOns({
  options,
  selectedItems,
  onQuantityChange,
  variant = "mobile",
}) {
  if (!options.length) return null;

  const selectedCount = Object.values(selectedItems).reduce(
    (total, quantity) => total + quantity,
    0,
  );

  if (variant === "desktop") {
    return (
      <section
        data-complements-desktop="true"
        className="mt-6 hidden rounded-lg border border-blush/30 bg-white/90 p-4 shadow-sm lg:block"
      >
        <h2 className="text-base font-semibold text-ink">Complementos</h2>
        <p className="text-sm leading-6 text-ink/58">
          Agrega una opción dulce adicional a tu pedido.
        </p>
        <ComplementItems
          options={options}
          selectedItems={selectedItems}
          onQuantityChange={onQuantityChange}
        />
      </section>
    );
  }

  return (
    <details
      data-complements-mobile="true"
      className="group mt-5 border-t border-blush/30 pt-4 lg:hidden"
    >
        <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 rounded-lg bg-white/70 px-3 py-2.5 outline-none transition-colors hover:bg-white focus-visible:ring-2 focus-visible:ring-plum/35 [&::-webkit-details-marker]:hidden">
          <span className="min-w-0">
            <span className="block text-sm font-semibold text-ink">
              Complementos opcionales
            </span>
            <span className="mt-0.5 block text-xs leading-5 text-ink/58">
              {selectedCount > 0
                ? `${selectedCount} ${
                    selectedCount === 1
                      ? "complemento agregado"
                      : "complementos agregados"
                  }`
                : "Opciones dulces para completar tu pedido"}
            </span>
          </span>
          <span className="flex shrink-0 items-center gap-2">
            <span className="hidden rounded-full bg-lavender-light px-2.5 py-1 text-xs font-semibold text-plum min-[430px]:inline-flex">
              {selectedCount > 0
                ? `${selectedCount} ${
                    selectedCount === 1 ? "agregado" : "agregados"
                  }`
                : "Opcional"}
            </span>
            <ChevronDown
              size={18}
              className="text-plum transition-transform duration-200 group-open:rotate-180"
              aria-hidden="true"
            />
          </span>
        </summary>
        <ComplementItems
          options={options}
          selectedItems={selectedItems}
          onQuantityChange={onQuantityChange}
        />
    </details>
  );
}
