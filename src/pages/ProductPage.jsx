import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  CakeSlice,
  Check,
  Clock,
  Heart,
  MessageCircle,
  Minus,
  Palette,
  Plus,
  Ruler,
  Truck,
} from "lucide-react";
import { getWhatsAppUrl } from "../data/site";
import { cakeFlavors, fillingFlavors, products, sizeGuide } from "../data/products";
import Reveal from "../components/Reveal";
import SizeGuideModal from "../components/SizeGuideModal";

const EMPTY_OPTIONS = [];
const DETAIL_CONTAINER_CLASS =
  "mx-auto w-full max-w-[1660px] px-5 sm:px-8 2xl:px-12";
const FORM_FIELD_STACK_CLASS = "grid min-w-0 content-start gap-2";
const FORM_FIELD_LABEL_CLASS =
  "text-sm font-semibold leading-5 text-ink/72";
const CALENDAR_WEEKDAYS = ["Lu", "Ma", "Mi", "Ju", "Vi", "Sa", "Do"];
const CALENDAR_MONTHS = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];
const OPENING_HOUR = 9;
const CLOSING_HOUR = 22;
const CUSTOM_TIME_HOURS = Array.from(
  { length: CLOSING_HOUR - OPENING_HOUR + 1 },
  (_, index) => String(OPENING_HOUR + index).padStart(2, "0"),
);
const CUSTOM_TIME_MINUTES = Array.from({ length: 60 }, (_, index) =>
  String(index).padStart(2, "0"),
);

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
  if (product?.preparationTime) return product.preparationTime;

  const preparationByCategory = {
    "Tortas clasicas": "2 a 3 dias habiles",
    "Tortas tematicas": "24 horas",
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

function getPortionKey(value) {
  const [, amount] = value?.match(/(\d+)/) ?? [];
  return amount ?? "";
}

function parseLocalDate(value) {
  if (!value) return null;

  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return null;
  return new Date(year, month - 1, day);
}

function getLocalDateValue(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatDisplayDate(value) {
  const date = parseLocalDate(value);
  if (!date) return "";

  return new Intl.DateTimeFormat("es-PE", {
    weekday: "short",
    day: "numeric",
    month: "long",
  }).format(date);
}

function formatDisplayTime(value) {
  if (!value) return "";

  const [rawHours, minutes] = value.split(":");
  const hours = Number(rawHours);
  const period = hours < 12 ? "a. m." : "p. m.";
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${minutes} ${period}`;
}

function useDismissiblePopover(isOpen, onClose, containerRef) {
  useEffect(() => {
    if (!isOpen) return undefined;

    const handlePointerDown = (event) => {
      if (!containerRef.current?.contains(event.target)) onClose();
    };
    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [containerRef, isOpen, onClose]);
}

function getGuideLabel(size) {
  return `${size.portions} - ${size.name}`;
}

function findPriceByLabel(prices, label) {
  const labelKey = getPortionKey(label);

  return prices.find((price) => {
    if (price.label.toLowerCase() === label.toLowerCase()) return true;
    return labelKey && getPortionKey(price.label) === labelKey;
  });
}

function getSizeOptions(product) {
  const productName = product?.name.toLowerCase() ?? "";
  const prices = getPriceOptions(product);

  if (productName.includes("two")) {
    return sizeGuide.twoTiers.map((size) => ({
      label: getGuideLabel(size),
      value: findPriceByLabel(prices, size.name)?.value ?? "Consultar",
      helper: size.dimensions,
    }));
  }

  if (productName.includes("tiny")) {
    const tinySize = sizeGuide.special.find(
      (size) => size.name.toLowerCase() === "tiny cake",
    );

    if (tinySize) {
      return [
        {
          label: getGuideLabel(tinySize),
          value: product?.price ?? "Consultar",
          helper: tinySize.dimensions,
        },
      ];
    }
  }

  if (product?.category === "Tortas tematicas") {
    return prices.map((price) => {
      const normalizedLabel = price.label.toLowerCase();
      const isHeartCake =
        productName.includes("heart") ||
        productName.includes("corazon") ||
        productName.includes("corazón");
      const matchingSize = normalizedLabel.includes("tiny")
        ? sizeGuide.special.find(
            (size) => size.name.toLowerCase() === "tiny cake",
          )
        : isHeartCake
          ? sizeGuide.special.find(
              (size) =>
                size.name.toLowerCase().includes("corazon") &&
                getPortionKey(size.portions) === getPortionKey(price.label),
            )
          : sizeGuide.oneTier.find(
              (size) =>
                getPortionKey(size.portions) === getPortionKey(price.label),
            );

      return {
        label: matchingSize ? getGuideLabel(matchingSize) : price.label,
        value: price.value,
        helper: matchingSize?.dimensions ?? "Precio base",
      };
    });
  }

  return prices.map((size) => ({
    label: size.label,
    value: size.value,
    helper: "Precio base",
  }));
}

function TextField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  columnsClassName = "",
}) {
  return (
    <label className={`${FORM_FIELD_STACK_CLASS} ${columnsClassName}`}>
      <span className={FORM_FIELD_LABEL_CLASS}>{label}</span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="min-h-12 w-full rounded-lg border border-blush/35 bg-white px-4 text-base font-medium text-ink outline-none placeholder:text-ink/35 focus:border-plum/45 focus:ring-4 focus:ring-plum/10"
      />
    </label>
  );
}

function DatePickerField({ value, onChange, label = "Fecha de entrega" }) {
  const selectedDate = parseLocalDate(value);
  const [isOpen, setIsOpen] = useState(false);
  const [viewDate, setViewDate] = useState(() => {
    const initialDate = selectedDate ?? new Date();
    return new Date(initialDate.getFullYear(), initialDate.getMonth(), 1);
  });
  const containerRef = useRef(null);
  const todayValue = getLocalDateValue();

  useDismissiblePopover(isOpen, () => setIsOpen(false), containerRef);

  useEffect(() => {
    const nextSelectedDate = parseLocalDate(value);
    if (!nextSelectedDate) return;
    setViewDate(
      new Date(
        nextSelectedDate.getFullYear(),
        nextSelectedDate.getMonth(),
        1,
      ),
    );
  }, [value]);

  const calendarDays = useMemo(() => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const mondayOffset = (firstDay.getDay() + 6) % 7;

    return Array.from(
      { length: 42 },
      (_, index) => new Date(year, month, 1 - mondayOffset + index),
    );
  }, [viewDate]);

  const changeMonth = (offset) => {
    setViewDate(
      (current) =>
        new Date(current.getFullYear(), current.getMonth() + offset, 1),
    );
  };

  const selectDate = (dateValue) => {
    onChange(dateValue);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className={`relative ${FORM_FIELD_STACK_CLASS}`}>
      <span className={FORM_FIELD_LABEL_CLASS}>{label}</span>
      <button
        type="button"
        className={`flex min-h-12 w-full items-center gap-3 rounded-lg border bg-white px-4 text-left outline-none transition-colors focus:border-plum/45 focus:ring-4 focus:ring-plum/10 ${
          isOpen ? "border-plum/40 ring-4 ring-plum/10" : "border-blush/35"
        }`}
        onClick={() => setIsOpen((current) => !current)}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
      >
        <CalendarDays size={18} className="shrink-0 text-plum" aria-hidden="true" />
        <span
          className={`min-w-0 flex-1 truncate text-base font-medium ${
            value ? "capitalize text-ink" : "text-ink/40"
          }`}
        >
          {value ? formatDisplayDate(value) : "Selecciona una fecha"}
        </span>
      </button>

      {isOpen && (
        <div
          className="absolute left-0 top-[calc(100%+0.6rem)] z-[70] w-[min(20rem,calc(100vw-3rem))] rounded-2xl border border-blush/25 bg-white p-4 shadow-lift"
          role="dialog"
          aria-label="Seleccionar fecha de entrega"
        >
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              className="grid h-10 w-10 place-items-center rounded-full border border-blush/25 text-ink transition-colors hover:bg-cream"
              onClick={() => changeMonth(-1)}
              aria-label="Mes anterior"
            >
              <ArrowLeft size={17} aria-hidden="true" />
            </button>
            <p className="text-sm font-semibold text-ink">
              {CALENDAR_MONTHS[viewDate.getMonth()]} {viewDate.getFullYear()}
            </p>
            <button
              type="button"
              className="grid h-10 w-10 place-items-center rounded-full border border-blush/25 text-ink transition-colors hover:bg-cream"
              onClick={() => changeMonth(1)}
              aria-label="Mes siguiente"
            >
              <ArrowRight size={17} aria-hidden="true" />
            </button>
          </div>

          <div className="mt-4 grid grid-cols-7 gap-1 text-center">
            {CALENDAR_WEEKDAYS.map((weekday) => (
              <span
                key={weekday}
                className="py-1 text-[0.68rem] font-semibold uppercase tracking-wide text-plum/70"
              >
                {weekday}
              </span>
            ))}

            {calendarDays.map((calendarDate) => {
              const dateValue = getLocalDateValue(calendarDate);
              const isSelected = dateValue === value;
              const isToday = dateValue === todayValue;
              const isCurrentMonth =
                calendarDate.getMonth() === viewDate.getMonth();
              const isPast = dateValue < todayValue;

              return (
                <button
                  key={dateValue}
                  type="button"
                  className={`grid aspect-square min-h-9 place-items-center rounded-full text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-20 disabled:hover:bg-transparent ${
                    isSelected
                      ? "bg-ink text-white shadow-sm"
                      : isToday
                        ? "bg-blush/20 font-semibold text-plum"
                        : "text-ink hover:bg-lavender-light"
                  } ${isCurrentMonth ? "" : "opacity-35"}`}
                  onClick={() => selectDate(dateValue)}
                  disabled={isPast}
                  aria-current={isToday ? "date" : undefined}
                  aria-pressed={isSelected}
                >
                  {calendarDate.getDate()}
                </button>
              );
            })}
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-blush/20 pt-3">
            <button
              type="button"
              className="text-xs font-semibold text-ink/55 hover:text-plum disabled:opacity-35"
              onClick={() => onChange("")}
              disabled={!value}
            >
              Limpiar
            </button>
            <button
              type="button"
              className="rounded-full bg-lavender-light px-4 py-2 text-xs font-semibold text-plum"
              onClick={() => selectDate(todayValue)}
            >
              Elegir hoy
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function TimePickerField({ value, onChange, label = "Hora" }) {
  const [isOpen, setIsOpen] = useState(false);
  const [customHour, setCustomHour] = useState(() => {
    const [selectedHour] = (value || "").split(":");
    return CUSTOM_TIME_HOURS.includes(selectedHour)
      ? selectedHour
      : String(OPENING_HOUR).padStart(2, "0");
  });
  const [customMinute, setCustomMinute] = useState(() => {
    const [, selectedMinute] = (value || "").split(":");
    return CUSTOM_TIME_MINUTES.includes(selectedMinute)
      ? selectedMinute
      : "00";
  });
  const containerRef = useRef(null);

  useDismissiblePopover(isOpen, () => setIsOpen(false), containerRef);

  const selectTime = (timeValue) => {
    onChange(timeValue);
    setIsOpen(false);
  };

  const togglePicker = () => {
    if (!isOpen && value) {
      const [selectedHour, selectedMinute] = value.split(":");

      if (CUSTOM_TIME_HOURS.includes(selectedHour)) {
        setCustomHour(selectedHour);
        setCustomMinute(
          selectedHour === String(CLOSING_HOUR)
            ? "00"
            : CUSTOM_TIME_MINUTES.includes(selectedMinute)
              ? selectedMinute
              : "00",
        );
      }
    }

    setIsOpen((current) => !current);
  };

  const availableMinutes =
    customHour === String(CLOSING_HOUR) ? ["00"] : CUSTOM_TIME_MINUTES;
  const customTime = `${customHour}:${
    customHour === String(CLOSING_HOUR) ? "00" : customMinute
  }`;

  return (
    <div ref={containerRef} className={`relative ${FORM_FIELD_STACK_CLASS}`}>
      <span className={FORM_FIELD_LABEL_CLASS}>{label}</span>
      <button
        type="button"
        className={`flex min-h-12 w-full items-center gap-3 rounded-lg border bg-white px-4 text-left outline-none transition-colors focus:border-plum/45 focus:ring-4 focus:ring-plum/10 ${
          isOpen ? "border-plum/40 ring-4 ring-plum/10" : "border-blush/35"
        }`}
        onClick={togglePicker}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
      >
        <Clock size={18} className="shrink-0 text-plum" aria-hidden="true" />
        <span
          className={`min-w-0 flex-1 truncate text-base font-medium ${
            value ? "text-ink" : "text-ink/40"
          }`}
        >
          {value ? formatDisplayTime(value) : "Selecciona una hora"}
        </span>
      </button>

      {isOpen && (
        <div
          className="fixed inset-x-4 bottom-4 z-[70] max-h-[calc(100dvh-2rem)] overflow-y-auto rounded-2xl border border-blush/25 bg-white p-4 shadow-lift sm:absolute sm:inset-x-auto sm:bottom-auto sm:left-auto sm:right-0 sm:top-[calc(100%+0.6rem)] sm:w-[22rem] sm:max-h-[min(34rem,calc(100vh-2rem))]"
          role="dialog"
          aria-label="Seleccionar hora de entrega"
        >
          <div className="flex items-center gap-2 border-b border-blush/20 pb-3">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-lavender-light text-plum">
              <Clock size={17} aria-hidden="true" />
            </span>
            <div>
              <p className="text-sm font-semibold text-ink">Hora deseada</p>
              <p className="text-xs text-ink/55">
                Atención de 9:00 a. m. a 10:00 p. m.
              </p>
            </div>
          </div>

          <div className="pt-4">
            <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-end gap-2">
              <label className="grid min-w-0 gap-1.5">
                <span className="text-xs font-medium text-ink/60">Hora</span>
                <select
                  value={customHour}
                  className="min-h-11 min-w-0 rounded-lg border border-blush/30 bg-white px-3 text-sm font-semibold text-ink outline-none focus:border-plum/45 focus:ring-4 focus:ring-plum/10"
                  onChange={(event) => {
                    const nextHour = event.target.value;
                    setCustomHour(nextHour);
                    if (nextHour === String(CLOSING_HOUR)) {
                      setCustomMinute("00");
                    }
                  }}
                  aria-label="Hora específica"
                >
                  {CUSTOM_TIME_HOURS.map((hour) => (
                    <option key={hour} value={hour}>
                      {formatDisplayTime(`${hour}:00`)}
                    </option>
                  ))}
                </select>
              </label>

              <span className="pb-3 text-base font-bold text-ink/45" aria-hidden="true">
                :
              </span>

              <label className="grid min-w-0 gap-1.5">
                <span className="text-xs font-medium text-ink/60">Minutos</span>
                <select
                  value={
                    customHour === String(CLOSING_HOUR) ? "00" : customMinute
                  }
                  className="min-h-11 min-w-0 rounded-lg border border-blush/30 bg-white px-3 text-sm font-semibold text-ink outline-none focus:border-plum/45 focus:ring-4 focus:ring-plum/10"
                  onChange={(event) => setCustomMinute(event.target.value)}
                  aria-label="Minutos específicos"
                >
                  {availableMinutes.map((minute) => (
                    <option key={minute} value={minute}>
                      {minute}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <button
              type="button"
              className="mt-3 min-h-11 w-full rounded-lg bg-ink px-4 text-sm font-semibold text-white transition-colors hover:bg-plum focus:outline-none focus:ring-4 focus:ring-plum/15"
              onClick={() => selectTime(customTime)}
            >
              Usar {formatDisplayTime(customTime)}
            </button>
          </div>

          <div className="mt-3 flex justify-end">
            <button
              type="button"
              className="text-xs font-semibold text-ink/55 hover:text-plum disabled:opacity-35"
              onClick={() => {
                onChange("");
                setIsOpen(false);
              }}
              disabled={!value}
            >
              Limpiar hora
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function DateTimeFields({ date, time, onDateChange, onTimeChange }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <DatePickerField value={date} onChange={onDateChange} />
      <TimePickerField value={time} onChange={onTimeChange} />
    </div>
  );
}

function QuantityControls({
  label = "Cantidad",
  value,
  onChange,
  min = 1,
  max = 99,
  className = "",
}) {
  const numericValue = Math.min(
    max,
    Math.max(min, Number.parseInt(value, 10) || min),
  );
  const updateQuantity = (nextValue) => {
    onChange(Math.min(max, Math.max(min, nextValue)));
  };

  return (
    <div
      className={`inline-flex min-h-12 w-fit items-center gap-4 text-ink ${className}`}
      role="group"
      aria-label={label}
    >
      <button
        type="button"
        onClick={() => updateQuantity(numericValue - 1)}
        disabled={numericValue <= min}
        aria-label={`Restar ${label.toLowerCase()}`}
        className="grid h-9 w-9 place-items-center rounded-full border border-blush/30 bg-white text-ink transition-colors hover:border-plum/30 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <Minus size={15} aria-hidden="true" />
      </button>
      <span className="min-w-10 text-center text-base font-semibold text-ink">
        {numericValue}
      </span>
      <button
        type="button"
        onClick={() => updateQuantity(numericValue + 1)}
        disabled={numericValue >= max}
        aria-label={`Agregar ${label.toLowerCase()}`}
        className="grid h-9 w-9 place-items-center rounded-full border border-blush/30 bg-white text-ink transition-colors hover:border-plum/30 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <Plus size={15} aria-hidden="true" />
      </button>
    </div>
  );
}

function QuantityField({
  label = "Cantidad",
  value,
  onChange,
  min = 1,
  max = 99,
  columnsClassName = "",
}) {
  return (
    <div className={`${FORM_FIELD_STACK_CLASS} ${columnsClassName}`}>
      <span className={FORM_FIELD_LABEL_CLASS}>{label}</span>
      <QuantityControls
        label={label}
        value={value}
        onChange={onChange}
        min={min}
        max={max}
      />
    </div>
  );
}

function TextAreaField({ label, value, onChange, placeholder, rows = 4 }) {
  return (
    <label className={FORM_FIELD_STACK_CLASS}>
      <span className={FORM_FIELD_LABEL_CLASS}>{label}</span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full rounded-lg border border-blush/35 bg-white px-4 py-3 text-base font-medium leading-7 text-ink outline-none placeholder:text-ink/35 focus:border-plum/45 focus:ring-4 focus:ring-plum/10"
      />
    </label>
  );
}

function DeliveryOptions({ delivery, onChange }) {
  const options = [
    { value: "Recojo coordinado", label: "Recojo" },
    {
      value: "Delivery previa coordinación",
      label: "Delivery",
    },
  ];

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {options.map((option) => (
        <label
          key={option.value}
          className={`flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 transition-colors duration-200 ${
            delivery === option.value
              ? "border-plum/45 bg-blush/15 shadow-sm"
              : "border-blush/30 bg-white hover:border-plum/20"
          }`}
        >
          <input
            type="radio"
            name="delivery"
            value={option.value}
            checked={delivery === option.value}
            onChange={() => onChange(option.value)}
            className="h-4 w-4 accent-plum"
          />
          <span className="text-sm font-semibold text-ink">{option.label}</span>
        </label>
      ))}
    </div>
  );
}

function GiftCandleOptions({ value, onChange }) {
  return (
    <fieldset className="min-w-0 border-0 p-0">
      <legend className={FORM_FIELD_LABEL_CLASS}>
        ¿Deseas una velita de regalo?
      </legend>
      <div className="mt-2 grid gap-3 sm:grid-cols-2">
        {["Si", "No"].map((option) => (
          <label
            key={option}
            className={`flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 transition-colors duration-200 ${
              value === option
                ? "border-plum/45 bg-blush/15 shadow-sm"
                : "border-blush/30 bg-white hover:border-plum/20"
            }`}
          >
            <input
              type="radio"
              name="gift-candle"
              value={option}
              checked={value === option}
              onChange={() => onChange(option)}
              className="h-4 w-4 accent-plum"
            />
            <span className="text-sm font-semibold text-ink">{option}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function ClassicSizeOptionsField({ value, onChange, options }) {
  return (
    <fieldset className="min-w-0 border-0 p-0">
      <legend className={FORM_FIELD_LABEL_CLASS}>Tamaño</legend>
      <div className="mt-2 grid gap-3 sm:grid-cols-2">
        {options.map((option) => {
          const optionValue = getOptionValue(option);
          const isSelected = value === optionValue;
          const optionPrice =
            typeof option === "object" ? option.value ?? option.helper : null;

          return (
            <label
              key={optionValue}
              className={`flex cursor-pointer items-start gap-3 rounded-xl border px-4 py-3 transition-colors duration-200 ${
                isSelected
                  ? "border-plum/45 bg-blush/15 shadow-sm"
                  : "border-blush/30 bg-white hover:border-plum/20"
              }`}
            >
              <input
                type="radio"
                name="classic-size"
                value={optionValue}
                checked={isSelected}
                onChange={() => onChange(optionValue)}
                className="mt-1 h-4 w-4 shrink-0 accent-plum"
              />
              <span className="min-w-0">
                <span className="block text-base font-semibold text-ink">
                  {optionValue}
                </span>
                {optionPrice && (
                  <span className="mt-1 block text-sm text-ink/58">
                    {optionPrice}
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

function getSelectHelper(options, value) {
  const selectedOption = options.find(
    (option) => getOptionValue(option) === value,
  );
  const selectedSurcharge =
    typeof selectedOption === "object" ? selectedOption.surcharge ?? 0 : 0;
  const selectedDetailValue =
    typeof selectedOption === "object"
      ? selectedOption.value ?? selectedOption.helper
      : null;

  if (selectedSurcharge > 0) return `Adicional ${formatSoles(selectedSurcharge)}`;
  if (selectedDetailValue && /s\/|consultar/i.test(selectedDetailValue)) {
    return selectedDetailValue;
  }

  return null;
}

function SelectInput({ name, value, onChange, options, className = "" }) {
  return (
    <select
      name={name}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className={`min-h-12 w-full rounded-lg border border-blush/35 bg-white px-4 text-base font-semibold text-ink outline-none focus:border-plum/45 focus:ring-4 focus:ring-plum/10 ${className}`}
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
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
  name,
  columnsClassName = "",
}) {
  const selectedHelper = getSelectHelper(options, value);

  return (
    <label className={`${FORM_FIELD_STACK_CLASS} ${columnsClassName}`}>
      <span className={FORM_FIELD_LABEL_CLASS}>{label}</span>
      <SelectInput
        name={name}
        value={value}
        onChange={onChange}
        options={options}
      />
      {selectedHelper && (
        <p className="text-sm leading-5 text-ink/55">{selectedHelper}</p>
      )}
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

function getComplementOptions(currentProductId) {
  return products.filter(
    (item) => item.category === "Complementos" && item.id !== currentProductId,
  );
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

        <div className="relative order-1 aspect-square w-full max-w-[620px] justify-self-center overflow-hidden rounded-[2.5rem] bg-[radial-gradient(circle_at_50%_45%,#fff_0%,#FFF0E8_62%,#F5DDE8_100%)] sm:order-2 xl:max-w-[660px]">
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

function ComplementAddOns({ options, selectedItems, onQuantityChange }) {
  if (!options.length) return null;

  return (
    <section className="mt-5 rounded-lg border border-blush/30 bg-white/75 p-4 shadow-sm">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-base font-semibold text-ink">Complementos</h2>
          <p className="text-sm leading-6 text-ink/58">
            Agrega velitas o topper a tu pedido.
          </p>
        </div>
      </div>

      <div className="mt-4 grid gap-3">
        {options.map((option) => {
          const quantity = selectedItems[option.id] ?? 0;
          const isSelected = quantity > 0;

          return (
            <div
              key={option.id}
              className={`grid gap-3 rounded-lg border px-3 py-3 transition-colors sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center ${
                isSelected
                  ? "border-plum/40 bg-blush/15"
                  : "border-blush/30 bg-white"
              }`}
            >
              <div className="flex min-w-0 items-center gap-3">
                <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-blush/35 bg-cream">
                  <img
                    src={option.image}
                    alt={option.name}
                    className="h-full w-full object-cover"
                    style={{
                      objectPosition: option.imagePosition ?? "center",
                    }}
                    loading="lazy"
                    width="96"
                    height="96"
                  />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-ink">
                    {option.name}
                  </p>
                  <p className="mt-0.5 text-sm text-ink/58">
                    {option.price}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 justify-self-start sm:justify-self-end">
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
    </section>
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
                : "border-blush/25 bg-white/55 text-ink/62 hover:border-plum/30 hover:bg-white"
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
  const complementOptions = useMemo(
    () => getComplementOptions(productId),
    [productId],
  );
  const hasFlavorSelection = !classicCake && !complementProduct && flavorOptions.length > 0;
  const hasFillingSelection =
    !classicCake && !complementProduct && fillingOptions.length > 0;
  const showComplementAddOns =
    (classicCake || personalizedCake || miniCake) && complementOptions.length > 0;
  const showGiftCandleOption = classicCake || personalizedCake || miniCake;

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
  const [giftCandle, setGiftCandle] = useState("No");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [selectedComplements, setSelectedComplements] = useState({});
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
    setGiftCandle("No");
    setDate("");
    setTime("");
    setQuantity(1);
    setSelectedComplements({});
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
  const selectedComplementItems = complementOptions
    .map((option) => ({
      ...option,
      quantity: selectedComplements[option.id] ?? 0,
      amount: getCurrencyAmount(option.price),
    }))
    .filter((option) => option.quantity > 0);
  const complementsTotal = selectedComplementItems.reduce(
    (total, option) =>
      option.amount !== null ? total + option.amount * option.quantity : total,
    0,
  );
  const hasComplementsTotal = complementsTotal > 0;
  const orderTotal =
    estimatedTotal !== null ? estimatedTotal + complementsTotal : estimatedTotal;
  const finalPriceLabel =
    orderTotal !== null
      ? formatSoles(orderTotal)
      : referenceValue;
  const finalPriceTitle =
    quantityProduct || personalizedCake ? "Total estimado" : "Total";
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

  function updateComplementQuantity(complementId, nextQuantity) {
    const normalizedQuantity = Math.max(
      0,
      Math.min(9, Number.parseInt(nextQuantity, 10) || 0),
    );

    setSelectedComplements((currentComplements) => {
      const nextComplements = { ...currentComplements };

      if (normalizedQuantity === 0) {
        delete nextComplements[complementId];
      } else {
        nextComplements[complementId] = normalizedQuantity;
      }

      return nextComplements;
    });
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
    additionalInfo ? `Información adicional: ${additionalInfo}.` : null,
    showGiftCandleOption ? `Velita de regalo: ${giftCandle}.` : null,
    selectedComplementItems.length
      ? `Complementos: ${selectedComplementItems
          .map(
            (item) =>
              `${item.name} x${item.quantity}${
                item.price ? ` (${item.price})` : ""
              }`,
          )
          .join(", ")}.`
      : null,
    hasComplementsTotal && orderTotal !== null
      ? `Total estimado con complementos: ${formatSoles(orderTotal)}.`
      : null,
    message ? `Mensaje en la torta: ${message}.` : null,
    date ? `Fecha deseada: ${formatDisplayDate(date)}.` : null,
    time ? `Hora deseada: ${formatDisplayTime(time)}.` : null,
    `Entrega: ${delivery}.`,
  ]
    .filter(Boolean)
    .join("\n");

  return (
    <section className="overflow-x-hidden bg-cream pb-20 pt-32 sm:pb-28 lg:pt-40">
      <div className={DETAIL_CONTAINER_CLASS}>
        <a
          href="#/tienda"
          className="relative z-10 inline-flex min-h-11 items-center gap-2 rounded-full border border-lavender/30 bg-white px-4 text-sm font-semibold text-ink shadow-sm transition-colors hover:border-plum/45 hover:text-plum"
        >
          <ArrowLeft size={17} aria-hidden="true" />
          Volver a la tienda
        </a>

        <div className="mt-6 grid w-full min-w-0 grid-cols-[minmax(0,1fr)] gap-8 lg:grid-cols-2 lg:items-start">
          <Reveal
            as="aside"
            direction="left"
            className="w-full min-w-0 self-start"
          >
            <ProductGallery
              product={product}
              activeIndex={activeGalleryIndex}
              onSelect={setActiveGalleryIndex}
            />

            {showComplementAddOns && (
              <ComplementAddOns
                options={complementOptions}
                selectedItems={selectedComplements}
                onQuantityChange={updateComplementQuantity}
              />
            )}

          </Reveal>

          <Reveal
            as="section"
            direction="right"
            delay={80}
            data-config-card="true"
            className="min-w-0 self-start rounded-lg border border-blush/30 bg-white shadow-soft"
          >
            <div className="rounded-t-lg border-b border-blush/30 bg-[linear-gradient(135deg,#FFF4ED_0%,#ECEEFC_100%)] p-5 sm:p-7">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
                <div className="min-w-0">
                  <span className="text-xs font-semibold uppercase tracking-[0.16em] text-plum">
                    {product.category}
                  </span>
                  <h1 className="mt-1.5 font-display text-4xl leading-tight text-ink sm:text-5xl">
                    {product.name}
                  </h1>
                  <p className="mt-2.5 inline-flex items-center gap-2 text-sm font-semibold text-ink/65">
                    <CalendarDays size={16} aria-hidden="true" />
                    Listo en {preparationTime}
                  </p>
                </div>

                <div className="shrink-0 sm:min-w-44 sm:text-right">
                  <p className="text-2xl font-semibold tracking-[-0.02em] text-plum/85 sm:text-3xl">
                    {startingPriceLabel}
                  </p>
                </div>
              </div>

              <p className="mt-4 max-w-3xl text-base leading-7 text-ink/68">
                {product.details}
              </p>

              {(product.prices?.length ?? 0) > 0 && (
                <div
                  className="mt-4 flex flex-wrap gap-2"
                  aria-label="Tamaños y precios disponibles"
                >
                  {product.prices.map((priceOption) => (
                    <span
                      key={priceOption}
                      className="rounded-full border border-blush/30 bg-white/75 px-3.5 py-1.5 text-sm font-semibold text-ink/72"
                    >
                      {priceOption}
                    </span>
                  ))}
                </div>
              )}

              {miniCake && (
                <div className="mt-5 rounded-md border border-blush/30 bg-white/70 px-4 py-3 text-sm leading-6 text-ink/68">
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

            <div className="space-y-6 rounded-b-lg bg-white p-5 sm:p-7">
              <header className="border-b border-blush/35 pb-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h2 className="font-display text-3xl leading-tight text-ink sm:text-4xl">
                      Configura tu pedido
                    </h2>
                    <p className="mt-1.5 text-sm leading-6 text-ink/62 sm:text-base">
                      Elige tus opciones y envía el pedido por WhatsApp.
                    </p>
                  </div>

                  {personalizedCake && (
                    <button
                      type="button"
                      className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-full border border-blush/30 bg-cream/45 px-4 text-sm font-semibold text-ink transition-colors duration-200 hover:border-plum/35 hover:text-plum"
                      onClick={() => setIsSizeGuideOpen(true)}
                    >
                      <Ruler size={17} aria-hidden="true" />
                      Guía de tamaños
                    </button>
                  )}
                </div>
              </header>

              <section className="rounded-xl border border-blush/25 bg-cream/20 p-5 sm:p-6">
                <h3 className="text-lg font-semibold text-ink">
                  1. Elige tus opciones
                </h3>
                <div className="mt-5 space-y-5">
                  {quantityProduct ? (
                    <>
                      {!biteProduct && (
                        <div className="rounded-lg border border-blush/30 bg-blush/10 p-4">
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
                      )}

                      {biteProduct ? (
                        <div className="grid gap-y-4">
                          <div className="grid items-start gap-4 sm:grid-cols-[minmax(0,1fr)_auto]">
                            <label className={FORM_FIELD_STACK_CLASS}>
                              <span className={FORM_FIELD_LABEL_CLASS}>
                                Presentación
                              </span>
                              <SelectInput
                                name="size"
                                options={sizeOptions}
                                value={selectedSize}
                                onChange={setSelectedSize}
                              />
                              {getSelectHelper(sizeOptions, selectedSize) && (
                                <span className="text-sm leading-5 text-ink/55">
                                  {getSelectHelper(sizeOptions, selectedSize)}
                                </span>
                              )}
                            </label>
                            <div className={FORM_FIELD_STACK_CLASS}>
                              <span className={FORM_FIELD_LABEL_CLASS}>
                                Cantidad
                              </span>
                              <QuantityControls
                                value={quantity}
                                onChange={setQuantity}
                              />
                            </div>
                          </div>
                          {hasFlavorSelection && (
                            <SelectField
                              label="Sabor"
                              name="flavor"
                              options={flavorOptions}
                              value={selectedFlavor}
                              onChange={setSelectedFlavor}
                            />
                          )}
                        </div>
                      ) : (
                        <>
                          {!miniCake && (
                            <SelectField
                              label="Presentación"
                              name="size"
                              options={sizeOptions}
                              value={selectedSize}
                              onChange={setSelectedSize}
                            />
                          )}

                          <QuantityField
                            value={quantity}
                            onChange={setQuantity}
                          />
                        </>
                      )}

                      {(hasFlavorSelection || hasFillingSelection) && !miniCake && !biteProduct && (
                        <div
                          className={`grid items-start gap-4 ${
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
                    personalizedCake ? (
                      <div className="space-y-5">
                        <div
                          className={`grid items-start gap-4 ${
                            hasFillingSelection ? "sm:grid-cols-2" : "sm:grid-cols-1"
                          }`}
                        >
                          <SelectField
                            label="Tamaño"
                            name="size"
                            options={sizeOptions}
                            value={selectedSize}
                            onChange={setSelectedSize}
                          />
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

                        {hasFlavorSelection && (
                          <SelectField
                            label="Sabor"
                            name="flavor"
                            options={flavorOptions}
                            value={selectedFlavor}
                            onChange={setSelectedFlavor}
                          />
                        )}
                      </div>
                    ) : classicCake ? (
                      <ClassicSizeOptionsField
                        value={selectedSize}
                        onChange={setSelectedSize}
                        options={sizeOptions}
                      />
                    ) : (
                      <SelectField
                        label="Tamaño"
                        name="size"
                        options={sizeOptions}
                        value={selectedSize}
                        onChange={setSelectedSize}
                      />
                    )
                  )}
                </div>
              </section>

              <section className="rounded-xl border border-blush/25 bg-cream/20 p-5 sm:p-6">
                <h3 className="text-lg font-semibold text-ink">
                  2. Datos del pedido
                </h3>
                <div className="mt-5">
                  {classicCake ? (
                    <div className="space-y-4">
                      <DateTimeFields
                        date={date}
                        time={time}
                        onDateChange={setDate}
                        onTimeChange={setTime}
                      />
                      {showGiftCandleOption && (
                        <GiftCandleOptions
                          value={giftCandle}
                          onChange={setGiftCandle}
                        />
                      )}
                      <TextField
                        label="Mensaje en la torta (opcional)"
                        value={message}
                        onChange={setMessage}
                        placeholder="Ej. Feliz cumpleaños, Camila"
                      />
                      <TextAreaField
                        label="Indicaciones (opcional)"
                        value={additionalInfo}
                        onChange={setAdditionalInfo}
                        rows={3}
                        placeholder="Ej. alergias o alguna indicación importante"
                      />
                    </div>
                  ) : quantityProduct ? (
                    <div className="space-y-4">
                      <DateTimeFields
                        date={date}
                        time={time}
                        onDateChange={setDate}
                        onTimeChange={setTime}
                      />
                      {miniCake && showGiftCandleOption && (
                        <GiftCandleOptions
                          value={giftCandle}
                          onChange={setGiftCandle}
                        />
                      )}
                      {!complementProduct && !biteProduct && (
                        <div className="grid gap-4 sm:grid-cols-2">
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
                        </div>
                      )}
                      <TextField
                        label={complementProduct ? "Detalle (opcional)" : "Mensaje (opcional)"}
                        value={message}
                        onChange={setMessage}
                        placeholder={
                          complementProduct
                            ? "Ej. incluir con torta principal"
                            : "Ej. Feliz cumple, Valeria"
                        }
                      />
                      <TextAreaField
                        label="Indicaciones (opcional)"
                        value={additionalInfo}
                        onChange={setAdditionalInfo}
                        rows={3}
                        placeholder={
                          complementProduct
                            ? "Ej. combinar con otro pedido"
                            : "Ej. empaque para regalo o alguna indicación importante"
                        }
                      />
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <DateTimeFields
                        date={date}
                        time={time}
                        onDateChange={setDate}
                        onTimeChange={setTime}
                      />
                      {showGiftCandleOption && (
                        <GiftCandleOptions
                          value={giftCandle}
                          onChange={setGiftCandle}
                        />
                      )}
                      <TextField
                        label="Mensaje en la torta (opcional)"
                        value={message}
                        onChange={setMessage}
                        placeholder="Ej. Feliz cumple, Valeria"
                      />
                      <TextAreaField
                        label="Indicaciones (opcional)"
                        value={additionalInfo}
                        onChange={setAdditionalInfo}
                        rows={3}
                        placeholder="Ej. alergias o alguna indicación importante"
                      />
                    </div>
                  )}
                </div>
              </section>

              <section className="rounded-xl border border-blush/25 bg-cream/20 p-5 sm:p-6">
                <h3 className="text-lg font-semibold text-ink">
                  3. Entrega y total
                </h3>
                <div className="mt-5 space-y-5">
                  <DeliveryOptions delivery={delivery} onChange={setDelivery} />

                  <div className="rounded-xl border border-blush/30 bg-blush/10 px-5 py-4">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                      <div>
                        <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-plum/75">
                          {finalPriceTitle}
                        </p>
                        <p className="mt-2 font-display text-3xl leading-none text-ink sm:text-4xl">
                          {finalPriceLabel}
                        </p>
                        {selectedComplementItems.length > 0 && (
                          <p className="mt-2 text-sm font-medium text-ink/58">
                            Complementos agregados
                          </p>
                        )}
                      </div>
                      <div className="space-y-1 text-sm leading-6 text-ink/62 sm:text-right">
                        <p>
                          {delivery === "Recojo coordinado" ? "Recojo" : "Delivery"}
                        </p>
                        {date && <p>Fecha: {formatDisplayDate(date)}</p>}
                        {time && <p>Hora: {formatDisplayTime(time)}</p>}
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
                          value={formatDisplayDate(date)}
                        />
                      )}
                      <SummaryItem label="Entrega" value={delivery} />
                    </div>
                  </div>

                  <a
                    href={getWhatsAppUrl(whatsappMessage)}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-ink px-6 py-3 text-base font-semibold text-white shadow-soft transition-colors duration-200 hover:bg-plum"
                  >
                    <MessageCircle size={19} aria-hidden="true" />
                    Pedir por WhatsApp
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

                      <QuantityField
                        value={quantity}
                        onChange={setQuantity}
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
                      <DatePickerField
                        label="Fecha deseada"
                        value={date}
                        onChange={setDate}
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
                      <DatePickerField
                        label="Fecha deseada"
                        value={date}
                        onChange={setDate}
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
                      <DatePickerField
                        label="Fecha deseada"
                        value={date}
                        onChange={setDate}
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
                          value={formatDisplayDate(date)}
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
                      : "border-lavender/30 bg-white text-ink hover:border-plum/35 hover:text-plum"
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
          </Reveal>
        </div>

      </div>

      <SizeGuideModal
        isOpen={isSizeGuideOpen}
        onClose={() => setIsSizeGuideOpen(false)}
      />
    </section>
  );
}
