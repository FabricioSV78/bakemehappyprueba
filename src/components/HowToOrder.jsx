import {
  CalendarDays,
  CheckCircle2,
  CreditCard,
  MapPin,
  MessageCircle,
  PackageCheck,
  Send,
} from "lucide-react";
import SectionHeading from "./SectionHeading";
import { getWhatsAppUrl } from "../data/site";

const steps = [
  {
    icon: CheckCircle2,
    text: "Ingresa al catálogo y elige la torta o postre que más te guste.",
  },
  {
    icon: MessageCircle,
    text: "Configura tu pedido con las características que prefieras: tamaño, sabor, relleno, temática y detalles especiales.",
  },
  {
    icon: CalendarDays,
    text: "Envía tu selección y te confirmaremos disponibilidad, precio final y cualquier detalle adicional antes de avanzar.",
  },
  { icon: CreditCard, text: "Realiza el pago total por Yape para confirmar tu pedido." },
  { icon: Send, text: "Envíanos la captura de pago por WhatsApp para dejar todo validado." },
  { icon: PackageCheck, text: "Recoge tu pedido o espéralo cómodamente en la puerta de tu casa." },
];

export default function HowToOrder() {
  return (
    <section
      id="pedido"
      className="scroll-mt-20 bg-ink pb-20 pt-32 text-white sm:pb-28 sm:pt-36"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex justify-center">
          <SectionHeading
            eyebrow="Fácil, claro y a tu medida"
            title="Cómo hago mi pedido"
            //description="Hemos organizado el proceso para que pedir tu torta sea simple, personalizado y seguro. Tú eliges los detalles y nosotras nos encargamos de convertirlos en un pedido precioso y delicioso."
            light
          />
        </div>

        <div className="mx-auto mt-8 flex max-w-3xl flex-col items-center gap-3 text-center sm:flex-row sm:justify-center">
          <a
            href={getWhatsAppUrl()}
            target="_blank"
            rel="noreferrer"
            className="button-primary bg-white text-ink hover:bg-blush hover:text-ink"
          >
            <MessageCircle size={19} aria-hidden="true" />
            Iniciar pedido por WhatsApp
          </a>
          <a
            href="#/catalogo"
            className="button-secondary border-white/20 bg-white/10 text-white hover:border-blush hover:text-blush"
          >
            Ir al catálogo
          </a>
        </div>

        <ol className="mt-12 grid gap-px overflow-hidden rounded-lg bg-white/15 sm:grid-cols-2 lg:grid-cols-3">
          {steps.map(({ icon: Icon, text }, index) => (
            <li
              key={text}
              className="group min-h-[190px] bg-ink p-6 transition-colors hover:bg-white/[0.06] sm:p-8"
            >
              <div className="flex items-start justify-between">
                <span className="grid h-11 w-11 place-items-center rounded-full bg-lavender text-ink">
                  <Icon size={21} strokeWidth={1.8} aria-hidden="true" />
                </span>
                <span className="font-display text-3xl text-white/25">
                  0{index + 1}
                </span>
              </div>
              <p className="mt-7 max-w-xs text-base font-medium leading-7 text-white/85">
                {text}
              </p>
            </li>
          ))}
        </ol>

        <div className="mt-8 flex flex-col items-start justify-between gap-6 border-t border-white/15 pt-8 md:flex-row md:items-center">
          <div className="flex gap-4">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-blush text-ink">
              <MapPin size={21} aria-hidden="true" />
            </span>
            <div>
              <h3 className="font-semibold">Entrega coordinada con anticipación</h3>
              <p className="mt-1 max-w-2xl text-sm leading-6 text-white/65">
                Puedes elegir recojo o delivery según la cobertura disponible.
                El punto de entrega, horario y costo de envío se confirman contigo
                antes del cierre del pedido.
              </p>
            </div>
          </div>
          <span className="shrink-0 rounded-full border border-white/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-blush">
            Trujillo, Perú
          </span>
        </div>
      </div>
    </section>
  );
}
