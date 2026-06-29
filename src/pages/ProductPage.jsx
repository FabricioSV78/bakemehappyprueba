import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  CakeSlice,
  Check,
  Heart,
  MessageCircle,
  Palette,
  Plus,
  Ruler,
  Truck,
} from "lucide-react";
import { getWhatsAppUrl } from "../data/site";
import { cakeFlavors, fillingFlavors, products, sizeGuide } from "../data/products";
import SizeGuideModal from "../components/SizeGuideModal";

function getProductId(path) {
  return Number(path.replace("/producto/", ""));
}

function getOptionValue(option) {
  return option?.label ?? option ?? "";
}

function getOptionSurcharge(options, selectedValue) {
  const selectedOption = options.find(
    (option) => getOptionValue(option) === selectedValue,
  );

  return selectedOption?.surcharge ?? 0;
}

function getCurrencyAmount(value) {
  if (!value || !value.toLowerCase().includes("s/")) return null;

  const amount = Number(value.replace(/[^\d.]/g, ""));
  return Number.isFinite(amount) ? amount : null;
}

function formatSoles(amount) {
  return `S/ ${amount}`;
}

function formatQuantityLabel(quantity) {
  return `${quantity} ${quantity === 1 ? "unidad" : "unidades"}`;
}

function getPriceOptions(product) {
  if (product?.prices?.length) {
    return product.prices.map((price) => {
      const [label, value] = price.split(":");
      return {
        label: label?.trim() || price,
        value: value?.trim() || "Consultar",
      };
    });
  }

  return [
    {
      label: product?.servings ?? "Según pedido",
      value: product?.price ?? "Consultar",
    },
  ];
}

function getSizeOptions(product) {
  if (product?.name.toLowerCase().includes("two")) {
    return sizeGuide.twoTiers.map((size) => ({
      label: size.name,
      value: size.portions,
      helper: size.dimensions,
    }));
  }

  if (product?.name.toLowerCase().includes("heart")) {
    return sizeGuide.special
      .filter((size) => size.name.toLowerCase().includes("corazón") || size.name.toLowerCase().includes("corazon"))
      .map((size) => ({
        label: size.name,
        value: size.portions,
        helper: size.dimensions,
      }));
  }

  const prices = getPriceOptions(product);
  return prices.map((size) => ({
    label: size.label,
    value: size.value,
    helper: "Precio referencial",
  }));
}

function OptionGroup({
  title,
  description,
  icon: Icon,
  options,
  value,
  onChange,
  name,
}) {
  const headingId = `${name}-group-title`;

  return (
    <section
      aria-labelledby={headingId}
      className="overflow-hidden rounded-lg border border-blush/45 bg-white shadow-sm"
    >
      <div className="flex items-center gap-3 px-5 py-4">
        <span className="grid h-10 w-10 place-items-center rounded-full bg-blush/45 text-plum">
          <Icon size={19} aria-hidden="true" />
        </span>
        <div>
          <h2 id={headingId} className="text-sm font-semibold text-ink">
            {title}
          </h2>
          {description && (
            <p className="mt-1 text-xs leading-5 text-ink/55">{description}</p>
          )}
        </div>
      </div>

      <div className="border-t border-blush/25 px-5 pb-5 pt-4">
        <div className="grid gap-3 sm:grid-cols-2">
        {options.map((option) => {
          const optionValue = getOptionValue(option);
          const isSelected = value === optionValue;
          const hasPricingInformation =
            typeof option === "object" && "surcharge" in option;

          return (
            <label
              key={optionValue}
              className={`flex min-h-[4.75rem] cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors duration-200 ${
                isSelected
                  ? "border-plum bg-lavender-light text-ink"
                  : "border-lavender/35 bg-cream/45 text-ink/75"
              }`}
            >
              <input
                type="radio"
                name={name}
                value={optionValue}
                checked={isSelected}
                onChange={() => onChange(optionValue)}
                className="mt-1 h-4 w-4 accent-plum"
              />
              <span className="min-w-0 flex-1">
                <span className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-2">
                  <span className="text-sm font-semibold leading-5">
                    {optionValue}
                  </span>
                  {hasPricingInformation && (
                    <span
                      className={`shrink-0 rounded-full px-2.5 py-1 text-[0.68rem] font-semibold ${
                        option.surcharge > 0
                          ? "bg-blush text-plum"
                          : "bg-white text-ink/62"
                      }`}
                    >
                      {option.surcharge > 0
                        ? `+ ${formatSoles(option.surcharge)}`
                        : "Incluido"}
                    </span>
                  )}
                </span>
                {(option.value || option.helper) && (
                  <span className="mt-1 block text-xs leading-5 text-ink/58">
                    {[option.value, option.helper].filter(Boolean).join(" · ")}
                  </span>
                )}
              </span>
            </label>
          );
        })}
        </div>
      </div>
    </section>
  );
}

function TextField({ label, value, onChange, placeholder, type = "text" }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-[0.12em] text-ink/48">
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="mt-2 min-h-12 w-full rounded-md border border-lavender/45 bg-white px-4 text-sm font-medium text-ink outline-none placeholder:text-ink/35 focus:border-plum"
      />
    </label>
  );
}

function TextAreaField({ label, value, onChange, placeholder, rows = 4 }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-[0.12em] text-ink/48">
        {label}
      </span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="mt-2 w-full rounded-md border border-lavender/45 bg-white px-4 py-3 text-sm font-medium leading-6 text-ink outline-none placeholder:text-ink/35 focus:border-plum"
      />
    </label>
  );
}

function RelatedProductCard({ product, isSelected, onToggle }) {
  const previewPrice = product.prices?.length
    ? getPriceOptions(product)[0]?.value
    : product.price ?? "Consultar";

  return (
    <article
      className={`group flex items-center gap-3 rounded-lg border p-3 shadow-sm transition-colors duration-200 ${
        isSelected
          ? "border-plum/40 bg-lavender-light/75"
          : "border-blush/45 bg-white"
      }`}
    >
      <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-md bg-blush/20">
        <img
          src={product.image}
          alt={`${product.name} de Bake Me Happy`}
          className="h-full w-full scale-[1.46] object-cover transition-transform duration-300 ease-out group-hover:scale-[1.52]"
          style={{ objectPosition: product.imagePosition }}
          loading="lazy"
          width="240"
          height="240"
        />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-blush/55 px-2.5 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-plum">
            {product.category}
          </span>
          <span className="text-[0.7rem] font-medium text-ink/46">
            {product.servings}
          </span>
        </div>

        <h3 className="mt-2 font-display text-2xl leading-tight text-ink">
          {product.name}
        </h3>
        <p className="mt-1 text-xs leading-5 text-ink/58">{product.description}</p>
        <p className="mt-2 text-sm font-semibold text-plum">{previewPrice}</p>
      </div>

      <button
        type="button"
        onClick={() => onToggle(product.id)}
        aria-pressed={isSelected}
        className={`inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-full border transition-colors duration-200 ${
          isSelected
            ? "border-plum bg-plum text-white"
            : "border-lavender/40 bg-cream/65 text-plum hover:border-plum/50 hover:bg-white"
        }`}
      >
        {isSelected ? (
          <Check size={16} aria-hidden="true" />
        ) : (
          <Plus size={16} aria-hidden="true" />
        )}
        <span className="sr-only">
          {isSelected ? `Quitar ${product.name}` : `Agregar ${product.name}`}
        </span>
      </button>
    </article>
  );
}

function isPersonalizedCake(product) {
  return product?.category === "Tortas personalizadas";
}

function isClassicCake(product) {
  return product?.category === "Tortas clásicas";
}

function isMiniCake(product) {
  return product?.category === "Mini tortas";
}

function isCompactCompanion(product) {
  return (
    isMiniCake(product) ||
    product?.tags?.includes("Regalo") ||
    product?.tags?.includes("Individual") ||
    product?.tags?.includes("Corazón")
  );
}

function getRelatedProducts(product) {
  if (!product) return [];

  const compactCompanions = products.filter(
    (item) => item.id !== product.id && isCompactCompanion(item),
  );
  const sameCategory = products.filter(
    (item) => item.id !== product.id && item.category === product.category,
  );
  const fallbackProducts = products.filter((item) => item.id !== product.id);

  return [...compactCompanions, ...sameCategory, ...fallbackProducts]
    .filter((item, index, collection) =>
      collection.findIndex((candidate) => candidate.id === item.id) === index,
    )
    .slice(0, 3);
}

function getRelatedSectionCopy() {
  return {
    //eyebrow: "Complementos sutiles",
    title: "También puedes sumar otro detalle",
    //description:
      //"Se mantiene tu selección actual y todo sale en la misma coordinación por WhatsApp.",
  };
}

function getProductGallery(product) {
  const gallery = product?.images?.length
    ? product.images
    : [
        {
          src: product?.image,
          alt: `${product?.name} de Bake Me Happy`,
          position: product?.imagePosition,
        },
        {
          src: "/images/webp/FONDO.webp",
          alt: `Vista alternativa de ${product?.name}`,
          position: "center",
        },
        {
          src: "/images/webp/fondo1.webp",
          alt: `Presentación alternativa de ${product?.name}`,
          position: "center",
        },
      ];

  return gallery
    .map((image) =>
      typeof image === "string"
        ? { src: image, alt: `${product?.name} de Bake Me Happy`, position: "center" }
        : image,
    )
    .filter((image) => image?.src)
    .filter(
      (image, index, collection) =>
        collection.findIndex((candidate) => candidate.src === image.src) === index,
    )
    .slice(0, 3);
}

function ProductGallery({ product, activeIndex, onSelect }) {
  const gallery = getProductGallery(product);
  const activeImage = gallery[activeIndex] ?? gallery[0];

  return (
    <div className="w-full max-w-full min-w-0 overflow-hidden bg-[#fffaf7] p-3 sm:p-4">
      <div className="grid w-full min-w-0 grid-cols-1 gap-3 sm:grid-cols-[6.5rem_minmax(0,1fr)]">
        <div
          className="order-2 grid w-full min-w-0 grid-cols-3 gap-2 sm:order-1 sm:h-full sm:grid-cols-1 sm:grid-rows-3 sm:gap-3"
          aria-label={`Vistas de ${product.name}`}
        >
          {gallery.map((image, index) => {
            const isSelected = activeIndex === index;

            return (
              <button
                key={image.src}
                type="button"
                onClick={() => onSelect(index)}
                aria-label={`Ver imagen ${index + 1} de ${product.name}`}
                aria-pressed={isSelected}
                className={`relative aspect-[5/4] min-h-11 min-w-0 w-full overflow-hidden rounded-md border bg-white p-1.5 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-plum focus-visible:ring-offset-2 sm:h-full sm:aspect-auto ${
                  isSelected
                    ? "border-plum shadow-sm"
                    : "border-blush/55 hover:border-plum/55"
                }`}
              >
                <img
                  src={image.src}
                  alt=""
                  className="h-full w-full rounded-[0.35rem] object-cover"
                  style={{ objectPosition: image.position ?? product.imagePosition ?? "center" }}
                  loading="lazy"
                  width="176"
                  height="140"
                />
              </button>
            );
          })}
        </div>

        <div className="relative order-1 aspect-[5/4] w-full min-w-0 overflow-hidden rounded-md bg-white sm:order-2">
          <img
            key={activeImage.src}
            src={activeImage.src}
            alt={activeImage.alt}
            className="h-full w-full object-cover"
            style={{
              objectPosition: activeImage.position ?? product.imagePosition ?? "center",
            }}
            width="900"
            height="720"
          />
        </div>
      </div>
    </div>
  );
}

export default function ProductPage({ currentPath }) {
  const productId = getProductId(currentPath);
  const product = products.find((item) => item.id === productId);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const classicCake = isClassicCake(product);
  const personalizedCake = isPersonalizedCake(product);
  const miniCake = isMiniCake(product);
  const relatedProducts = useMemo(() => getRelatedProducts(product), [product]);
  const relatedSectionCopy = useMemo(
    () => getRelatedSectionCopy(product),
    [product],
  );

  const sizeOptions = useMemo(() => getSizeOptions(product), [product]);
  const flavorOptions = personalizedCake
    ? cakeFlavors
    : product?.flavors?.length
      ? product.flavors
      : cakeFlavors;
  const fillingOptions = personalizedCake
    ? fillingFlavors
    : product?.fillings?.length
      ? product.fillings
      : fillingFlavors;

  const [selectedSize, setSelectedSize] = useState(sizeOptions[0]?.label ?? "");
  const [selectedFlavor, setSelectedFlavor] = useState(
    getOptionValue(flavorOptions[0]),
  );
  const [selectedFilling, setSelectedFilling] = useState(
    getOptionValue(fillingOptions[0]),
  );
  const [theme, setTheme] = useState("");
  const [colorPalette, setColorPalette] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [message, setMessage] = useState("");
  const [delivery, setDelivery] = useState("Recojo coordinado");
  const [date, setDate] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [selectedRelatedIds, setSelectedRelatedIds] = useState([]);
  const [activeGalleryIndex, setActiveGalleryIndex] = useState(0);

  useEffect(() => {
    setSelectedSize(sizeOptions[0]?.label ?? "");
    setSelectedFlavor(getOptionValue(flavorOptions[0]));
    setSelectedFilling(getOptionValue(fillingOptions[0]));
    setTheme("");
    setColorPalette("");
    setAdditionalInfo("");
    setMessage("");
    setDelivery("Recojo coordinado");
    setDate("");
    setQuantity(1);
    setSelectedRelatedIds([]);
    setActiveGalleryIndex(0);
  }, [fillingOptions, flavorOptions, productId, sizeOptions]);

  const selectedRelatedProducts = useMemo(
    () => relatedProducts.filter((item) => selectedRelatedIds.includes(item.id)),
    [relatedProducts, selectedRelatedIds],
  );

  function toggleRelatedProduct(productIdToToggle) {
    setSelectedRelatedIds((current) =>
      current.includes(productIdToToggle)
        ? current.filter((itemId) => itemId !== productIdToToggle)
        : [...current, productIdToToggle],
    );
  }

  if (!product) {
    return (
      <section className="bg-cream px-5 pb-20 pt-32 sm:px-8">
        <div className="mx-auto max-w-3xl rounded-lg bg-white p-8 text-center shadow-soft">
          <h1 className="font-display text-4xl text-ink">Producto no encontrado</h1>
          <p className="mt-3 text-sm leading-6 text-ink/65">
            Este producto no está disponible en el catálogo actual.
          </p>
          <a href="#/catalogo" className="button-primary mt-6">
            Volver al catálogo
          </a>
        </div>
      </section>
    );
  }

  const selectedPrice = sizeOptions.find((size) => size.label === selectedSize);
  const flavorSurcharge = personalizedCake
    ? getOptionSurcharge(flavorOptions, selectedFlavor)
    : 0;
  const fillingSurcharge = personalizedCake
    ? getOptionSurcharge(fillingOptions, selectedFilling)
    : 0;
  const totalSurcharge = flavorSurcharge + fillingSurcharge;
  const basePrice = getCurrencyAmount(selectedPrice?.value);
  const miniTotal = miniCake && basePrice !== null ? basePrice * quantity : null;
  const estimatedTotal =
    miniCake
      ? miniTotal
      : basePrice !== null
        ? basePrice + totalSurcharge
        : null;
  const whatsappMessage = [
    `Hola, vengo de la página web de Bake Me Happy. Quisiera cotizar: ${product.name}.`,
    miniCake
      ? `Formato: ${product.servings}${selectedPrice?.value ? ` (${selectedPrice.value})` : ""}.`
      : `Tamaño: ${selectedSize}${selectedPrice?.value ? ` (${selectedPrice.value})` : ""}.`,
    miniCake && product.dimensions ? `Medida referencial: ${product.dimensions}.` : null,
    miniCake ? `Cantidad: ${formatQuantityLabel(quantity)}.` : null,
    miniCake && product.flavors?.[0] ? `Queque: ${product.flavors[0]}.` : null,
    miniCake && product.fillings?.[0] ? `Relleno: ${product.fillings[0]}.` : null,
    miniCake ? "Acabado: Buttercream." : null,
    miniCake ? "Diseño: modelos disponibles según coordinación." : null,
    classicCake || miniCake
      ? null
      : `Sabor de queque: ${selectedFlavor}${flavorSurcharge ? ` (+ ${formatSoles(flavorSurcharge)})` : " (incluido)"}.`,
    classicCake || miniCake
      ? null
      : `Relleno: ${selectedFilling}${fillingSurcharge ? ` (+ ${formatSoles(fillingSurcharge)})` : " (incluido)"}.`,
    personalizedCake && totalSurcharge
      ? `Adicional por sabor y relleno: ${formatSoles(totalSurcharge)}.`
      : null,
    personalizedCake && theme ? `Temática: ${theme}.` : null,
    personalizedCake && colorPalette ? `Colores: ${colorPalette}.` : null,
    additionalInfo ? `Información adicional: ${additionalInfo}.` : null,
    message ? `Mensaje en la torta: ${message}.` : null,
    personalizedCake && date ? `Fecha deseada: ${date}.` : null,
    selectedRelatedProducts.length
      ? `También quisiera sumar: ${selectedRelatedProducts
          .map((item) => item.name)
          .join(", ")}.`
      : null,
    `Entrega: ${delivery}.`,
  ]
    .filter(Boolean)
    .join("\n");

  return (
    <section className="overflow-x-hidden bg-cream pb-20 pt-28 sm:pb-28">
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">
        <a
          href="#/catalogo"
          className="inline-flex min-h-11 items-center gap-2 rounded-full border border-lavender/45 bg-white px-4 text-sm font-semibold text-ink"
        >
          <ArrowLeft size={17} aria-hidden="true" />
          Volver al catálogo
        </a>

        <div className="mt-6 grid w-full min-w-0 grid-cols-[minmax(0,1fr)] gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <aside className="w-full min-w-0 space-y-5">
            <section className="w-full min-w-0 overflow-hidden rounded-lg border border-blush/50 bg-white shadow-soft">
              <ProductGallery
                product={product}
                activeIndex={activeGalleryIndex}
                onSelect={setActiveGalleryIndex}
              />

              <div className="p-5 sm:p-6">
                <span className="text-xs font-semibold uppercase tracking-[0.14em] text-plum">
                  Configura tu pedido
                </span>
                <h1 className="mt-2 font-display text-4xl leading-tight text-ink">
                  {product.name}
                </h1>
                <p className="mt-4 text-sm leading-6 text-ink/68">{product.details}</p>

                {miniCake && (
                  <div className="mt-4 rounded-md border border-blush/50 bg-cream/65 px-4 py-3 text-sm leading-6 text-ink/68">
                    <p>
                      <span className="font-semibold text-ink">Receta fija:</span>{" "}
                      {product.flavors?.[0]} relleno de {product.fillings?.[0]} y
                      decorada con buttercream.
                    </p>
                    <p className="mt-1">
                      <span className="font-semibold text-ink">Importante:</span>{" "}
                      únicos modelos disponibles, coordinados según stock.
                    </p>
                  </div>
                )}

                <div className="mt-5 flex flex-wrap gap-2">
                  {product.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-lavender-light px-3 py-1 text-xs font-medium text-plum"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </section>

            {!miniCake && relatedProducts.length > 0 && (
              <section className="rounded-lg border border-blush/40 bg-white/88 p-5 shadow-sm">
                <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-plum/88">
                  {relatedSectionCopy.eyebrow}
                </p>
                <h2 className="mt-2 font-display text-3xl leading-tight text-ink">
                  {relatedSectionCopy.title}
                </h2>
                <p className="mt-2 text-sm leading-6 text-ink/60">
                  {relatedSectionCopy.description}
                </p>

                <div className="mt-4 space-y-3">
                  {relatedProducts.map((item) => (
                    <RelatedProductCard
                      key={item.id}
                      product={item}
                      isSelected={selectedRelatedIds.includes(item.id)}
                      onToggle={toggleRelatedProduct}
                    />
                  ))}
                </div>
              </section>
            )}
          </aside>

          <div className="min-w-0 space-y-5">
            <div className="rounded-lg border border-lavender/40 bg-lavender-light/65 p-5">
              <div className="flex gap-3">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white text-plum shadow-sm">
                  <Heart size={20} aria-hidden="true" />
                </span>
                <div className="min-w-0 flex-1">
                  <h2 className="font-display text-3xl text-ink">
                    Elige las características
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-ink/66">
                    Estas opciones se enviarán por WhatsApp para confirmar
                    disponibilidad, precio final y forma de entrega.
                  </p>

                  {personalizedCake && (
                    <button
                      type="button"
                      className="mt-4 inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-plum/20 bg-white px-4 text-sm font-semibold text-ink shadow-sm transition-colors duration-200 hover:border-plum hover:text-plum"
                      onClick={() => setIsSizeGuideOpen(true)}
                    >
                      <Ruler size={17} aria-hidden="true" />
                      Ver guía de tamaños
                    </button>
                  )}
                </div>
              </div>
            </div>

            {miniCake ? (
              <section className="overflow-hidden rounded-lg border border-blush/45 bg-white shadow-sm">
                <div className="flex items-center gap-3 px-5 py-4">
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-blush/45 text-plum">
                    <Ruler size={19} aria-hidden="true" />
                  </span>
                  <div>
                    <h2 className="text-sm font-semibold text-ink">Formato mini</h2>
                    <p className="mt-1 text-xs leading-5 text-ink/55">
                      Mini torta individual con porción fija y precio unitario.
                    </p>
                  </div>
                </div>

                <div className="border-t border-blush/25 px-5 pb-5 pt-4">
                  <div className="rounded-lg border border-lavender/35 bg-lavender-light/55 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-ink">{product.servings}</p>
                        <p className="mt-1 text-xs leading-5 text-ink/58">
                          {selectedPrice?.value ?? product.price}
                        </p>
                        {product.dimensions && (
                          <p className="mt-1 text-xs leading-5 text-ink/52">
                            {product.dimensions}
                          </p>
                        )}
                      </div>
                      <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-plum">
                        Únicos modelos disponibles
                      </span>
                    </div>
                  </div>
                </div>
              </section>
            ) : (
              <OptionGroup
                title="Tamaño o porciones"
                icon={Ruler}
                name="size"
                options={sizeOptions}
                value={selectedSize}
                onChange={setSelectedSize}
              />
            )}
            {!classicCake && !miniCake && (
              <>
                <OptionGroup
                  title="Sabor de queque"
                  description="Elige un sabor. Las opciones especiales muestran su recargo."
                  icon={CakeSlice}
                  name="flavor"
                  options={flavorOptions}
                  value={selectedFlavor}
                  onChange={setSelectedFlavor}
                />
                <OptionGroup
                  title="Relleno"
                  description="Selecciona un relleno para toda la torta."
                  icon={Check}
                  name="filling"
                  options={fillingOptions}
                  value={selectedFilling}
                  onChange={setSelectedFilling}
                />
              </>
            )}

            <div className="overflow-hidden rounded-lg border border-blush/45 bg-white shadow-sm">
              <div className="flex items-center gap-3 px-5 py-4">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-blush/45 text-plum">
                  <Palette size={19} aria-hidden="true" />
                </span>
                <h2 className="text-sm font-semibold text-ink">
                  {classicCake
                    ? "Detalles del pedido"
                    : miniCake
                      ? "Datos de tu pedido"
                      : "Diseño y personalización"}
                </h2>
              </div>

              {classicCake ? (
                <div className="grid gap-4 border-t border-blush/25 px-5 pb-5 pt-4">
                  <TextAreaField
                    label="Información adicional"
                    value={additionalInfo}
                    onChange={setAdditionalInfo}
                    placeholder="Ej. sin nueces, más fudge, escribir dedicatoria en tapa, referencias para la presentación, etc."
                  />
                  <TextField
                    label="Mensaje en la torta"
                    value={message}
                    onChange={setMessage}
                    placeholder="Ej. Feliz cumpleaños, Camila"
                  />
                </div>
              ) : miniCake ? (
                <div className="grid gap-4 border-t border-blush/25 px-5 pb-5 pt-4 sm:grid-cols-2">
                  <TextField
                    label="Cantidad"
                    value={quantity}
                    onChange={(nextValue) =>
                      setQuantity(
                        Math.max(1, Number.parseInt(nextValue, 10) || 1),
                      )
                    }
                    type="number"
                    placeholder="1"
                  />
                  <TextField
                    label="Fecha deseada"
                    value={date}
                    onChange={setDate}
                    type="date"
                  />
                  <TextField
                    label="Mensaje en la mini torta"
                    value={message}
                    onChange={setMessage}
                    placeholder="Ej. Feliz día"
                  />
                  <TextAreaField
                    label="Información adicional"
                    value={additionalInfo}
                    onChange={setAdditionalInfo}
                    placeholder="Ej. si deseas coordinar color disponible, pedido para regalo, horario de entrega o alguna indicación puntual."
                  />
                </div>
              ) : (
                <div className="grid gap-4 border-t border-blush/25 px-5 pb-5 pt-4 sm:grid-cols-2">
                  <TextField
                    label="Temática"
                    value={theme}
                    onChange={setTheme}
                    placeholder="Ej. mariposas, mamá, princesa"
                  />
                  <TextField
                    label="Colores"
                    value={colorPalette}
                    onChange={setColorPalette}
                    placeholder="Ej. rosa pastel y lavanda"
                  />
                  <TextAreaField
                    label="Información adicional"
                    value={additionalInfo}
                    onChange={setAdditionalInfo}
                    placeholder="Ej. topper especial, referencia del acabado, cambios en decoración, indicaciones para la entrega, etc."
                  />
                  <div className="grid gap-4">
                    <TextField
                      label="Mensaje"
                      value={message}
                      onChange={setMessage}
                      placeholder="Ej. Feliz cumple, Valeria"
                    />
                    <TextField
                      label="Fecha deseada"
                      value={date}
                      onChange={setDate}
                      type="date"
                    />
                  </div>
                </div>
              )}
            </div>

            <section
              aria-labelledby="delivery-group-title"
              className="overflow-hidden rounded-lg border border-blush/45 bg-white shadow-sm"
            >
              <div className="flex items-center gap-3 px-5 py-4">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-blush/45 text-plum">
                  <Truck size={19} aria-hidden="true" />
                </span>
                <h2 id="delivery-group-title" className="text-sm font-semibold text-ink">
                  Entrega
                </h2>
              </div>

              <div className="border-t border-blush/25 px-5 pb-5 pt-4">
                <div className="grid gap-3 sm:grid-cols-2">
                {["Recojo coordinado", "Delivery previa coordinación"].map((option) => (
                  <label
                    key={option}
                    className={`flex min-h-14 cursor-pointer items-center gap-3 rounded-lg border p-3 ${
                      delivery === option
                        ? "border-plum bg-lavender-light"
                        : "border-lavender/35 bg-cream/45"
                    }`}
                  >
                    <input
                      type="radio"
                      name="delivery"
                      value={option}
                      checked={delivery === option}
                      onChange={() => setDelivery(option)}
                      className="h-4 w-4 accent-plum"
                    />
                    <span className="text-sm font-semibold text-ink">{option}</span>
                  </label>
                ))}
                </div>
              </div>
            </section>

            <div className="rounded-lg border border-plum/20 bg-ink p-5 text-white shadow-soft">
              <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-center">
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-blush">
                    <CalendarDays size={16} aria-hidden="true" />
                    Resumen para cotizar
                  </div>
                  <p className="mt-3 text-sm leading-6 text-white/72">
                    {classicCake
                      ? `${product.name} · ${selectedSize} · ${delivery}`
                      : miniCake
                        ? `${product.name} · ${formatQuantityLabel(quantity)} · ${product.servings}`
                      : `${product.name} · ${selectedSize} · ${selectedFlavor} · ${selectedFilling}`}
                  </p>
                  {miniCake && estimatedTotal !== null && (
                    <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                      <span className="text-white/68">
                        Precio unitario: {selectedPrice?.value ?? product.price}
                      </span>
                      <span className="font-semibold text-white">
                        Total referencial: {formatSoles(estimatedTotal)}
                      </span>
                    </div>
                  )}
                  {personalizedCake && (
                    <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                      <span className="text-white/68">
                        Adicionales: {formatSoles(totalSurcharge)}
                      </span>
                      {estimatedTotal !== null && (
                        <span className="font-semibold text-white">
                          Total referencial: {formatSoles(estimatedTotal)}
                        </span>
                      )}
                    </div>
                  )}
                  {selectedRelatedProducts.length > 0 && (
                    <p className="mt-3 text-sm leading-6 text-white/72">
                      Complementos:{" "}
                      {selectedRelatedProducts.map((item) => item.name).join(", ")}
                    </p>
                  )}
                </div>
                <a
                  href={getWhatsAppUrl(whatsappMessage)}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-white px-6 py-3 text-sm font-semibold text-ink"
                >
                  <MessageCircle size={18} aria-hidden="true" />
                  Enviar selección
                </a>
              </div>
            </div>
          </div>
        </div>

        {miniCake && relatedProducts.length > 0 && (
          <section className="mt-12 border-t border-blush/35 pt-10">
            <div className="max-w-3xl">
              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-plum/88">
                {relatedSectionCopy.eyebrow}
              </p>
              <h2 className="mt-2 font-display text-3xl leading-tight text-ink sm:text-4xl">
                {relatedSectionCopy.title}
              </h2>
              <p className="mt-3 text-sm leading-6 text-ink/60 sm:text-base">
                {relatedSectionCopy.description}
              </p>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {relatedProducts.map((item) => (
                <RelatedProductCard
                  key={item.id}
                  product={item}
                  isSelected={selectedRelatedIds.includes(item.id)}
                  onToggle={toggleRelatedProduct}
                />
              ))}
            </div>
          </section>
        )}

      </div>

      <SizeGuideModal
        isOpen={isSizeGuideOpen}
        onClose={() => setIsSizeGuideOpen(false)}
      />
    </section>
  );
}
