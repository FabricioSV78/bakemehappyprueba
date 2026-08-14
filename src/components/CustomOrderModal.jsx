import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import {
  Camera,
  CakeSlice,
  FileText,
  LoaderCircle,
  MessageCircle,
  Palette,
  Ruler,
  Truck,
  X,
} from "lucide-react";
import { getWhatsAppUrl } from "../data/site";
import { cakeFlavors, fillingFlavors, sizeGuide } from "../data/products";
import { DateTimeFields } from "./product-detail/ProductFormFields";
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

const DELIVERY_OPTIONS = [
  { value: "Recojo coordinado", label: "Recojo" },
  { value: "Delivery previa coordinación", label: "Delivery" },
];

const MAX_REFERENCE_FILE_BYTES = 8 * 1024 * 1024;
const ACCEPTED_REFERENCE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

function getOptionValue(option) {
  return option?.label ?? option ?? "";
}

function formatDate(date) {
  if (!date) return "";

  const [year, month, day] = date.split("-");
  return `${day}/${month}/${year}`;
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

function buildPricedOptions(options) {
  return options.map((option) => ({
    ...option,
    helper: option.surcharge ? `Adicional S/ ${option.surcharge}` : "",
  }));
}

function FieldLabel({ children, icon: Icon, optional = false }) {
  return (
    <span className="flex items-center gap-2 text-sm font-semibold text-ink/72">
      {Icon && <Icon size={16} className="shrink-0 text-plum" aria-hidden="true" />}
      <span>{children}</span>
      {optional && (
        <span className="text-xs font-normal text-ink/45">(opcional)</span>
      )}
    </span>
  );
}

function TextInput({
  label,
  icon,
  value,
  onChange,
  type = "text",
  placeholder,
  optional = false,
  required = false,
  min,
}) {
  return (
    <label className="grid content-start gap-1.5">
      <FieldLabel icon={icon} optional={optional}>
        {label}
      </FieldLabel>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        required={required}
        min={min}
        className="min-h-12 w-full rounded-xl border border-blush/35 bg-white px-4 text-base font-medium text-ink outline-none placeholder:text-ink/35 focus:border-plum/45 focus:ring-4 focus:ring-plum/10"
      />
    </label>
  );
}

function SelectInput({ label, icon, value, onChange, options }) {
  const selectedOption = options.find((option) => getOptionValue(option) === value);

  return (
    <label className="grid content-start gap-1.5">
      <FieldLabel icon={icon}>{label}</FieldLabel>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="min-h-12 w-full rounded-xl border border-blush/35 bg-white px-4 text-base font-semibold text-ink outline-none focus:border-plum/45 focus:ring-4 focus:ring-plum/10"
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

function TextAreaInput({ label, value, onChange, placeholder, optional = false }) {
  return (
    <label className="grid content-start gap-1.5">
      <FieldLabel icon={FileText} optional={optional}>
        {label}
      </FieldLabel>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        rows={3}
        className="w-full rounded-xl border border-blush/35 bg-white px-4 py-3 text-base font-medium leading-6 text-ink outline-none placeholder:text-ink/35 focus:border-plum/45 focus:ring-4 focus:ring-plum/10"
      />
    </label>
  );
}

function FormSection({ step, title, children }) {
  return (
    <section className="rounded-2xl border border-blush/30 bg-white p-4 shadow-sm sm:p-5">
      <div className="mb-4 flex items-center gap-2.5">
        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-blush/35 text-sm font-bold text-plum">
          {step}
        </span>
        <h3 className="text-base font-semibold text-ink">{title}</h3>
      </div>
      {children}
    </section>
  );
}

function formatFileSize(bytes) {
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function ReferenceUpload({ file, onChange, error }) {
  return (
    <div className="grid gap-2 rounded-xl border border-dashed border-blush/40 bg-blush/10 p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <FieldLabel icon={Camera} optional>
          Foto de referencia
        </FieldLabel>
        <label
          htmlFor="custom-order-reference"
          className="inline-flex min-h-10 cursor-pointer items-center justify-center rounded-full border border-blush/30 bg-white px-4 text-sm font-semibold text-ink shadow-sm transition-colors hover:border-plum/35 hover:text-plum"
        >
          Elegir imagen
        </label>
      </div>
      <p className="text-sm leading-5 text-ink/58">
        JPG, PNG o WebP (máx. 8 MB). Enlace privado por 24 horas.
      </p>
      <input
        id="custom-order-reference"
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="sr-only"
        onChange={(event) => {
          onChange(event.target.files?.[0] ?? null);
          event.target.value = "";
        }}
      />
      {file && (
        <div
          className="flex min-w-0 items-center justify-between gap-3"
          aria-live="polite"
        >
          <p className="min-w-0 truncate text-sm font-semibold text-plum">
            {file.name}{" "}
            <span className="font-normal text-ink/50">
              ({formatFileSize(file.size)})
            </span>
          </p>
          <button
            type="button"
            className="shrink-0 text-sm font-semibold text-ink/60 underline decoration-blush underline-offset-4 hover:text-plum"
            onClick={() => onChange(null)}
          >
            Quitar
          </button>
        </div>
      )}
      {error && (
        <p className="text-sm font-semibold text-red-700" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

function DeliveryOptions({ value, onChange }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {DELIVERY_OPTIONS.map((option) => (
        <label
          key={option.value}
          className={`flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 transition-colors duration-200 ${
            value === option.value
              ? "border-plum/30 bg-plum/10 shadow-sm"
              : "border-blush/30 bg-white hover:border-plum/20"
          }`}
        >
          <input
            type="radio"
            name="custom-order-delivery"
            value={option.value}
            checked={value === option.value}
            onChange={() => onChange(option.value)}
            className="h-4 w-4 accent-plum"
          />
          <span className="text-sm font-semibold text-ink">{option.label}</span>
        </label>
      ))}
    </div>
  );
}

export default function CustomOrderModal({ isOpen, onClose }) {
  const sizeOptions = useMemo(buildSizeOptions, []);
  const flavorOptions = useMemo(() => buildPricedOptions(cakeFlavors), []);
  const fillingOptions = useMemo(() => buildPricedOptions(fillingFlavors), []);
  const [form, setForm] = useState({
    ...INITIAL_FORM,
    size: sizeOptions[0]?.label ?? "",
    flavor: getOptionValue(flavorOptions[0]),
    filling: getOptionValue(fillingOptions[0]),
  });
  const [referenceFile, setReferenceFile] = useState(null);
  const [uploadError, setUploadError] = useState("");
  const [scheduleError, setScheduleError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) return undefined;

    const handleKeyDown = (event) => {
      if (
        event.key === "Escape" &&
        !document.querySelector("[data-date-time-popover]")
      ) {
        onClose();
      }
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

  const buildWhatsAppMessage = (temporaryPhotoUrl = "") => {
    const lines = [
      "Hola, quisiera cotizar una torta personalizada desde la web de Bake Me Happy.",
      `Tamaño: ${form.size}.`,
      `Sabor: ${form.flavor}.`,
      `Relleno: ${form.filling}.`,
      form.occasion ? `Temática: ${form.occasion}.` : null,
      form.colors ? `Colores: ${form.colors}.` : null,
      form.message ? `Mensaje en la torta: ${form.message}.` : null,
      form.date ? `Fecha: ${formatDate(form.date)}.` : null,
      form.time ? `Hora: ${form.time}.` : null,
      `Entrega: ${form.delivery}.`,
      temporaryPhotoUrl
        ? `Foto de referencia (enlace disponible por 24 horas): ${temporaryPhotoUrl}`
        : null,
      form.details ? `Notas: ${form.details}.` : null,
    ];

    return lines.filter(Boolean).join("\n");
  };

  const handleReferenceChange = (file) => {
    setUploadError("");

    if (!file) {
      setReferenceFile(null);
      return;
    }

    if (!ACCEPTED_REFERENCE_TYPES.has(file.type)) {
      setReferenceFile(null);
      setUploadError("Elige una imagen JPG, PNG o WebP.");
      return;
    }

    if (file.size <= 0 || file.size > MAX_REFERENCE_FILE_BYTES) {
      setReferenceFile(null);
      setUploadError("La imagen debe pesar menos de 8 MB.");
      return;
    }

    setReferenceFile(file);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setUploadError("");

    if (!form.date || !form.time) {
      setScheduleError("Selecciona la fecha y la hora de entrega.");
      return;
    }

    setScheduleError("");
    setIsSubmitting(true);

    let whatsappWindow = null;
    if (referenceFile) {
      whatsappWindow = window.open("about:blank", "bake-me-happy-whatsapp");
      if (whatsappWindow) {
        whatsappWindow.opener = null;
        whatsappWindow.document.title = "Preparando pedido...";
      }
    }

    try {
      let temporaryPhotoUrl = "";

      if (referenceFile) {
        const uploadData = new FormData();
        uploadData.append("photo", referenceFile);
        const response = await fetch("/api/uploads", {
          method: "POST",
          body: uploadData,
          headers: { Accept: "application/json" },
        });
        const result = await response.json().catch(() => ({}));

        if (!response.ok || !result.url) {
          throw new Error(
            result.error || "No se pudo subir la foto. Inténtalo nuevamente.",
          );
        }

        temporaryPhotoUrl = result.url;
      }

      const whatsappUrl = getWhatsAppUrl(
        buildWhatsAppMessage(temporaryPhotoUrl),
      );
      if (whatsappWindow) {
        whatsappWindow.location.replace(whatsappUrl);
      } else if (referenceFile) {
        window.location.assign(whatsappUrl);
      } else {
        window.open(whatsappUrl, "_blank", "noopener,noreferrer");
      }
    } catch (error) {
      whatsappWindow?.close();
      setUploadError(
        error instanceof Error ? error.message : "No se pudo subir la foto.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

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
        className="modal-panel-enter relative grid max-h-[calc(100dvh-2rem)] w-full max-w-[1420px] overflow-y-auto rounded-[1.75rem] bg-[#FFF8F4] shadow-lift sm:max-h-[calc(100dvh-3rem)] lg:h-[min(50rem,calc(100dvh-4rem))] lg:grid-cols-[minmax(0,0.98fr)_minmax(25rem,0.82fr)] lg:overflow-hidden"
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

        <div className="order-2 border-t border-blush/25 bg-cream/80 lg:order-none lg:col-start-1 lg:row-start-1 lg:h-full lg:overflow-y-auto lg:border-b-0 lg:border-r lg:border-t-0">
          <SizeGuideContent className="lg:!px-5 lg:!pb-6 lg:!pt-9" />
        </div>

        <div className="order-1 p-5 pt-14 sm:p-7 sm:pt-14 lg:order-none lg:col-start-2 lg:row-start-1 lg:h-full lg:overflow-y-auto lg:p-7 lg:pt-8">
          <header className="border-b border-blush/25 pb-5 pr-12">
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-plum">
              Pedido personalizado
            </p>
            <h2
              id="custom-order-title"
              className="mt-1.5 font-display text-3xl leading-tight text-ink sm:text-4xl"
            >
              Diseña tu torta
            </h2>
            <p className="mt-2 text-sm leading-6 text-ink/62 sm:text-base">
              Completa los datos y envía tu solicitud por WhatsApp.
            </p>
          </header>

          <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
            <FormSection step="1" title="Elige la base">
              <div className="grid gap-4">
                <SelectInput
                  label="Tamaño y porciones"
                  icon={Ruler}
                  options={sizeOptions}
                  value={form.size}
                  onChange={(value) => updateField("size", value)}
                />
                <div className="grid items-start gap-4 sm:grid-cols-2">
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
                </div>
              </div>
            </FormSection>

            <FormSection step="2" title="Personaliza el diseño">
              <ReferenceUpload
                file={referenceFile}
                onChange={handleReferenceChange}
                error={uploadError}
              />

              <div className="mt-4 grid items-start gap-4 sm:grid-cols-2">
                <TextInput
                  label="Ocasión o temática"
                  icon={CakeSlice}
                  value={form.occasion}
                  onChange={(value) => updateField("occasion", value)}
                  placeholder="Ej. cumpleaños con mariposas"
                  required
                />
                <TextInput
                  label="Colores"
                  icon={Palette}
                  value={form.colors}
                  onChange={(value) => updateField("colors", value)}
                  placeholder="Ej. rosado y dorado"
                  optional
                />
                <div className="sm:col-span-2">
                  <TextInput
                    label="Mensaje en la torta"
                    icon={MessageCircle}
                    value={form.message}
                    onChange={(value) => updateField("message", value)}
                    placeholder="Ej. Feliz cumpleaños, Valeria"
                    optional
                  />
                </div>
              </div>

              <div className="mt-4">
                <TextAreaInput
                  label="Notas importantes"
                  value={form.details}
                  onChange={(value) => updateField("details", value)}
                  placeholder="Alergias, cambios o indicaciones importantes."
                  optional
                />
              </div>
            </FormSection>

            <FormSection step="3" title="Fecha y entrega">
              <DateTimeFields
                date={form.date}
                time={form.time}
                popoverPlacement="top"
                onDateChange={(value) => {
                  updateField("date", value);
                  setScheduleError("");
                }}
                onTimeChange={(value) => {
                  updateField("time", value);
                  setScheduleError("");
                }}
              />
              {scheduleError && (
                <p className="mt-2 text-sm font-semibold text-red-700" role="alert">
                  {scheduleError}
                </p>
              )}

              <div className="mt-4 grid gap-2">
                <FieldLabel icon={Truck}>Modalidad</FieldLabel>
                <DeliveryOptions
                  value={form.delivery}
                  onChange={(value) => updateField("delivery", value)}
                />
              </div>
            </FormSection>

            <button
              type="submit"
              className="button-primary w-full justify-center disabled:cursor-wait disabled:opacity-70"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <LoaderCircle
                  className="animate-spin"
                  size={19}
                  aria-hidden="true"
                />
              ) : (
                <MessageCircle size={19} aria-hidden="true" />
              )}
              {isSubmitting
                ? "Subiendo foto..."
                : "Solicitar cotización"}
            </button>
          </form>
        </div>
      </section>
    </div>,
    document.body,
  );
}
