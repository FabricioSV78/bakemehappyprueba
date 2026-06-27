import { useEffect, useMemo, useState } from "react";
import { Ruler, Search, SlidersHorizontal, X } from "lucide-react";
import { categories, products } from "../data/products";
import ProductCard from "./ProductCard";
import SizeGuideModal from "./SizeGuideModal";

const INITIAL_VISIBLE_PRODUCTS = 12;
const VISIBLE_INCREMENT = 8;
const ALL_CATEGORIES = ["Todos", ...categories];
const PRICE_STEP = 5;
const DEFAULT_PRICE_MIN = 5;
const DEFAULT_PRICE_MAX = 250;

const portionRanges = [
  { label: "Todas las porciones", test: () => true },
  {
    label: "Individual y mini",
    test: (product) => /1 a 2|6 a 7|mini|individual/i.test(product.servings),
  },
  {
    label: "22 cm / 15 - 20 porciones",
    test: (product) => /22 cm|15|20/i.test(product.servings),
  },
  {
    label: "28 cm / 25+ porciones",
    test: (product) => /28 cm|25|30|40|45|60|65/i.test(product.servings),
  },
];

const flavorOptions = [
  "Todos los sabores",
  "Vainilla",
  "Chocolate",
  "Red velvet",
  "Zanahoria",
];

const occasionOptions = [
  "Todas las ocasiones",
  "Cumpleaños",
  "Regalo",
  "Mesa dulce",
  "Eventos",
  "Mamá",
  "Buttercream",
];

const sortOptions = [
  "Recomendados",
  "Menor precio",
  "Mayor precio",
  "Más porciones",
];

const filterSectionLabelClass =
  "text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-ink/60";

function FilterSection({ label, children, className = "" }) {
  return (
    <section className={`border-t border-blush/35 pt-5 ${className}`}>
      <h4 className={filterSectionLabelClass}>{label}</h4>
      <div className="mt-3">{children}</div>
    </section>
  );
}

function shouldOpenSizeGuideFromHash() {
  if (typeof window === "undefined") return false;
  return window.location.hash.includes("guia-tamanos");
}

function normalizeText(value) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function getProductPrice(product) {
  const source = product.price ?? product.prices?.join(" ") ?? "";
  const match = source.match(/S\/\s*(\d+)/i);
  return match ? Number(match[1]) : null;
}

function getCatalogPriceBounds() {
  const prices = products
    .map((product) => getProductPrice(product))
    .filter((price) => price !== null);
  const minPrice = Math.min(...prices, DEFAULT_PRICE_MIN);
  const maxPrice = Math.max(...prices, DEFAULT_PRICE_MAX);

  return {
    min: Math.max(
      DEFAULT_PRICE_MIN,
      Math.floor(minPrice / PRICE_STEP) * PRICE_STEP,
    ),
    max: Math.ceil(maxPrice / PRICE_STEP) * PRICE_STEP,
  };
}

function getProductPortionScore(product) {
  const matches = product.servings.match(/\d+/g);
  return matches ? Math.max(...matches.map(Number)) : 0;
}

function formatPrice(value) {
  return `S/${new Intl.NumberFormat("es-PE").format(value)}`;
}

function matchesPrice(product, priceRange, priceBounds) {
  const price = getProductPrice(product);

  if (price === null) {
    return priceRange.min === priceBounds.min && priceRange.max === priceBounds.max;
  }

  return price >= priceRange.min && price <= priceRange.max;
}

function matchesPortion(product, portionLabel) {
  const range = portionRanges.find((item) => item.label === portionLabel);
  return range ? range.test(product) : true;
}

function matchesFlavor(product, flavorLabel) {
  if (flavorLabel === flavorOptions[0]) return true;

  return normalizeText((product.flavors ?? []).join(" ")).includes(
    normalizeText(flavorLabel),
  );
}

function matchesOccasion(product, occasionLabel) {
  if (occasionLabel === occasionOptions[0]) return true;
  return (product.tags ?? []).some(
    (tag) => normalizeText(tag) === normalizeText(occasionLabel),
  );
}

function sortProducts(productList, sortBy) {
  return [...productList].sort((first, second) => {
    const firstPrice = getProductPrice(first);
    const secondPrice = getProductPrice(second);

    if (sortBy === "Menor precio") {
      return (firstPrice ?? Infinity) - (secondPrice ?? Infinity);
    }

    if (sortBy === "Mayor precio") {
      return (secondPrice ?? -1) - (firstPrice ?? -1);
    }

    if (sortBy === "Más porciones") {
      return getProductPortionScore(second) - getProductPortionScore(first);
    }

    return 0;
  });
}

function FilterSelect({ label, value, options, onChange }) {
  return (
    <label className="block">
      <span className={filterSectionLabelClass}>
        {label}
      </span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-3 min-h-11 w-full rounded-full border border-blush/60 bg-white px-4 text-sm font-semibold text-ink outline-none transition-colors focus:border-plum"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function PriceRangeFilter({ value, bounds, onChange }) {
  const rangeSize = Math.max(bounds.max - bounds.min, PRICE_STEP);
  const left = ((value.min - bounds.min) / rangeSize) * 100;
  const right = 100 - ((value.max - bounds.min) / rangeSize) * 100;

  const handleMinChange = (event) => {
    const nextMin = Math.min(Number(event.target.value), value.max - PRICE_STEP);
    onChange({ ...value, min: nextMin });
  };

  const handleMaxChange = (event) => {
    const nextMax = Math.max(Number(event.target.value), value.min + PRICE_STEP);
    onChange({ ...value, max: nextMax });
  };

  return (
    <FilterSection label="Precio">
      <fieldset className="rounded-2xl border border-blush/55 bg-white/80 p-4 sm:p-5">
        <div className="relative h-8">
          <div className="absolute left-0 right-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-[#BFE5DF]" />
          <div
            className="absolute top-1/2 h-1 -translate-y-1/2 rounded-full bg-plum/45"
            style={{ left: `${left}%`, right: `${right}%` }}
          />
          <input
            type="range"
            min={bounds.min}
            max={bounds.max}
            step={PRICE_STEP}
            value={value.min}
            onChange={handleMinChange}
            className="price-range price-range-min"
            aria-label="Precio mínimo"
          />
          <input
            type="range"
            min={bounds.min}
            max={bounds.max}
            step={PRICE_STEP}
            value={value.max}
            onChange={handleMaxChange}
            className="price-range price-range-max"
            aria-label="Precio máximo"
          />
        </div>

        <div className="mt-3 flex items-center justify-between gap-4">
          <output className="min-w-20 rounded-xl bg-cream px-4 py-2 text-center text-sm font-semibold tabular-nums text-ink shadow-sm">
            {formatPrice(value.min)}
          </output>
          <output className="min-w-20 rounded-xl bg-cream px-4 py-2 text-center text-sm font-semibold tabular-nums text-ink shadow-sm">
            {formatPrice(value.max)}
          </output>
        </div>
      </fieldset>
    </FilterSection>
  );
}

function CategoryTabs({ value, onChange }) {
  return (
    <div className="grid gap-2 sm:grid-cols-3 lg:grid-cols-1">
      {ALL_CATEGORIES.map((category) => (
        <button
          key={category}
          type="button"
          className={`flex min-h-11 w-full items-center justify-between rounded-full px-4 text-left text-sm font-semibold ${
            value === category
              ? "bg-plum text-white shadow-sm"
              : "border border-blush/60 bg-white text-ink/68"
          }`}
          onClick={() => onChange(category)}
          aria-pressed={value === category}
        >
          {category}
        </button>
      ))}
    </div>
  );
}

export default function Catalog() {
  const priceBounds = useMemo(() => getCatalogPriceBounds(), []);
  const [activeCategory, setActiveCategory] = useState(ALL_CATEGORIES[0]);
  const [priceRange, setPriceRange] = useState(priceBounds);
  const [portionRange, setPortionRange] = useState(portionRanges[0].label);
  const [flavor, setFlavor] = useState(flavorOptions[0]);
  const [occasion, setOccasion] = useState(occasionOptions[0]);
  const [sortBy, setSortBy] = useState(sortOptions[0]);
  const [searchTerm, setSearchTerm] = useState("");
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_PRODUCTS);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(shouldOpenSizeGuideFromHash);

  const filteredProducts = useMemo(() => {
    const query = normalizeText(searchTerm.trim());

    const productMatches = products.filter((product) => {
      const matchesCategory =
        activeCategory === "Todos" || product.category === activeCategory;
      const searchableText = normalizeText(
        [
          product.name,
          product.category,
          product.servings,
          (product.tags ?? []).join(" "),
          (product.flavors ?? []).join(" "),
        ].join(" "),
      );
      const matchesQuery = !query || searchableText.includes(query);

      return (
        matchesCategory &&
        matchesQuery &&
        matchesPrice(product, priceRange, priceBounds) &&
        matchesPortion(product, portionRange) &&
        matchesFlavor(product, flavor) &&
        matchesOccasion(product, occasion)
      );
    });

    return sortProducts(productMatches, sortBy);
  }, [
    activeCategory,
    flavor,
    occasion,
    portionRange,
    priceBounds,
    priceRange,
    searchTerm,
    sortBy,
  ]);

  const visibleProducts = filteredProducts.slice(0, visibleCount);
  const hasMoreProducts = visibleCount < filteredProducts.length;
  const hasActiveFilters =
    activeCategory !== "Todos" ||
    priceRange.min !== priceBounds.min ||
    priceRange.max !== priceBounds.max ||
    portionRange !== portionRanges[0].label ||
    flavor !== flavorOptions[0] ||
    occasion !== occasionOptions[0] ||
    sortBy !== sortOptions[0] ||
    searchTerm.trim();

  useEffect(() => {
    setVisibleCount(INITIAL_VISIBLE_PRODUCTS);
  }, [activeCategory, flavor, occasion, portionRange, priceRange, searchTerm, sortBy]);

  const clearFilters = () => {
    setActiveCategory("Todos");
    setPriceRange(priceBounds);
    setPortionRange(portionRanges[0].label);
    setFlavor(flavorOptions[0]);
    setOccasion(occasionOptions[0]);
    setSortBy(sortOptions[0]);
    setSearchTerm("");
  };

  return (
    <section id="catalogo" className="scroll-mt-20 bg-cream pb-20 pt-28 sm:pb-28">
      <div className="border-y border-blush/45 bg-[linear-gradient(135deg,#FFF8F3_0%,#FFEAF1_48%,#F1F2FF_100%)]">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-12 sm:px-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <div className="max-w-3xl">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-plum">
              Catálogo Bake Me Happy
            </span>
            <h2 className="mt-3 max-w-[14ch] break-words font-display text-4xl leading-tight text-ink sm:max-w-full sm:text-5xl">
              Tortas y postres artesanales
            </h2>
            <p className="mt-4 max-w-[36ch] break-words text-base leading-7 text-ink/70 sm:max-w-2xl">
              Tortas clásicas, tortas personalizadas y mini tortas preparadas
              a pedido con una estética dulce, cuidada y personalizable.
            </p>
          </div>

          <button
            type="button"
            className="inline-flex min-h-11 w-fit items-center justify-center gap-2 rounded-full border border-plum/20 bg-white px-5 text-sm font-semibold text-ink shadow-sm"
            onClick={() => setIsSizeGuideOpen(true)}
          >
            <Ruler size={17} aria-hidden="true" />
            Guía de tamaños
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="mt-8 grid gap-7 lg:grid-cols-[310px_minmax(0,1fr)] lg:items-start">
          <aside className="rounded-lg border border-blush/45 bg-white/88 p-5 shadow-sm lg:sticky lg:top-24">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-blush/45 text-plum">
                <SlidersHorizontal size={18} aria-hidden="true" />
              </span>
              <div>
                <h3 className="font-semibold text-ink">Filtros</h3>
                <p className="text-sm text-ink/55 tabular-nums">
                  {filteredProducts.length} productos
                </p>
              </div>
            </div>

            <div className="mt-5">
              <section>
                <h4 className={filterSectionLabelClass}>Buscar</h4>
                <label className="relative mt-3 block">
                  <Search
                    size={18}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-plum"
                    aria-hidden="true"
                  />
                  <input
                    type="search"
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder="Buscar producto, sabor u ocasión"
                    className="min-h-11 w-full rounded-full border border-lavender/45 bg-white px-11 py-2.5 text-sm font-medium text-ink outline-none transition-colors placeholder:text-ink/40 focus:border-plum"
                  />
                  {searchTerm && (
                    <button
                      type="button"
                      className="absolute right-2 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full text-ink/55 hover:bg-lavender-light"
                      onClick={() => setSearchTerm("")}
                      aria-label="Limpiar búsqueda"
                    >
                      <X size={16} aria-hidden="true" />
                    </button>
                  )}
                </label>
              </section>

              <FilterSection label="Categoría" className="mt-5">
                <CategoryTabs value={activeCategory} onChange={setActiveCategory} />
              </FilterSection>

              <PriceRangeFilter
                value={priceRange}
                bounds={priceBounds}
                onChange={setPriceRange}
              />

              <div className="mt-5 grid gap-5 border-t border-blush/35 pt-5">
                <FilterSelect
                  label="Tamaño o porciones"
                  value={portionRange}
                  options={portionRanges.map((range) => range.label)}
                  onChange={setPortionRange}
                />
                <FilterSelect
                  label="Sabor"
                  value={flavor}
                  options={flavorOptions}
                  onChange={setFlavor}
                />
                <FilterSelect
                  label="Ocasión"
                  value={occasion}
                  options={occasionOptions}
                  onChange={setOccasion}
                />
                <FilterSelect
                  label="Ordenar por"
                  value={sortBy}
                  options={sortOptions}
                  onChange={setSortBy}
                />
              </div>

              {hasActiveFilters && (
                <button
                  type="button"
                  className="min-h-11 w-full rounded-full border border-lavender/45 bg-lavender-light px-4 text-sm font-semibold text-ink"
                  onClick={clearFilters}
                >
                  Limpiar filtros
                </button>
              )}
            </div>
          </aside>

          <div className="min-w-0">
            <div className="flex flex-col gap-2 border-b border-blush/35 pb-4 text-sm text-ink/62 sm:flex-row sm:items-center sm:justify-between">
              <p>
                Mostrando{" "}
                <span className="font-semibold text-ink">{visibleProducts.length}</span>{" "}
                de{" "}
                <span className="font-semibold text-ink">{filteredProducts.length}</span>
              </p>
              <p className="font-semibold text-plum">
                {activeCategory === "Todos" ? "Todos los productos" : activeCategory}
              </p>
            </div>

            {visibleProducts.length > 0 ? (
              <div className="mt-5 grid min-w-0 grid-cols-[minmax(0,1fr)] gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {visibleProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="mt-8 rounded-lg border border-dashed border-plum/35 bg-white/75 p-10 text-center">
                <h3 className="font-display text-3xl text-ink">
                  No encontramos productos
                </h3>
                <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-ink/65">
                  Prueba con otro filtro o vuelve a ver todo el catálogo.
                </p>
                <button type="button" className="button-primary mt-6" onClick={clearFilters}>
                  Ver todo el catálogo
                </button>
              </div>
            )}

            {hasMoreProducts && (
              <div className="mt-10 flex justify-center">
                <button
                  type="button"
                  className="button-secondary bg-white"
                  onClick={() =>
                    setVisibleCount((current) => current + VISIBLE_INCREMENT)
                  }
                >
                  Ver más productos
                </button>
              </div>
            )}

            <p className="mx-auto mt-8 max-w-2xl text-center text-sm leading-6 text-ink/55">
              Los precios son referenciales y pueden variar según diseño, relleno,
              acabados y nivel de personalización.
            </p>
          </div>
        </div>
      </div>

      <SizeGuideModal
        isOpen={isSizeGuideOpen}
        onClose={() => setIsSizeGuideOpen(false)}
      />
    </section>
  );
}
