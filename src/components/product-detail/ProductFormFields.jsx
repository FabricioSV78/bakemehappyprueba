import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ArrowLeft, ArrowRight, CalendarDays, Clock, Minus, Plus } from "lucide-react";
import {
  formatDisplayDate,
  formatDisplayTime,
  formatSoles,
  getLocalDateValue,
  getOptionValue,
  getSelectHelper,
  parseLocalDate,
} from "../../utils/productDetail";

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

function useDismissiblePopover(isOpen, onClose, containerRef, popoverRef) {
  useEffect(() => {
    if (!isOpen) return undefined;

    const handlePointerDown = (event) => {
      const isInsideTrigger = containerRef.current?.contains(event.target);
      const isInsidePopover = popoverRef.current?.contains(event.target);

      if (!isInsideTrigger && !isInsidePopover) onClose();
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
  }, [containerRef, isOpen, onClose, popoverRef]);
}

function useFloatingPopoverPosition({
  align,
  anchorRef,
  isOpen,
  placement,
  popoverRef,
}) {
  const [position, setPosition] = useState({
    left: 0,
    top: 0,
    visibility: "hidden",
  });

  useLayoutEffect(() => {
    if (!isOpen) return undefined;

    let animationFrame;
    const updatePosition = () => {
      const anchor = anchorRef.current?.getBoundingClientRect();
      const popover = popoverRef.current?.getBoundingClientRect();
      if (!anchor || !popover) return;

      const margin = 16;
      const gap = 10;
      const maximumLeft = Math.max(margin, window.innerWidth - popover.width - margin);
      const preferredLeft =
        align === "right" ? anchor.right - popover.width : anchor.left;
      const left = Math.min(maximumLeft, Math.max(margin, preferredLeft));
      const above = anchor.top - popover.height - gap;
      const below = anchor.bottom + gap;
      const fitsAbove = above >= margin;
      const fitsBelow = below + popover.height <= window.innerHeight - margin;

      let top;
      if (placement === "top" && fitsAbove) {
        top = above;
      } else if (placement === "bottom" && fitsBelow) {
        top = below;
      } else if (fitsAbove) {
        top = above;
      } else if (fitsBelow) {
        top = below;
      } else {
        top = Math.max(margin, (window.innerHeight - popover.height) / 2);
      }

      setPosition({ left, top, visibility: "visible" });
    };
    const scheduleUpdate = () => {
      window.cancelAnimationFrame(animationFrame);
      animationFrame = window.requestAnimationFrame(updatePosition);
    };

    scheduleUpdate();
    window.addEventListener("resize", scheduleUpdate);
    window.addEventListener("scroll", scheduleUpdate, true);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", scheduleUpdate);
      window.removeEventListener("scroll", scheduleUpdate, true);
    };
  }, [align, anchorRef, isOpen, placement, popoverRef]);

  return position;
}

export function TextField({
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
        className="min-h-12 min-w-0 w-full rounded-lg border border-blush/35 bg-white px-4 text-base font-medium text-ink outline-none placeholder:text-ink/35 focus:border-plum/45 focus:ring-4 focus:ring-plum/10"
      />
    </label>
  );
}

function DatePickerField({
  value,
  onChange,
  label = "Fecha de entrega",
  popoverPlacement = "bottom",
}) {
  const selectedDate = parseLocalDate(value);
  const [isOpen, setIsOpen] = useState(false);
  const [viewDate, setViewDate] = useState(() => {
    const initialDate = selectedDate ?? new Date();
    return new Date(initialDate.getFullYear(), initialDate.getMonth(), 1);
  });
  const containerRef = useRef(null);
  const popoverRef = useRef(null);
  const todayValue = getLocalDateValue();
  const popoverPosition = useFloatingPopoverPosition({
    align: "left",
    anchorRef: containerRef,
    isOpen,
    placement: popoverPlacement,
    popoverRef,
  });

  useDismissiblePopover(
    isOpen,
    () => setIsOpen(false),
    containerRef,
    popoverRef,
  );

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
        className={`flex min-h-12 min-w-0 w-full items-center gap-3 rounded-lg border bg-white px-4 text-left outline-none transition-colors focus:border-plum/45 focus:ring-4 focus:ring-plum/10 ${
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

      {isOpen && createPortal(
        <div
          ref={popoverRef}
          data-date-time-popover="date"
          className="fixed z-[160] max-h-[calc(100dvh-2rem)] w-[min(20rem,calc(100vw-2rem))] overflow-y-auto rounded-2xl border border-blush/25 bg-white p-4 shadow-lift"
          style={popoverPosition}
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
        </div>,
        document.body,
      )}
    </div>
  );
}

function TimePickerField({
  value,
  onChange,
  label = "Hora",
  popoverPlacement = "bottom",
}) {
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
  const popoverRef = useRef(null);
  const popoverPosition = useFloatingPopoverPosition({
    align: "right",
    anchorRef: containerRef,
    isOpen,
    placement: popoverPlacement,
    popoverRef,
  });

  useDismissiblePopover(
    isOpen,
    () => setIsOpen(false),
    containerRef,
    popoverRef,
  );

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
        className={`flex min-h-12 min-w-0 w-full items-center gap-3 rounded-lg border bg-white px-4 text-left outline-none transition-colors focus:border-plum/45 focus:ring-4 focus:ring-plum/10 ${
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

      {isOpen && createPortal(
        <div
          ref={popoverRef}
          data-date-time-popover="time"
          className="fixed z-[160] max-h-[calc(100dvh-2rem)] w-[min(22rem,calc(100vw-2rem))] overflow-y-auto rounded-2xl border border-blush/25 bg-white p-4 shadow-lift"
          style={popoverPosition}
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
        </div>,
        document.body,
      )}
    </div>
  );
}

export function DateTimeFields({
  date,
  time,
  onDateChange,
  onTimeChange,
  popoverPlacement = "bottom",
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <DatePickerField
        value={date}
        onChange={onDateChange}
        popoverPlacement={popoverPlacement}
      />
      <TimePickerField
        value={time}
        onChange={onTimeChange}
        popoverPlacement={popoverPlacement}
      />
    </div>
  );
}

export function QuantityControls({
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

export function QuantityField({
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

export function TextAreaField({ label, value, onChange, placeholder, rows = 4 }) {
  return (
    <label className={FORM_FIELD_STACK_CLASS}>
      <span className={FORM_FIELD_LABEL_CLASS}>{label}</span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="min-w-0 w-full resize-y rounded-lg border border-blush/35 bg-white px-4 py-3 text-base font-medium leading-7 text-ink outline-none placeholder:text-ink/35 focus:border-plum/45 focus:ring-4 focus:ring-plum/10"
      />
    </label>
  );
}

export function DeliveryOptions({ delivery, onChange }) {
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

export function GiftCandleOptions({ value, onChange }) {
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

export function ClassicSizeOptionsField({ value, onChange, options }) {
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

export function SelectInput({ name, value, onChange, options, className = "" }) {
  return (
    <select
      name={name}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className={`min-h-12 min-w-0 w-full rounded-lg border border-blush/35 bg-white px-4 text-base font-semibold text-ink outline-none focus:border-plum/45 focus:ring-4 focus:ring-plum/10 ${className}`}
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

export function SelectField({
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
