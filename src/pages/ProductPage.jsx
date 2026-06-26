import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
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

function getProductId(path) {
  return Number(path.replace("/producto/", ""));
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

function OptionGroup({ title, icon: Icon, options, value, onChange, name }) {
  return (
    <fieldset className="rounded-lg border border-blush/45 bg-white p-5 shadow-sm">
      <legend className="flex items-center gap-3 px-1 text-sm font-semibold text-ink">
        <span className="grid h-10 w-10 place-items-center rounded-full bg-blush/45 text-plum">
          <Icon size={19} aria-hidden="true" />
        </span>
        {title}
      </legend>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {options.map((option) => {
          const optionValue = option.label ?? option;
          const isSelected = value === optionValue;

          return (
            <label
              key={optionValue}
              className={`flex min-h-14 cursor-pointer items-start gap-3 rounded-lg border p-3 ${
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
              <span>
                <span className="block text-sm font-semibold">{optionValue}</span>
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
    </fieldset>
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

export default function ProductPage({ currentPath }) {
  const productId = getProductId(currentPath);
  const product = products.find((item) => item.id === productId);

  const sizeOptions = useMemo(() => getSizeOptions(product), [product]);
  const flavorOptions = product?.flavors?.length ? product.flavors : cakeFlavors;
  const fillingOptions = product?.fillings?.length ? product.fillings : fillingFlavors;

  const [selectedSize, setSelectedSize] = useState(sizeOptions[0]?.label ?? "");
  const [selectedFlavor, setSelectedFlavor] = useState(flavorOptions[0] ?? "");
  const [selectedFilling, setSelectedFilling] = useState(fillingOptions[0] ?? "");
  const [theme, setTheme] = useState("");
  const [colorPalette, setColorPalette] = useState("");
  const [message, setMessage] = useState("");
  const [delivery, setDelivery] = useState("Recojo coordinado");
  const [date, setDate] = useState("");

  useEffect(() => {
    setSelectedSize(sizeOptions[0]?.label ?? "");
    setSelectedFlavor(flavorOptions[0] ?? "");
    setSelectedFilling(fillingOptions[0] ?? "");
    setTheme("");
    setColorPalette("");
    setMessage("");
    setDelivery("Recojo coordinado");
    setDate("");
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
  const whatsappMessage = [
    `Hola, vengo de la página web de Bake Me Happy. Quisiera cotizar: ${product.name}.`,
    `Tamaño: ${selectedSize}${selectedPrice?.value ? ` (${selectedPrice.value})` : ""}.`,
    `Sabor de queque: ${selectedFlavor}.`,
    `Relleno: ${selectedFilling}.`,
    theme ? `Temática: ${theme}.` : null,
    colorPalette ? `Colores: ${colorPalette}.` : null,
    message ? `Mensaje en la torta: ${message}.` : null,
    date ? `Fecha deseada: ${date}.` : null,
    `Entrega: ${delivery}.`,
  ]
    .filter(Boolean)
    .join("\n");

  return (
    <section className="bg-cream pb-20 pt-28 sm:pb-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <a
          href="#/catalogo"
          className="inline-flex min-h-11 items-center gap-2 rounded-full border border-lavender/45 bg-white px-4 text-sm font-semibold text-ink"
        >
          <ArrowLeft size={17} aria-hidden="true" />
          Volver al catálogo
        </a>

        <div className="mt-6 grid gap-8 lg:grid-cols-[0.86fr_1.14fr] lg:items-start">
          <aside className="overflow-hidden rounded-lg border border-blush/50 bg-white shadow-soft lg:sticky lg:top-28">
            <div className="relative aspect-[4/3] overflow-hidden bg-blush/20">
              <img
                src={product.image}
                alt={`${product.name} de Bake Me Happy`}
                className="h-full w-full scale-[1.62] object-cover"
                style={{ objectPosition: product.imagePosition }}
                width="900"
                height="675"
              />
              <span className="absolute left-4 top-4 rounded-full bg-white/92 px-3 py-1.5 text-xs font-semibold text-plum shadow-sm">
                {product.category}
              </span>
            </div>

            <div className="p-5 sm:p-6">
              <span className="text-xs font-semibold uppercase tracking-[0.14em] text-plum">
                Configura tu pedido
              </span>
              <h1 className="mt-2 font-display text-4xl leading-tight text-ink">
                {product.name}
              </h1>
              <p className="mt-4 text-sm leading-6 text-ink/68">{product.details}</p>

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
          </aside>

          <div className="space-y-5">
            <div className="rounded-lg border border-lavender/40 bg-lavender-light/65 p-5">
              <div className="flex gap-3">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white text-plum shadow-sm">
                  <Heart size={20} aria-hidden="true" />
                </span>
                <div>
                  <h2 className="font-display text-3xl text-ink">
                    Elige las características
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-ink/66">
                    Estas opciones se enviarán por WhatsApp para confirmar
                    disponibilidad, precio final y forma de entrega.
                  </p>
                </div>
              </div>
            </div>

            <OptionGroup
              title="Tamaño o porciones"
              icon={Ruler}
              name="size"
              options={sizeOptions}
              value={selectedSize}
              onChange={setSelectedSize}
            />
            <OptionGroup
              title="Sabor de queque"
              icon={CakeSlice}
              name="flavor"
              options={flavorOptions}
              value={selectedFlavor}
              onChange={setSelectedFlavor}
            />
            <OptionGroup
              title="Relleno"
              icon={Check}
              name="filling"
              options={fillingOptions}
              value={selectedFilling}
              onChange={setSelectedFilling}
            />

            <div className="rounded-lg border border-blush/45 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-blush/45 text-plum">
                  <Palette size={19} aria-hidden="true" />
                </span>
                <h2 className="text-sm font-semibold text-ink">
                  Diseño y personalización
                </h2>
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
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
              </div>
            </div>

            <fieldset className="rounded-lg border border-blush/45 bg-white p-5 shadow-sm">
              <legend className="flex items-center gap-3 px-1 text-sm font-semibold text-ink">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-blush/45 text-plum">
                  <Truck size={19} aria-hidden="true" />
                </span>
                Entrega
              </legend>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
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
            </fieldset>

            <div className="rounded-lg border border-plum/20 bg-ink p-5 text-white shadow-soft">
              <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-center">
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-blush">
                    <CalendarDays size={16} aria-hidden="true" />
                    Resumen para cotizar
                  </div>
                  <p className="mt-3 text-sm leading-6 text-white/72">
                    {product.name} · {selectedSize} · {selectedFlavor} ·{" "}
                    {selectedFilling}
                  </p>
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
      </div>
    </section>
  );
}
