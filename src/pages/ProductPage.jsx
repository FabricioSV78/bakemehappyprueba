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
        className="mt-2 min-h-11 w-full rounded-md border border-lavender/45 bg-white px-4 text-sm font-medium text-ink outline-none placeholder:text-ink/35 focus:border-plum"
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

function DeliveryOptions({ delivery, onChange }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {["Recojo coordinado", "Delivery previa coordinación"].map((option) => (
        <label
          key={option}
          className={`flex min-h-12 cursor-pointer items-center gap-3 rounded-lg border p-3 ${
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
  const selectedDetail =
    typeof selectedOption === "object"
      ? selectedOption.value ?? selectedOption.helper
      : null;

  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-[0.12em] text-ink/48">
        {label}
      </span>
      <select
        name={name}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 min-h-11 w-full rounded-md border border-lavender/45 bg-white px-4 text-sm font-semibold text-ink outline-none focus:border-plum"
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
      <p className="mt-2 text-xs leading-5 text-ink/55">
        {selectedSurcharge > 0
          ? `Adicional ${formatSoles(selectedSurcharge)}`
          : "Incluido"}
        {selectedDetail ? ` · ${selectedDetail}` : ""}
      </p>
    </label>
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

export default function ProductPage({ currentPath }) {
  const productId = getProductId(currentPath);
  const product = products.find((item) => item.id === productId);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const classicCake = isClassicCake(product);
  const personalizedCake = isPersonalizedCake(product);
  const miniCake = isMiniCake(product);

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
  const configSteps = miniCake
    ? [
        {
          label: "Formato",
          title: "Formato y cantidad",
          description: "Confirma el formato mini y cuántas unidades deseas.",
          icon: CakeSlice,
        },
        {
          label: "Datos",
          title: "Mensaje y fecha",
          description: "Agrega dedicatoria, fecha e indicaciones puntuales.",
          icon: Palette,
        },
        {
          label: "Entrega",
          title: "Entrega y resumen",
          description: "Elige cómo recibirlo y envía tu selección por WhatsApp.",
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

        <div className="mt-6 grid w-full min-w-0 grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <aside className="w-full min-w-0 space-y-5">
            <section
              data-product-card="true"
              className="w-full min-w-0 overflow-hidden rounded-lg border border-blush/50 bg-white shadow-soft"
            >
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

          </aside>

          <section
            data-config-card="true"
            className="min-w-0 overflow-hidden rounded-lg border border-blush/45 bg-white shadow-soft lg:self-start"
          >
            <div className="border-b border-lavender/30 bg-lavender-light/70 p-3 sm:p-4">
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

            <div className="space-y-3 p-4">
              {activeConfigStep === 0 && (
                <>
                  {miniCake ? (
                    <section className="space-y-3">
                      <div className="rounded-lg border border-lavender/35 bg-lavender-light/55 p-4">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div>
                            <p className="text-sm font-semibold text-ink">
                              {product.servings}
                            </p>
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
                            Buttercream
                          </span>
                        </div>
                      </div>

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

                  {!classicCake && !miniCake && (
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
                    <div className="grid gap-3">
                      <TextAreaField
                        label="Información adicional"
                        value={additionalInfo}
                        onChange={setAdditionalInfo}
                        rows={2}
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
                    <div className="grid gap-3 sm:grid-cols-2">
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
                      <div className="sm:col-span-2">
                        <TextAreaField
                          label="Información adicional"
                          value={additionalInfo}
                          onChange={setAdditionalInfo}
                          rows={2}
                          placeholder="Ej. color disponible, pedido para regalo, horario de entrega o alguna indicación puntual."
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
                  </div>
                </>
              )}
            </div>

            <div className="border-t border-blush/30 bg-white px-4 py-3">
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
                    Enviar selección
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
