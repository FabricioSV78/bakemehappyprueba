import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import {
  CalendarDays,
  Camera,
  CakeSlice,
  Clock,
  MessageCircle,
  Palette,
  Ruler,
  Truck,
  X,
} from "lucide-react";
import { getWhatsAppUrl } from "../data/site";
import { cakeFlavors, fillingFlavors, sizeGuide } from "../data/products";
import { SizeGuideContent } from "./SizeGuideModal";

const INITIAL_FORM = {
  size: "",
  flavor: "",
  filling: "",
  date: "",
  time: "",
  occasion: "",
  colors: "",
  message: "",
  delivery: "Recojo coordinado",
  details: "",
};

function getOptionValue(option) {
  return option?.label ?? option ?? "";
}

function buildSizeOptions() {
  const oneTier = sizeGuide.oneTier.map((size) => ({
    label: `1 piso - ${size.name} (${size.portions})`,
    helper: size.dimensions,
  }));
  const twoTiers = sizeGuide.twoTiers.map((size) => ({
    label: `2 pisos - ${size.name} (${size.portions})`,
    helper: size.dimensions,
  }));
  const special = sizeGuide.special.map((size) => ({
    label: `${size.name} (${size.portions})`,
    helper: size.dimensions,
  }));

  return [...oneTier, ...twoTiers, ...special];
}

function FieldLabel({ children, icon: Icon }) {
  return (
    <span className="flex items-center gap-2 text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-ink/55">
      {Icon && <Icon size={15} className="text-plum" aria-hidden="true" />}
      {children}
    </span>
  );
}

function TextInput({ label, icon, value, onChange, type = "text", placeholder }) {
  return (
    <label className="grid gap-2">
      <FieldLabel icon={icon}>{label}</FieldLabel>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="min-h-12 w-full rounded-xl border border-blush/55 bg-white px-4 text-base font-medium text-ink outline-none placeholder:text-ink/35 focus:border-plum/60 focus:ring-4 focus:ring-blush/30"
      />
    </label>
  );
}

function SelectInput({ label, icon, value, onChange, options }) {
  const selectedOption = options.find((option) => getOptionValue(option) === value);

  return (
    <label className="grid gap-2">
      <FieldLabel icon={icon}>{label}</FieldLabel>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="min-h-12 w-full rounded-xl border border-blush/55 bg-white px-4 text-base font-semibold text-ink outline-none focus:border-plum/60 focus:ring-4 focus:ring-blush/30"
      >
        {options.map((option) => {
          const optionValue = getOptionValue(option);

          return (
            <option key={optionValue} value={optionValue}>
              {optionValue}
            </option>
          );
        })}
      </select>
      {selectedOption?.helper && (
        <p className="text-sm leading-5 text-ink/55">{selectedOption.helper}</p>
      )}
    </label>
  );
}

function TextAreaInput({ label, value, onChange, placeholder }) {
  return (
    <label className="grid gap-2">
      <FieldLabel icon={Palette}>{label}</FieldLabel>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        rows={4}
        className="w-full rounded-xl border border-blush/55 bg-white px-4 py-3 text-base font-medium leading-7 text-ink outline-none placeholder:text-ink/35 focus:border-plum/60 focus:ring-4 focus:ring-blush/30"
      />
    </label>
  );
}

function DeliveryOptions({ value, onChange }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {["Recojo coordinado", "Delivery previa coordinacion"].map((option) => (
        <label
          key={option}
          className={`flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 transition-colors duration-200 ${
            value === option
              ? "border-plum/45 bg-blush/15 shadow-sm"
              : "border-blush/50 bg-white hover:border-plum/25"
          }`}
        >
          <input
            type="radio"
            name="custom-order-delivery"
            value={option}
            checked={value === option}
            onChange={() => onChange(option)}
            className="h-4 w-4 accent-plum"
          />
          <span className="text-sm font-semibold text-ink">{option}</span>
        </label>
      ))}
    </div>
  );
}

export default function CustomOrderModal({ isOpen, onClose }) {
  const sizeOptions = useMemo(buildSizeOptions, []);
  const flavorOptions = useMemo(
    () => cakeFlavors.map((flavor) => ({ ...flavor, helper: flavor.helper })),
    [],
  );
  const fillingOptions = useMemo(
    () => fillingFlavors.map((filling) => ({ ...filling, helper: filling.helper })),
    [],
  );
  const [form, setForm] = useState({
    ...INITIAL_FORM,
    size: sizeOptions[0]?.label ?? "",
    flavor: getOptionValue(flavorOptions[0]),
    filling: getOptionValue(fillingOptions[0]),
  });
  const [referenceFileName, setReferenceFileName] = useState("");

  useEffect(() => {
    if (!isOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  const updateField = (field, value) => {
    setForm((currentForm) => ({ ...currentForm, [field]: value }));
  };

  const whatsappMessage = useMemo(() => {
    const lines = [
      "Hola, vengo de la pagina web de Bake Me Happy. Quisiera cotizar una torta personalizada.",
      `Tamano/pisos: ${form.size}.`,
      `Sabor: ${form.flavor}.`,
      `Relleno: ${form.filling}.`,
      form.occasion ? `Ocasion o tematica: ${form.occasion}.` : null,
      form.colors ? `Colores de referencia: ${form.colors}.` : null,
      form.message ? `Mensaje en la torta: ${form.message}.` : null,
      form.date ? `Fecha deseada: ${form.date}.` : null,
      form.time ? `Hora deseada: ${form.time}.` : null,
      `Entrega: ${form.delivery}.`,
      referenceFileName
        ? `Foto de referencia: adjuntare por WhatsApp el archivo "${referenceFileName}".`
        : "Foto de referencia: pendiente de adjuntar por WhatsApp.",
      form.details ? `Detalles adicionales: ${form.details}.` : null,
    ];

    return lines.filter(Boolean).join("\n");
  }, [form, referenceFileName]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center bg-ink/65 p-4 backdrop-blur-sm sm:p-6 lg:p-8"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        className="relative grid max-h-[calc(100dvh-2rem)] w-full max-w-[1420px] overflow-y-auto rounded-[1.75rem] bg-[#fffdfc] shadow-lift sm:max-h-[calc(100dvh-3rem)] lg:h-[min(50rem,calc(100dvh-4rem))] lg:grid-cols-[minmax(0,0.98fr)_minmax(25rem,0.82fr)] lg:overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="custom-order-title"
      >
        <button
          type="button"
          className="absolute right-3 top-3 z-30 grid h-11 w-11 place-items-center rounded-full bg-white/95 text-ink shadow-sm transition-colors hover:text-plum sm:right-4 sm:top-4"
          onClick={onClose}
          aria-label="Cerrar formulario de pedido"
        >
          <X size={20} aria-hidden="true" />
        </button>

        <div className="border-b border-blush/35 bg-cream/80 lg:h-full lg:overflow-y-auto lg:border-b-0 lg:border-r">
          <SizeGuideContent className="lg:!px-5 lg:!pb-6 lg:!pt-9" />
        </div>

        <div className="p-5 pt-14 sm:p-7 sm:pt-16 lg:h-full lg:overflow-y-auto lg:p-8 lg:pt-10">
          <div className="rounded-[1.4rem] border border-blush/45 bg-white p-4 shadow-sm sm:p-5">
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-plum">
              Pedido personalizado
            </p>
            <h2
              id="custom-order-title"
              className="mt-2 font-display text-3xl leading-tight text-ink sm:text-4xl"
            >
              Detalla tu torta ideal
            </h2>
            <p className="mt-2 text-sm leading-6 text-ink/62 sm:text-base">
              Completa lo esencial y lo revisamos por WhatsApp para confirmar
              disponibilidad, precio final y entrega.
            </p>
          </div>

          <form className="mt-5 space-y-5">
            <label className="grid gap-2 rounded-[1.25rem] border border-dashed border-blush/65 bg-blush/10 p-4">
              <FieldLabel icon={Camera}>Foto de referencia</FieldLabel>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm leading-6 text-ink/58">
                  Sube una imagen guía. El nombre se enviara en el mensaje y
                  podras adjuntarla en WhatsApp.
                </p>
                <span className="inline-flex min-h-11 shrink-0 cursor-pointer items-center justify-center rounded-full border border-blush/55 bg-white px-4 text-sm font-semibold text-ink shadow-sm transition-colors hover:border-plum/45 hover:text-plum">
                  Elegir imagen
                </span>
              </div>
              <input
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={(event) =>
                  setReferenceFileName(event.target.files?.[0]?.name ?? "")
                }
              />
              {referenceFileName && (
                <p className="text-sm font-semibold text-plum">
                  Imagen seleccionada: {referenceFileName}
                </p>
              )}
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <SelectInput
                label="Tamano (pisos)"
                icon={Ruler}
                options={sizeOptions}
                value={form.size}
                onChange={(value) => updateField("size", value)}
              />
              <TextInput
                label="Ocasion o tematica"
                icon={CakeSlice}
                value={form.occasion}
                onChange={(value) => updateField("occasion", value)}
                placeholder="Ej. mariposas, safari, flores"
              />
              <SelectInput
                label="Sabor"
                icon={CakeSlice}
                options={flavorOptions}
                value={form.flavor}
                onChange={(value) => updateField("flavor", value)}
              />
              <SelectInput
                label="Relleno"
                icon={CakeSlice}
                options={fillingOptions}
                value={form.filling}
                onChange={(value) => updateField("filling", value)}
              />
              <TextInput
                label="Fecha"
                icon={CalendarDays}
                type="date"
                value={form.date}
                onChange={(value) => updateField("date", value)}
              />
              <TextInput
                label="Hora"
                icon={Clock}
                type="time"
                value={form.time}
                onChange={(value) => updateField("time", value)}
              />
              <TextInput
                label="Colores"
                icon={Palette}
                value={form.colors}
                onChange={(value) => updateField("colors", value)}
                placeholder="Ej. rosado pastel y dorado"
              />
              <TextInput
                label="Mensaje en torta"
                icon={Palette}
                value={form.message}
                onChange={(value) => updateField("message", value)}
                placeholder="Ej. Feliz cumple, Valeria"
              />
            </div>

            <section className="grid gap-3">
              <FieldLabel icon={Truck}>Entrega</FieldLabel>
              <DeliveryOptions
                value={form.delivery}
                onChange={(value) => updateField("delivery", value)}
              />
            </section>

            <TextAreaInput
              label="Detalles adicionales"
              value={form.details}
              onChange={(value) => updateField("details", value)}
              placeholder="Cuéntanos cambios de diseño, dedicatoria, alergias, referencias, colores exactos o cualquier detalle importante."
            />

            <a
              href={getWhatsAppUrl(whatsappMessage)}
              target="_blank"
              rel="noreferrer"
              className="button-primary w-full justify-center sm:w-auto"
            >
              <MessageCircle size={19} aria-hidden="true" />
              Enviar detalle por WhatsApp
            </a>
          </form>
        </div>
      </section>
    </div>,
    document.body,
  );
}
