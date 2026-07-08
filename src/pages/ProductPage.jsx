import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  CakeSlice,
  Check,
  Heart,
  MessageCircle,
  Palette,
  Ruler,
  Truck,
} from "lucide-react";
import { getWhatsAppUrl } from "../data/site";
import { cakeFlavors, fillingFlavors, products, sizeGuide } from "../data/products";
import SizeGuideModal from "../components/SizeGuideModal";

const EMPTY_OPTIONS = [];
const DETAIL_CONTAINER_CLASS =
  "mx-auto w-full max-w-[1660px] px-5 sm:px-8 2xl:px-12";

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

  const [, rawAmount] = value.match(/s\/\s*([\d.,]+)/i) ?? [];
  const amount = Number(rawAmount?.replace(",", "."));
  return Number.isFinite(amount) ? amount : null;
}

function formatSoles(amount) {
  return `S/ ${amount}`;
}

function formatQuantityLabel(quantity) {
  return `${quantity} ${quantity === 1 ? "unidad" : "unidades"}`;
}

function getStartingPriceLabel(product) {
  const numericPrices = (product?.prices ?? [])
    .map((price) => getCurrencyAmount(price))
    .filter((price) => price !== null);
  const variablePrice = (product?.prices?.length ?? 0) > 1;

  if (numericPrices.length) {
    const minimumPrice = Math.min(...numericPrices);
    return variablePrice
      ? `Desde ${formatSoles(minimumPrice)}`
      : formatSoles(minimumPrice);
  }

  const numericPrice = getCurrencyAmount(product?.price);
  if (numericPrice !== null) {
    return product.price.toLowerCase().includes("desde")
      ? `Desde ${formatSoles(numericPrice)}`
      : formatSoles(numericPrice);
  }

  return product?.price ?? "Consultar";
}

function getPreparationTime(product) {
  const preparationByCategory = {
    "Tortas clasicas": "2 a 3 dias habiles",
    "Tortas tematicas": "5 a 7 dias habiles",
    "Bocaditos tematicos": "4 a 5 dias habiles",
    Complementos: "24 a 48 horas",
    "Mini tortas": "2 a 3 dias habiles",
  };

  return preparationByCategory[product?.category] ?? "segun coordinacion";
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
    helper: "Precio base",
  }));
}

function TextField({ label, value, onChange, placeholder, type = "text" }) {
  return (
    <label className="grid gap-2 md:grid-cols-[8.5rem_minmax(0,1fr)] md:items-center">
      <span className="text-[0.8rem] font-semibold uppercase tracking-[0.12em] text-ink/55">
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="min-h-12 w-full rounded-lg border border-blush/55 bg-white px-4 text-base font-medium text-ink outline-none placeholder:text-ink/35 focus:border-plum/60 focus:ring-4 focus:ring-blush/30"
      />
    </label>
  );
}

function TextAreaField({ label, value, onChange, placeholder, rows = 4 }) {
  return (
    <label className="grid gap-2 md:grid-cols-[8.5rem_minmax(0,1fr)] md:items-start">
      <span className="text-[0.8rem] font-semibold uppercase tracking-[0.12em] text-ink/55 md:pt-3">
        {label}
      </span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full rounded-lg border border-blush/55 bg-white px-4 py-3 text-base font-medium leading-7 text-ink outline-none placeholder:text-ink/35 focus:border-plum/60 focus:ring-4 focus:ring-blush/30"
      />
    </label>
  );
}

function DeliveryOptions({ delivery, onChange }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {["Recojo coordinado", "Delivery previa coordinación"].map((option) => (
        <label
          key={option}
          className={`flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 transition-colors duration-200 ${
            delivery === option
              ? "border-plum/45 bg-blush/15 shadow-sm"
              : "border-blush/50 bg-white hover:border-plum/25"
          }`}
        >
          <input
            type="radio"
            name="delivery"
            value={option}
            checked={delivery === option}
            onChange={() => onChange(option)}
            className="h-4 w-4 accent-plum"
          />
          <span className="text-sm font-semibold text-ink">{option}</span>
        </label>
      ))}
    </div>
  );
}

function SelectField({ label, value, onChange, options, name }) {
  const selectedOption = options.find(
    (option) => getOptionValue(option) === value,
  );
  const selectedSurcharge =
    typeof selectedOption === "object" ? selectedOption.surcharge ?? 0 : 0;
  const selectedDetailValue =
    typeof selectedOption === "object"
      ? selectedOption.value ?? selectedOption.helper
      : null;
  const selectedHelper =
    selectedSurcharge > 0
      ? `Adicional ${formatSoles(selectedSurcharge)}`
      : selectedDetailValue && /s\/|consultar/i.test(selectedDetailValue)
        ? selectedDetailValue
        : selectedDetailValue
          ? `Incluido - ${selectedDetailValue}`
          : "Incluido";
  const selectedDetail = null;

  return (
    <label className="grid gap-2 md:grid-cols-[8.5rem_minmax(0,1fr)] md:items-start">
      <span className="text-[0.8rem] font-semibold uppercase tracking-[0.12em] text-ink/55 md:pt-3">
        {label}
      </span>
      <select
        name={name}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="min-h-12 w-full rounded-lg border border-blush/55 bg-white px-4 text-base font-semibold text-ink outline-none focus:border-plum/60 focus:ring-4 focus:ring-blush/30"
      >
        {options.map((option) => {
          const optionValue = getOptionValue(option);
          const surcharge =
            typeof option === "object" ? option.surcharge ?? 0 : 0;

          return (
            <option key={optionValue} value={optionValue}>
              {optionValue}
              {surcharge > 0 ? ` (+ ${formatSoles(surcharge)})` : ""}
            </option>
          );
        })}
      </select>
      <p className="text-sm leading-5 text-ink/55 md:col-start-2">
        {selectedHelper}
        {selectedDetail ? ` · ${selectedDetail}` : ""}
      </p>
    </label>
  );
}

function isPersonalizedCake(product) {
  return product?.category === "Tortas tematicas";
}

function isClassicCake(product) {
  return product?.category === "Tortas clasicas";
}

function isMiniCake(product) {
  return product?.category === "Mini tortas";
}

function isThemedBite(product) {
  return product?.category === "Bocaditos tematicos";
}

function isComplement(product) {
  return product?.category === "Complementos";
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
          src: "/images/webp/hero 2.webp",
          alt: `Vista alternativa de ${product?.name}`,
          position: "center",
        },
        {
          src: "/images/webp/hero 3.webp",
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
    <div className="w-full max-w-full min-w-0 overflow-hidden rounded-[2rem] bg-white/55 p-2 shadow-[0_20px_60px_rgba(77,35,67,0.08)] ring-1 ring-blush/35 sm:p-3 lg:p-4">
      <div className="grid w-full min-w-0 grid-cols-1 gap-3 sm:grid-cols-[5.75rem_minmax(0,1fr)] lg:grid-cols-[6.5rem_minmax(0,1fr)] 2xl:grid-cols-[7rem_minmax(0,1fr)]">
        <div
          className="order-2 grid w-full min-w-0 grid-cols-3 gap-2 sm:order-1 sm:grid-cols-1 sm:gap-3"
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
                className={`relative aspect-square min-h-11 min-w-0 w-full overflow-hidden rounded-[1.4rem] bg-white/70 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-plum focus-visible:ring-offset-2 ${
                  isSelected
                    ? "shadow-[0_0_0_2px_rgba(145,112,188,0.45)]"
                    : "opacity-75 hover:opacity-100 hover:shadow-[0_0_0_1px_rgba(145,112,188,0.22)]"
                }`}
              >
                <img
                  src={image.src}
                  alt=""
                  className="h-full w-full rounded-[1.4rem] object-cover"
                  style={{ objectPosition: image.position ?? product.imagePosition ?? "center" }}
                  loading="lazy"
                  width="176"
                  height="140"
                />
              </button>
            );
          })}
        </div>

        <div className="relative order-1 aspect-square w-full max-w-[620px] justify-self-center overflow-hidden rounded-[2.5rem] bg-[radial-gradient(circle_at_50%_45%,#fff_0%,#fff8f4_62%,#f8edf4_100%)] sm:order-2 xl:max-w-[660px]">
          <img
            key={activeImage.src}
            src={activeImage.src}
            alt={activeImage.alt}
            className="h-full w-full rounded-[2.5rem] object-cover"
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

function ConfiguratorStepNav({ steps, activeStep, onStepChange }) {
  return (
    <nav
      aria-label="Pasos para configurar el pedido"
      className="mt-3 grid gap-2 sm:grid-cols-3"
    >
      {steps.map((step, index) => {
        const Icon = step.icon;
        const isActive = activeStep === index;
        const isComplete = index < activeStep;

        return (
          <button
            key={step.label}
            type="button"
            onClick={() => onStepChange(index)}
            aria-current={isActive ? "step" : undefined}
            className={`min-h-11 rounded-lg border px-3 py-2 text-left transition-colors duration-200 ${
              isActive
                ? "border-plum bg-white text-ink shadow-sm"
                : "border-blush/40 bg-white/55 text-ink/62 hover:border-plum/45 hover:bg-white"
            }`}
          >
            <span className="flex items-center gap-2">
              <span
                className={`grid h-6 w-6 shrink-0 place-items-center rounded-full ${
                  isActive || isComplete
                    ? "bg-plum text-white"
                    : "bg-blush/55 text-plum"
                }`}
              >
                {isComplete ? (
                  <Check size={13} aria-hidden="true" />
                ) : (
                  <Icon size={13} aria-hidden="true" />
                )}
              </span>
              <span className="min-w-0">
                <span className="block text-[0.58rem] font-semibold uppercase tracking-[0.14em] text-plum/80">
                  Paso {index + 1}
                </span>
                <span className="block text-xs font-semibold leading-4 sm:text-[0.8rem]">
                  {step.label}
                </span>
              </span>
            </span>
          </button>
        );
      })}
    </nav>
  );
}

function SummaryItem({ label, value, strong = false }) {
  return (
    <span className={`min-w-0 ${strong ? "font-semibold text-white" : "text-white/68"}`}>
      {label}: {value}
    </span>
  );
}

export default function ProductPage({ currentPath }) {
  const productId = getProductId(currentPath);
  const product = products.find((item) => item.id === productId);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const classicCake = isClassicCake(product);
  const personalizedCake = isPersonalizedCake(product);
  const miniCake = isMiniCake(product);
  const biteProduct = isThemedBite(product);
  const complementProduct = isComplement(product);
  const quantityProduct = miniCake || biteProduct || complementProduct;

  const sizeOptions = useMemo(() => getSizeOptions(product), [product]);
  const flavorOptions = useMemo(() => {
    if (personalizedCake) return cakeFlavors;
    return product?.flavors?.length ? product.flavors : EMPTY_OPTIONS;
  }, [personalizedCake, product]);
  const fillingOptions = useMemo(() => {
    if (personalizedCake) return fillingFlavors;
    return product?.fillings?.length ? product.fillings : EMPTY_OPTIONS;
  }, [personalizedCake, product]);
  const hasFlavorSelection = !classicCake && !complementProduct && flavorOptions.length > 0;
  const hasFillingSelection =
    !classicCake && !complementProduct && fillingOptions.length > 0;

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
  const [time, setTime] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [activeGalleryIndex, setActiveGalleryIndex] = useState(0);
  const [activeConfigStep, setActiveConfigStep] = useState(0);

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
    setTime("");
    setQuantity(1);
    setActiveGalleryIndex(0);
    setActiveConfigStep(0);
  }, [fillingOptions, flavorOptions, productId, sizeOptions]);

  if (!product) {
    return (
      <section className="bg-cream px-5 pb-20 pt-32 sm:px-8">
        <div className="mx-auto max-w-3xl rounded-lg bg-white p-8 text-center shadow-soft">
          <h1 className="font-display text-4xl text-ink">Producto no encontrado</h1>
          <p className="mt-3 text-sm leading-6 text-ink/65">
            Este producto no está disponible en la tienda actual.
          </p>
          <a href="#/tienda" className="button-primary mt-6">
            Volver a la tienda
          </a>
        </div>
      </section>
    );
  }

  const selectedPrice = sizeOptions.find((size) => size.label === selectedSize);
  const referenceValue = selectedPrice?.value ?? product.price ?? "Consultar";
  const referenceAmount = getCurrencyAmount(referenceValue);
  const flavorSurcharge = personalizedCake
    ? getOptionSurcharge(flavorOptions, selectedFlavor)
    : 0;
  const fillingSurcharge = personalizedCake
    ? getOptionSurcharge(fillingOptions, selectedFilling)
    : 0;
  const totalSurcharge = flavorSurcharge + fillingSurcharge;
  const basePrice = getCurrencyAmount(selectedPrice?.value);
  const quantityTotal =
    quantityProduct && basePrice !== null ? basePrice * quantity : null;
  const estimatedTotal =
    quantityProduct
      ? quantityTotal
      : basePrice !== null
        ? basePrice + totalSurcharge
        : null;
  const finalPriceLabel =
    estimatedTotal !== null
      ? formatSoles(estimatedTotal)
      : referenceValue;
  const finalPriceTitle =
    quantityProduct || personalizedCake ? "Precio final estimado" : "Precio final";
  const referenceLabel =
    referenceAmount !== null ? "Base referencial" : "Porciones referenciales";
  const startingPriceLabel = getStartingPriceLabel(product);
  const preparationTime = getPreparationTime(product);
  const configSteps = quantityProduct
    ? [
        {
          label: complementProduct ? "Complemento" : "Presentacion",
          title: complementProduct
            ? "Complemento y cantidad"
            : "Presentacion y cantidad",
          description: complementProduct
            ? "Confirma el complemento y cuantas unidades o sets deseas."
            : "Selecciona la presentacion y la cantidad que necesitas para tu pedido.",
          icon: CakeSlice,
        },
        {
          label: "Detalles",
          title: complementProduct ? "Detalle final" : "Personalizacion",
          description: complementProduct
            ? "Agrega fecha e indicaciones para combinarlo con tu pedido."
            : "Cuentanos la tematica, colores o referencias para personalizarlo.",
          icon: Palette,
        },
        {
          label: "Entrega",
          title: "Entrega y resumen",
          description: "Elige como recibirlo y envia tu seleccion por WhatsApp.",
          icon: Truck,
        },
      ]
    : classicCake
      ? [
          {
            label: "Tamaño",
            title: "Tamaño de la torta",
            description: "Elige la presentación que mejor calza con tu celebración.",
            icon: Ruler,
          },
          {
            label: "Detalles",
            title: "Detalles del pedido",
            description: "Agrega indicaciones y el mensaje que irá en la torta.",
            icon: Palette,
          },
          {
            label: "Entrega",
            title: "Entrega y resumen",
            description: "Revisa la selección antes de enviarla por WhatsApp.",
            icon: Truck,
          },
        ]
      : [
          {
            label: "Base",
            title: "Base de la torta",
            description: "Elige tamaño, sabor de queque y relleno.",
            icon: CakeSlice,
          },
          {
            label: "Diseño",
            title: "Diseño y personalización",
            description: "Cuéntanos temática, colores, mensaje y fecha deseada.",
            icon: Palette,
          },
          {
            label: "Entrega",
            title: "Entrega y resumen",
            description: "Confirma cómo recibirla y envía la selección.",
            icon: Truck,
          },
        ];
  const currentConfigStep = configSteps[activeConfigStep] ?? configSteps[0];
  const isLastConfigStep = activeConfigStep === configSteps.length - 1;

  function goToPreviousConfigStep() {
    setActiveConfigStep((currentStep) => Math.max(currentStep - 1, 0));
  }

  function goToNextConfigStep() {
    setActiveConfigStep((currentStep) =>
      Math.min(currentStep + 1, configSteps.length - 1),
    );
  }

  const whatsappMessage = [
    `Hola, vengo de la página web de Bake Me Happy. Quisiera cotizar: ${product.name}.`,
    quantityProduct
      ? `Presentacion: ${selectedSize}${selectedPrice?.value ? ` (${selectedPrice.value})` : ""}.`
      : `Tamaño: ${selectedSize}${selectedPrice?.value ? ` (${selectedPrice.value})` : ""}.`,
    miniCake && product.dimensions ? `Medida referencial: ${product.dimensions}.` : null,
    quantityProduct
      ? `Cantidad: ${miniCake ? formatQuantityLabel(quantity) : quantity}.`
      : null,
    quantityProduct && selectedFlavor ? `Sabor: ${selectedFlavor}.` : null,
    quantityProduct && selectedFilling ? `Relleno: ${selectedFilling}.` : null,
    miniCake ? "Acabado: Buttercream." : null,
    miniCake ? "Diseño: modelos disponibles según coordinación." : null,
    classicCake || quantityProduct
      ? null
      : `Sabor de queque: ${selectedFlavor}${flavorSurcharge ? ` (+ ${formatSoles(flavorSurcharge)})` : " (incluido)"}.`,
    classicCake || quantityProduct
      ? null
      : `Relleno: ${selectedFilling}${fillingSurcharge ? ` (+ ${formatSoles(fillingSurcharge)})` : " (incluido)"}.`,
    personalizedCake && totalSurcharge
      ? `Adicional por sabor y relleno: ${formatSoles(totalSurcharge)}.`
      : null,
    personalizedCake && theme ? `Temática: ${theme}.` : null,
    biteProduct && theme ? `Tematica: ${theme}.` : null,
    biteProduct && colorPalette ? `Colores: ${colorPalette}.` : null,
    additionalInfo ? `Información adicional: ${additionalInfo}.` : null,
    message ? `Mensaje en la torta: ${message}.` : null,
    date ? `Fecha deseada: ${date}.` : null,
    time ? `Hora deseada: ${time}.` : null,
    `Entrega: ${delivery}.`,
  ]
    .filter(Boolean)
    .join("\n");

  return (
    <section className="overflow-x-hidden bg-cream pb-20 pt-32 sm:pb-28 lg:pt-40">
      <div className={DETAIL_CONTAINER_CLASS}>
        <a
          href="#/tienda"
          className="relative z-10 inline-flex min-h-11 items-center gap-2 rounded-full border border-lavender/45 bg-white px-4 text-sm font-semibold text-ink shadow-sm transition-colors hover:border-plum hover:text-plum"
        >
          <ArrowLeft size={17} aria-hidden="true" />
          Volver a la tienda
        </a>

        <div className="mt-6 grid w-full min-w-0 grid-cols-[minmax(0,1fr)] gap-8 lg:grid-cols-2 lg:items-start">
          <aside className="w-full min-w-0 self-start">
            <ProductGallery
              product={product}
              activeIndex={activeGalleryIndex}
              onSelect={setActiveGalleryIndex}
            />

              {false && miniCake && (
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
          </aside>

          <section
            data-config-card="true"
            className="min-w-0 self-start overflow-hidden rounded-lg border border-blush/45 bg-white shadow-soft"
          >
            <div className="border-b border-blush/40 bg-[linear-gradient(135deg,#FFF8F4_0%,#F7EEFF_100%)] p-5 sm:p-6">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <span className="text-xs font-semibold uppercase tracking-[0.16em] text-plum">
                    {product.category}
                  </span>
                  <h1 className="mt-2 font-display text-4xl leading-tight text-ink sm:text-5xl">
                    {product.name}
                  </h1>
                  <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-white/75 px-3 py-1.5 text-sm font-semibold text-ink/70 shadow-sm">
                    <CalendarDays size={16} aria-hidden="true" />
                    Listo en {preparationTime}
                  </p>
                </div>

                <div className="shrink-0 rounded-lg border border-blush/45 bg-white/85 px-5 py-4 shadow-sm sm:min-w-44 sm:text-right">
                  <p className="text-2xl font-semibold text-plum sm:text-3xl">
                    {startingPriceLabel}
                  </p>
                </div>
              </div>

              <p className="mt-5 text-base leading-7 text-ink/68">{product.details}</p>

              {(product.prices?.length ?? 0) > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {product.prices.map((priceOption) => (
                    <span
                      key={priceOption}
                      className="rounded-full bg-white/70 px-3.5 py-1.5 text-sm font-semibold text-ink/70 shadow-sm ring-1 ring-blush/45"
                    >
                      {priceOption}
                    </span>
                  ))}
                </div>
              )}

              {(product.includes?.length ?? 0) > 0 && (
                <div className="mt-5 grid gap-3">
                  {product.includes.map((feature) => (
                    <div
                      key={feature}
                      className="flex gap-3 rounded-md border border-white/70 bg-white/65 px-4 py-3 text-sm font-medium leading-6 text-ink/70"
                    >
                      <span className="mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-blush text-plum">
                        <Check size={13} aria-hidden="true" />
                      </span>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              )}

              {miniCake && (
                <div className="mt-5 rounded-md border border-blush/50 bg-white/70 px-4 py-3 text-sm leading-6 text-ink/68">
                  <p>
                    <span className="font-semibold text-ink">Receta fija:</span>{" "}
                    {product.flavors?.[0]} relleno de {product.fillings?.[0]} y
                    decorada con buttercream.
                  </p>
                  <p className="mt-1">
                    <span className="font-semibold text-ink">Importante:</span>{" "}
                    modelos disponibles segun coordinacion.
                  </p>
                </div>
              )}

            </div>

            <div className="hidden">
              <div className="flex gap-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white text-plum shadow-sm">
                  <Heart size={18} aria-hidden="true" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h2 className="font-display text-2xl leading-tight text-ink">
                        Configura tu pedido
                      </h2>
                      <p className="mt-1 text-xs leading-5 text-ink/66">
                        Enviaremos tu selección por WhatsApp para confirmar
                        disponibilidad y entrega.
                      </p>
                    </div>

                    {personalizedCake && (
                      <button
                        type="button"
                        className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-full border border-plum/20 bg-white px-4 text-sm font-semibold text-ink shadow-sm transition-colors duration-200 hover:border-plum hover:text-plum"
                        onClick={() => setIsSizeGuideOpen(true)}
                      >
                        <Ruler size={17} aria-hidden="true" />
                        Ver guía
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <ConfiguratorStepNav
                steps={configSteps}
                activeStep={activeConfigStep}
                onStepChange={setActiveConfigStep}
              />

              <p className="mt-2 text-xs font-medium leading-5 text-ink/58">
                <span className="font-semibold text-plum">
                  {currentConfigStep.title}:
                </span>{" "}
                {currentConfigStep.description}
              </p>
            </div>

            <div className="space-y-4 bg-[#fffdfc] p-4 sm:p-5">
              <section className="rounded-lg border border-blush/45 bg-white p-4 shadow-sm">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h2 className="font-display text-3xl leading-tight text-ink sm:text-4xl">
                      Configura tu pedido
                    </h2>
                    <p className="mt-2 text-base leading-7 text-ink/62">
                      Completa los detalles y enviaremos tu seleccion por WhatsApp
                      para confirmar disponibilidad, precio final y entrega.
                    </p>
                  </div>

                  {personalizedCake && (
                    <button
                      type="button"
                      className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-full border border-blush/55 bg-white px-4 text-sm font-semibold text-ink shadow-sm transition-colors duration-200 hover:border-plum/45 hover:text-plum"
                      onClick={() => setIsSizeGuideOpen(true)}
                    >
                      <Ruler size={17} aria-hidden="true" />
                      Ver guia
                    </button>
                  )}
                </div>
              </section>

              <section className="rounded-lg border border-blush/45 bg-white p-4 shadow-sm">
                <h3 className="text-lg font-semibold text-ink">
                  Presentacion y base
                </h3>
                <div className="mt-4 space-y-4">
                  {quantityProduct ? (
                    <>
                      <div className="rounded-lg border border-blush/45 bg-blush/10 p-4">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div>
                            <p className="text-base font-semibold text-ink">
                              {selectedSize || product.servings}
                            </p>
                            <p className="mt-1 text-sm leading-6 text-ink/58">
                              {selectedPrice?.value ?? product.price ?? "Consultar"}
                            </p>
                            {product.dimensions && (
                              <p className="mt-1 text-sm leading-6 text-ink/52">
                                {product.dimensions}
                              </p>
                            )}
                          </div>
                          {miniCake && (
                            <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-plum">
                              Buttercream
                            </span>
                          )}
                        </div>
                      </div>

                      {!miniCake && (
                        <SelectField
                          label={complementProduct ? "Complemento o presentacion" : "Presentacion"}
                          name="size"
                          options={sizeOptions}
                          value={selectedSize}
                          onChange={setSelectedSize}
                        />
                      )}

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

                      {(hasFlavorSelection || hasFillingSelection) && !miniCake && (
                        <div
                          className={`grid gap-4 ${
                            hasFlavorSelection && hasFillingSelection
                              ? "sm:grid-cols-2"
                              : "sm:grid-cols-1"
                          }`}
                        >
                          {hasFlavorSelection && (
                            <SelectField
                              label="Sabor"
                              name="flavor"
                              options={flavorOptions}
                              value={selectedFlavor}
                              onChange={setSelectedFlavor}
                            />
                          )}
                          {hasFillingSelection && (
                            <SelectField
                              label="Relleno"
                              name="filling"
                              options={fillingOptions}
                              value={selectedFilling}
                              onChange={setSelectedFilling}
                            />
                          )}
                        </div>
                      )}
                    </>
                  ) : (
                    <SelectField
                      label="Tamano o porciones"
                      name="size"
                      options={sizeOptions}
                      value={selectedSize}
                      onChange={setSelectedSize}
                    />
                  )}

                  {personalizedCake && (
                    <div className="grid gap-4 border-t border-blush/35 pt-4 sm:grid-cols-2">
                      <SelectField
                        label="Sabor de queque"
                        name="flavor"
                        options={flavorOptions}
                        value={selectedFlavor}
                        onChange={setSelectedFlavor}
                      />
                      <SelectField
                        label="Relleno"
                        name="filling"
                        options={fillingOptions}
                        value={selectedFilling}
                        onChange={setSelectedFilling}
                      />
                    </div>
                  )}
                </div>
              </section>

              <section className="rounded-lg border border-blush/45 bg-white p-4 shadow-sm">
                <h3 className="text-lg font-semibold text-ink">
                  Detalles del pedido
                </h3>
                <div className="mt-4">
                  {classicCake ? (
                    <div className="space-y-4">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <TextField
                          label="Fecha deseada"
                          value={date}
                          onChange={setDate}
                          type="date"
                        />
                        <TextField
                          label="Hora deseada"
                          value={time}
                          onChange={setTime}
                          type="time"
                        />
                      </div>
                      <TextField
                        label="Mensaje en la torta"
                        value={message}
                        onChange={setMessage}
                        placeholder="Ej. Feliz cumpleanos, Camila"
                      />
                      <TextAreaField
                        label="Informacion adicional"
                        value={additionalInfo}
                        onChange={setAdditionalInfo}
                        rows={3}
                        placeholder="Ej. sin nueces, mas fudge, escribir dedicatoria en tapa, referencias para la presentacion, etc."
                      />
                    </div>
                  ) : quantityProduct ? (
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="sm:col-span-2 grid gap-4 sm:grid-cols-2">
                        <TextField
                          label="Fecha deseada"
                          value={date}
                          onChange={setDate}
                          type="date"
                        />
                        <TextField
                          label="Hora deseada"
                          value={time}
                          onChange={setTime}
                          type="time"
                        />
                      </div>
                      <TextField
                        label={complementProduct ? "Detalle o texto" : "Mensaje o referencia"}
                        value={message}
                        onChange={setMessage}
                        placeholder={
                          complementProduct
                            ? "Ej. incluir con torta principal"
                            : "Ej. mariposas rosas o feliz cumple"
                        }
                      />
                      {!complementProduct && (
                        <>
                          <TextField
                            label="Tematica"
                            value={theme}
                            onChange={setTheme}
                            placeholder="Ej. mariposas, safari, princesa"
                          />
                          <TextField
                            label="Colores"
                            value={colorPalette}
                            onChange={setColorPalette}
                            placeholder="Ej. rosa pastel y lavanda"
                          />
                        </>
                      )}
                      <div className="sm:col-span-2">
                        <TextAreaField
                          label="Informacion adicional"
                          value={additionalInfo}
                          onChange={setAdditionalInfo}
                          rows={3}
                          placeholder={
                            complementProduct
                              ? "Ej. combinar con otro pedido, color disponible o alguna indicacion puntual."
                              : "Ej. referencia del diseno, empaque para regalo o alguna indicacion puntual."
                          }
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="grid gap-4 sm:grid-cols-2">
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
                      <TextField
                        label="Hora deseada"
                        value={time}
                        onChange={setTime}
                        type="time"
                      />
                      <div className="sm:col-span-2">
                        <TextAreaField
                          label="Informacion adicional"
                          value={additionalInfo}
                          onChange={setAdditionalInfo}
                          rows={3}
                          placeholder="Ej. topper especial, referencia del acabado, cambios en decoracion, indicaciones para la entrega, etc."
                        />
                      </div>
                    </div>
                  )}
                </div>
              </section>

              <section className="rounded-lg border border-blush/45 bg-white p-4 shadow-sm">
                <h3 className="text-lg font-semibold text-ink">
                  Entrega y precio final
                </h3>
                <div className="mt-4 space-y-4">
                  <DeliveryOptions delivery={delivery} onChange={setDelivery} />

                  <div className="rounded-[1.25rem] border border-blush/45 bg-blush/10 px-5 py-4">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                      <div>
                        <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-plum/75">
                          {finalPriceTitle}
                        </p>
                        <p className="mt-2 font-display text-3xl leading-none text-ink sm:text-4xl">
                          {finalPriceLabel}
                        </p>
                      </div>
                      <div className="space-y-1 text-sm leading-6 text-ink/62 sm:text-right">
                        <p>{delivery}</p>
                        {date && <p>Fecha: {date}</p>}
                        {time && <p>Hora: {time}</p>}
                      </div>
                    </div>
                  </div>

                  <div className="hidden rounded-lg border border-plum/20 bg-ink p-4 text-white shadow-soft">
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-blush">
                      <CalendarDays size={16} aria-hidden="true" />
                      Resumen para cotizar
                    </div>
                    <p className="mt-3 text-base leading-7 text-white/74">
                      {classicCake
                        ? `${product.name} · ${selectedSize}`
                        : quantityProduct
                          ? `${product.name} · ${
                              miniCake ? formatQuantityLabel(quantity) : `${quantity}`
                            } · ${selectedSize}`
                          : `${product.name} · ${selectedSize} · ${selectedFlavor} · ${selectedFilling}`}
                    </p>
                    <div className="mt-3 grid gap-x-5 gap-y-1 text-sm leading-6 sm:grid-cols-2">
                      {classicCake && (
                        <SummaryItem
                          label="Precio"
                          value={referenceValue}
                          strong
                        />
                      )}
                      {quantityProduct && (
                        <SummaryItem
                          label="Precio"
                          value={referenceValue}
                        />
                      )}
                      {quantityProduct && (
                        <SummaryItem
                          label="Cantidad"
                          value={miniCake ? formatQuantityLabel(quantity) : `${quantity}`}
                        />
                      )}
                      {quantityProduct && estimatedTotal !== null && (
                        <SummaryItem
                          label="Total referencial"
                          value={formatSoles(estimatedTotal)}
                          strong
                        />
                      )}
                      {personalizedCake && (
                        <SummaryItem
                          label={referenceLabel}
                          value={referenceValue}
                        />
                      )}
                      {personalizedCake && (
                        <SummaryItem
                          label="Adicionales"
                          value={formatSoles(totalSurcharge)}
                        />
                      )}
                      {personalizedCake && estimatedTotal !== null && (
                        <SummaryItem
                          label="Total referencial"
                          value={formatSoles(estimatedTotal)}
                          strong
                        />
                      )}
                      {date && (
                        <SummaryItem
                          label="Fecha deseada"
                          value={date}
                        />
                      )}
                      <SummaryItem label="Entrega" value={delivery} />
                    </div>
                  </div>

                  <a
                    href={getWhatsAppUrl(whatsappMessage)}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-md bg-ink px-6 py-3 text-base font-semibold text-white shadow-soft transition-colors duration-200 hover:bg-plum sm:w-auto"
                  >
                    <MessageCircle size={19} aria-hidden="true" />
                    Comprar
                  </a>
                </div>
              </section>
            </div>

            <div className="hidden">
              {activeConfigStep === 0 && (
                <>
                  {quantityProduct ? (
                    <section className="space-y-3">
                      <div className="rounded-lg border border-lavender/35 bg-lavender-light/55 p-4">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div>
                            <p className="text-sm font-semibold text-ink">
                              {selectedSize || product.servings}
                            </p>
                            <p className="mt-1 text-xs leading-5 text-ink/58">
                              {selectedPrice?.value ?? product.price ?? "Consultar"}
                            </p>
                            {product.dimensions && (
                              <p className="mt-1 text-xs leading-5 text-ink/52">
                                {product.dimensions}
                              </p>
                            )}
                          </div>
                          {miniCake && (
                            <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-plum">
                              Buttercream
                            </span>
                          )}
                        </div>
                      </div>

                      {!miniCake && (
                        <SelectField
                          label={complementProduct ? "Complemento o presentacion" : "Presentacion"}
                          name="size"
                          options={sizeOptions}
                          value={selectedSize}
                          onChange={setSelectedSize}
                        />
                      )}

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

                      {(hasFlavorSelection || hasFillingSelection) && !miniCake && (
                        <section className="border-t border-blush/25 pt-3">
                          <div
                            className={`grid gap-3 ${
                              hasFlavorSelection && hasFillingSelection
                                ? "sm:grid-cols-2"
                                : "sm:grid-cols-1"
                            }`}
                          >
                            {hasFlavorSelection && (
                              <SelectField
                                label="Sabor"
                                name="flavor"
                                options={flavorOptions}
                                value={selectedFlavor}
                                onChange={setSelectedFlavor}
                              />
                            )}
                            {hasFillingSelection && (
                              <SelectField
                                label="Relleno"
                                name="filling"
                                options={fillingOptions}
                                value={selectedFilling}
                                onChange={setSelectedFilling}
                              />
                            )}
                          </div>
                        </section>
                      )}
                    </section>
                  ) : (
                    <SelectField
                      label="Tamaño o porciones"
                      name="size"
                      options={sizeOptions}
                      value={selectedSize}
                      onChange={setSelectedSize}
                    />
                  )}

                  {personalizedCake && (
                    <section className="border-t border-blush/25 pt-3">
                      <div className="grid gap-3 sm:grid-cols-2">
                        <SelectField
                          label="Sabor de queque"
                          name="flavor"
                          options={flavorOptions}
                          value={selectedFlavor}
                          onChange={setSelectedFlavor}
                        />
                        <SelectField
                          label="Relleno"
                          name="filling"
                          options={fillingOptions}
                          value={selectedFilling}
                          onChange={setSelectedFilling}
                        />
                      </div>
                    </section>
                  )}
                </>
              )}

              {activeConfigStep === 1 && (
                <>
                  {classicCake ? (
                    <div className="space-y-3">
                      <TextField
                        label="Fecha deseada"
                        value={date}
                        onChange={setDate}
                        type="date"
                      />
                      <TextField
                        label="Mensaje en la torta"
                        value={message}
                        onChange={setMessage}
                        placeholder="Ej. Feliz cumpleaños, Camila"
                      />
                      <TextAreaField
                        label="Información adicional"
                        value={additionalInfo}
                        onChange={setAdditionalInfo}
                        rows={3}
                        placeholder="Ej. sin nueces, más fudge, escribir dedicatoria en tapa, referencias para la presentación, etc."
                      />
                    </div>
                  ) : quantityProduct ? (
                    <div className="grid gap-3 sm:grid-cols-2">
                      <TextField
                        label="Fecha deseada"
                        value={date}
                        onChange={setDate}
                        type="date"
                      />
                      <TextField
                        label={complementProduct ? "Detalle o texto" : "Mensaje o referencia"}
                        value={message}
                        onChange={setMessage}
                        placeholder={
                          complementProduct
                            ? "Ej. incluir con torta principal"
                            : "Ej. mariposas rosas o feliz cumple"
                        }
                      />
                      {!complementProduct && (
                        <>
                          <TextField
                            label="Tematica"
                            value={theme}
                            onChange={setTheme}
                            placeholder="Ej. mariposas, safari, princesa"
                          />
                          <TextField
                            label="Colores"
                            value={colorPalette}
                            onChange={setColorPalette}
                            placeholder="Ej. rosa pastel y lavanda"
                          />
                        </>
                      )}
                      <div className="sm:col-span-2">
                        <TextAreaField
                          label="Información adicional"
                          value={additionalInfo}
                          onChange={setAdditionalInfo}
                          rows={2}
                          placeholder={
                            complementProduct
                              ? "Ej. combinar con otro pedido, color disponible o alguna indicacion puntual."
                              : "Ej. referencia del diseno, empaque para regalo o alguna indicacion puntual."
                          }
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="grid gap-3 sm:grid-cols-2">
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
                      <div className="sm:col-span-2">
                        <TextAreaField
                          label="Información adicional"
                          value={additionalInfo}
                          onChange={setAdditionalInfo}
                          rows={2}
                          placeholder="Ej. topper especial, referencia del acabado, cambios en decoración, indicaciones para la entrega, etc."
                        />
                      </div>
                    </div>
                  )}
                </>
              )}

              {activeConfigStep === 2 && (
                <>
                  <section aria-labelledby="delivery-group-title">
                    <h3
                      id="delivery-group-title"
                      className="mb-3 text-sm font-semibold text-ink"
                    >
                      Entrega
                    </h3>
                    <DeliveryOptions delivery={delivery} onChange={setDelivery} />
                  </section>

                  <div className="rounded-lg border border-plum/20 bg-ink p-4 text-white shadow-soft">
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-blush">
                      <CalendarDays size={16} aria-hidden="true" />
                      Resumen para cotizar
                    </div>
                    <p className="mt-3 text-sm leading-6 text-white/72">
                      {classicCake
                        ? `${product.name} · ${selectedSize}`
                        : quantityProduct
                          ? `${product.name} · ${
                              miniCake ? formatQuantityLabel(quantity) : `${quantity}`
                            } · ${selectedSize}`
                          : `${product.name} · ${selectedSize} · ${selectedFlavor} · ${selectedFilling}`}
                    </p>
                    <div className="mt-3 grid gap-x-5 gap-y-1 text-sm leading-6 sm:grid-cols-2">
                      {classicCake && (
                        <SummaryItem
                          label="Precio"
                          value={referenceValue}
                          strong
                        />
                      )}
                      {quantityProduct && (
                        <SummaryItem
                          label="Precio"
                          value={referenceValue}
                        />
                      )}
                      {quantityProduct && (
                        <SummaryItem
                          label="Cantidad"
                          value={miniCake ? formatQuantityLabel(quantity) : `${quantity}`}
                        />
                      )}
                      {quantityProduct && estimatedTotal !== null && (
                        <SummaryItem
                          label="Total referencial"
                          value={formatSoles(estimatedTotal)}
                          strong
                        />
                      )}
                      {personalizedCake && (
                        <SummaryItem
                          label={referenceLabel}
                          value={referenceValue}
                        />
                      )}
                      {personalizedCake && (
                        <SummaryItem
                          label="Adicionales"
                          value={formatSoles(totalSurcharge)}
                        />
                      )}
                      {personalizedCake && estimatedTotal !== null && (
                        <SummaryItem
                          label="Total referencial"
                          value={formatSoles(estimatedTotal)}
                          strong
                        />
                      )}
                      {date && (
                        <SummaryItem
                          label="Fecha deseada"
                          value={date}
                        />
                      )}
                      <SummaryItem label="Entrega" value={delivery} />
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="hidden">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="button"
                  onClick={goToPreviousConfigStep}
                  disabled={activeConfigStep === 0}
                  className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-md border px-4 text-sm font-semibold transition-colors duration-200 ${
                    activeConfigStep === 0
                      ? "cursor-not-allowed border-lavender/20 bg-cream/50 text-ink/35"
                      : "border-lavender/45 bg-white text-ink hover:border-plum/50 hover:text-plum"
                  }`}
                >
                  <ArrowLeft size={17} aria-hidden="true" />
                  Anterior
                </button>

                <span className="text-center text-xs font-semibold uppercase tracking-[0.14em] text-ink/45">
                  Paso {activeConfigStep + 1} de {configSteps.length}
                </span>

                {isLastConfigStep ? (
                  <a
                    href={getWhatsAppUrl(whatsappMessage)}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-ink px-6 py-3 text-sm font-semibold text-white shadow-soft transition-colors duration-200 hover:bg-plum"
                  >
                    <MessageCircle size={18} aria-hidden="true" />
                    Comprar
                  </a>
                ) : (
                  <button
                    type="button"
                    onClick={goToNextConfigStep}
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-ink px-6 py-3 text-sm font-semibold text-white shadow-soft transition-colors duration-200 hover:bg-plum"
                  >
                    Siguiente
                    <ArrowRight size={18} aria-hidden="true" />
                  </button>
                )}
              </div>
            </div>
          </section>
        </div>

      </div>

      <SizeGuideModal
        isOpen={isSizeGuideOpen}
        onClose={() => setIsSizeGuideOpen(false)}
      />
    </section>
  );
}
