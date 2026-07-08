import { useEffect, useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Ruler,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { categories, occasionOptions, products } from "../data/products";
import ProductCard from "./ProductCard";
import SizeGuideModal from "./SizeGuideModal";

const PRODUCTS_PER_PAGE = 12;
const ALL_CATEGORIES = ["Todos", ...categories];
const catalogProducts = products.filter((product) =>
  categories.includes(product.category),
);
const PRICE_STEP = 5;
const DEFAULT_PRICE_MIN = 5;
const DEFAULT_PRICE_MAX = 250;
const DEFAULT_OCCASION = "Todas";
const ALL_OCCASIONS = [DEFAULT_OCCASION, ...occasionOptions];
const storeContainerClass = "mx-auto w-full max-w-[1660px] px-5 sm:px-8 2xl:px-12";

const filterSectionLabelClass =
  "text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-ink/60";

function FilterSection({ label, children, className = "" }) {
  return (
    <section className={`border-t border-blush/35 pt-6 ${className}`}>
      <h4 className={filterSectionLabelClass}>{label}</h4>
      <div className="mt-4">{children}</div>
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
  const prices = catalogProducts
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

function matchesOccasion(product, occasionLabel) {
  if (occasionLabel === DEFAULT_OCCASION) return true;
  return (product.occasions ?? []).some(
    (occasion) => normalizeText(occasion) === normalizeText(occasionLabel),
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
      <fieldset className="rounded-[1.6rem] border border-blush/55 bg-white/85 p-5">
        <div className="relative h-9 px-1">
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

        <div className="mt-4 flex items-center justify-between gap-4">
          <output className="min-w-24 rounded-2xl bg-cream px-4 py-2.5 text-center text-sm font-semibold tabular-nums text-ink shadow-sm">
            {formatPrice(value.min)}
          </output>
          <output className="min-w-24 rounded-2xl bg-cream px-4 py-2.5 text-center text-sm font-semibold tabular-nums text-ink shadow-sm">
            {formatPrice(value.max)}
          </output>
        </div>
      </fieldset>
    </FilterSection>
  );
}

function CategoryTabs({ value, onChange }) {
  return (
    <div className="grid gap-2.5 sm:grid-cols-3 lg:grid-cols-1">
      {ALL_CATEGORIES.map((category) => (
        <button
          key={category}
          type="button"
          className={`flex min-h-[3.25rem] w-full items-center justify-between rounded-full px-5 text-left text-sm font-semibold transition-colors ${
            value === category
              ? "bg-plum text-white shadow-sm"
              : "border border-blush/60 bg-white text-ink/68 hover:border-plum/45 hover:text-plum"
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

function OccasionSelect({ value, onChange }) {
  return (
    <FilterSection label="Ocasión">
      <div className="relative">
        <select
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="min-h-[3.25rem] w-full appearance-none rounded-full border border-blush/60 bg-white px-5 pr-12 text-sm font-semibold text-ink outline-none transition-colors focus:border-plum"
        >
          {ALL_OCCASIONS.map((occasion) => (
            <option key={occasion} value={occasion}>
              {occasion === DEFAULT_OCCASION ? "Todas las ocasiones" : occasion}
            </option>
          ))}
        </select>
        <span
          className="pointer-events-none absolute right-5 top-1/2 h-2.5 w-2.5 -translate-y-[60%] rotate-45 border-b-2 border-r-2 border-plum/70"
          aria-hidden="true"
        />
      </div>
    </FilterSection>
  );
}

function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  return (
    <nav
      aria-label="Paginacion de la tienda"
      className="mt-10 flex flex-wrap items-center justify-center gap-2"
    >
      <button
        type="button"
        className="grid h-11 w-11 place-items-center rounded-full border border-blush/60 bg-white text-ink shadow-sm disabled:cursor-not-allowed disabled:opacity-40"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Pagina anterior"
      >
        <ChevronLeft size={18} aria-hidden="true" />
      </button>

      {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
        <button
          key={page}
          type="button"
          className={`h-11 min-w-11 rounded-full px-4 text-sm font-semibold shadow-sm ${
            currentPage === page
              ? "bg-plum text-white"
              : "border border-blush/60 bg-white text-ink/70"
          }`}
          onClick={() => onPageChange(page)}
          aria-current={currentPage === page ? "page" : undefined}
        >
          {page}
        </button>
      ))}

      <button
        type="button"
        className="grid h-11 w-11 place-items-center rounded-full border border-blush/60 bg-white text-ink shadow-sm disabled:cursor-not-allowed disabled:opacity-40"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Pagina siguiente"
      >
        <ChevronRight size={18} aria-hidden="true" />
      </button>
    </nav>
  );
}

export default function Catalog() {
  const priceBounds = useMemo(() => getCatalogPriceBounds(), []);
  const [activeCategory, setActiveCategory] = useState(ALL_CATEGORIES[0]);
  const [priceRange, setPriceRange] = useState(priceBounds);
  const [occasion, setOccasion] = useState(DEFAULT_OCCASION);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(shouldOpenSizeGuideFromHash);

  const filteredProducts = useMemo(() => {
    const query = normalizeText(searchTerm.trim());

    const productMatches = catalogProducts.filter((product) => {
      const matchesCategory =
        activeCategory === "Todos" || product.category === activeCategory;
      const matchesQuery =
        !query || normalizeText(product.name).includes(query);

      return (
        matchesCategory &&
        matchesQuery &&
        matchesPrice(product, priceRange, priceBounds) &&
        matchesOccasion(product, occasion)
      );
    });

    return productMatches;
  }, [activeCategory, occasion, priceBounds, priceRange, searchTerm]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE),
  );
  const pageStart = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const visibleProducts = filteredProducts.slice(
    pageStart,
    pageStart + PRODUCTS_PER_PAGE,
  );
  const firstVisibleProduct = filteredProducts.length ? pageStart + 1 : 0;
  const lastVisibleProduct = Math.min(
    pageStart + visibleProducts.length,
    filteredProducts.length,
  );
  const hasActiveFilters =
    activeCategory !== "Todos" ||
    priceRange.min !== priceBounds.min ||
    priceRange.max !== priceBounds.max ||
    occasion !== DEFAULT_OCCASION ||
    searchTerm.trim();

  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory, occasion, priceRange, searchTerm]);

  useEffect(() => {
    setCurrentPage((page) => Math.min(page, totalPages));
  }, [totalPages]);

  const clearFilters = () => {
    setActiveCategory("Todos");
    setPriceRange(priceBounds);
    setOccasion(DEFAULT_OCCASION);
    setSearchTerm("");
  };

  return (
    <section
      id="tienda"
      className="scroll-mt-20 bg-cream pb-20 pt-20 sm:pb-28 lg:pt-28"
    >
      <div className="border-b border-blush/45 bg-[linear-gradient(135deg,#FFF8F3_0%,#FFEAF1_48%,#F1F2FF_100%)]">
        <div className={`${storeContainerClass} grid gap-8 py-12 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end`}>
          <div className="max-w-3xl">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-plum">
              Tienda Bake Me Happy
            </span>
            <h2 className="mt-3 max-w-[14ch] break-words font-display text-4xl leading-tight text-ink sm:max-w-full sm:text-5xl">
              Tortas y postres artesanales
            </h2>
            <p className="mt-4 max-w-[36ch] break-words text-base leading-7 text-ink/70 sm:max-w-2xl">
              Tortas clasicas, tortas tematicas, bocaditos tematicos y
              complementos pensados para armar celebraciones mas bonitas y
              personalizadas.
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

      <div className={storeContainerClass}>
        <div className="mt-8 grid gap-7 lg:grid-cols-[310px_minmax(0,1fr)] xl:grid-cols-[320px_minmax(0,1fr)] lg:items-start">
          <aside className="rounded-[1.75rem] border border-blush/45 bg-white/88 p-6 shadow-sm lg:sticky lg:top-24">
            <div className="flex items-center gap-3.5">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-blush/45 text-plum">
                <SlidersHorizontal size={18} aria-hidden="true" />
              </span>
              <div>
                <h3 className="font-semibold text-ink">Filtros</h3>
                <p className="mt-0.5 text-sm text-ink/55 tabular-nums">
                  {filteredProducts.length} productos
                </p>
              </div>
            </div>

            <div className="mt-6">
              <section className="pb-1">
                <h4 className={filterSectionLabelClass}>Buscar</h4>
                <label className="relative mt-4 block">
                  <Search
                    size={18}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-plum"
                    aria-hidden="true"
                  />
                  <input
                    type="search"
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder="Buscar por nombre"
                    className="min-h-[3.25rem] w-full rounded-full border border-lavender/45 bg-white px-11 py-3 text-sm font-medium text-ink outline-none transition-colors placeholder:text-ink/40 focus:border-plum"
                  />
                  {searchTerm && (
                    <button
                      type="button"
                      className="absolute right-2.5 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full text-ink/55 hover:bg-lavender-light"
                      onClick={() => setSearchTerm("")}
                      aria-label="Limpiar búsqueda"
                    >
                      <X size={16} aria-hidden="true" />
                    </button>
                  )}
                </label>
              </section>

              <FilterSection label="Categoría">
                <CategoryTabs value={activeCategory} onChange={setActiveCategory} />
              </FilterSection>

              <PriceRangeFilter
                value={priceRange}
                bounds={priceBounds}
                onChange={setPriceRange}
              />

              <OccasionSelect value={occasion} onChange={setOccasion} />

              {hasActiveFilters && (
                <button
                  type="button"
                  className="mt-6 min-h-[3.25rem] w-full rounded-full border border-lavender/45 bg-lavender-light px-5 text-sm font-semibold text-ink"
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
                <span className="font-semibold text-ink">
                  {firstVisibleProduct}-{lastVisibleProduct}
                </span>{" "}
                de{" "}
                <span className="font-semibold text-ink">{filteredProducts.length}</span>
              </p>
              <p className="font-semibold text-plum">
                {activeCategory === "Todos" ? "Todos los productos" : activeCategory}
                {occasion !== DEFAULT_OCCASION ? ` · ${occasion}` : ""}
              </p>
            </div>

            {visibleProducts.length > 0 ? (
              <div className="mt-5 grid min-w-0 grid-cols-[minmax(0,1fr)] gap-6 sm:grid-cols-2 xl:grid-cols-3 min-[1800px]:grid-cols-4">
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
                  Prueba con otro filtro o vuelve a ver toda la tienda.
                </p>
                <button type="button" className="button-primary mt-6" onClick={clearFilters}>
                  Ver toda la tienda
                </button>
              </div>
            )}

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />

         
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
