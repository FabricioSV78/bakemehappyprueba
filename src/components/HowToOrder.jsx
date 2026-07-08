import {
  CalendarDays,
  CheckCircle2,
  CreditCard,
  MapPin,
  PackageCheck,
  Send,
  ShoppingBag,
} from "lucide-react";
import SectionHeading from "./SectionHeading";

const steps = [
  {
    icon: ShoppingBag,
    title: "Elige tu favorito",
    kicker: "Paso 01",
    text: "Entra a la tienda y selecciona la torta o postre que quieres para tu celebración.",
    accent: "bg-[#F3B4C8]",
    textColor: "text-[#C94F7C]",
  },
  {
    icon: CheckCircle2,
    title: "Personaliza tu pedido",
    kicker: "Paso 02",
    text: "Configura tamaño, sabor, relleno, mensaje, temática y detalles especiales según la ocasión.",
    accent: "bg-[#C8CDF7]",
    textColor: "text-plum",
  },
  {
    icon: CalendarDays,
    title: "Confirmamos contigo",
    kicker: "Paso 03",
    text: "Envía tu selección por WhatsApp y revisamos disponibilidad, fecha, precio final y entrega.",
    accent: "bg-[#7CC7BE]",
    textColor: "text-[#3B8D86]",
  },
  {
    icon: CreditCard,
    title: "Realiza el pago",
    kicker: "Paso 04",
    text: "Cuando todo esté definido, confirma tu pedido realizando el pago total por Yape.",
    accent: "bg-gold",
    textColor: "text-[#B1842C]",
  },
  {
    icon: Send,
    title: "Envía tu captura",
    kicker: "Paso 05",
    text: "Comparte la captura del pago por WhatsApp para dejar tu pedido validado y en agenda.",
    accent: "bg-[#E96A8D]",
    textColor: "text-[#D05078]",
  },
  {
    icon: PackageCheck,
    title: "Recibe y celebra",
    kicker: "Paso 06",
    text: "Recoge tu pedido o espera la entrega coordinada en la puerta de tu casa.",
    accent: "bg-plum",
    textColor: "text-plum",
  },
];

export default function HowToOrder() {
  return (
    <section
      id="pedido"
      className="scroll-mt-32 overflow-hidden bg-[linear-gradient(180deg,#FFF8F3_0%,#FFF0F5_48%,#F2F3FF_100%)] pb-20 pt-32 text-ink sm:pb-28 sm:pt-36 lg:scroll-mt-40 lg:pt-44"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex justify-center">
          <SectionHeading
            eyebrow="Fácil, claro y a tu medida"
            title="Cómo hago mi pedido"
            description="Un proceso guiado para que elijas, personalices y confirmes tu torta sin enredos."
          />
        </div>

        <div className="mx-auto mt-8 flex max-w-3xl flex-col items-center gap-3 text-center sm:flex-row sm:justify-center">
          <a href="#/tienda" className="button-primary">
            <ShoppingBag size={19} aria-hidden="true" />
            Ir a la tienda
          </a>
        </div>

        <ol className="relative mx-auto mt-16 max-w-5xl pr-5 md:pr-0">
          <span
            className="absolute bottom-8 left-7 top-8 w-1 rounded-full bg-[linear-gradient(180deg,#F3B4C8_0%,#C8CDF7_24%,#7CC7BE_45%,#D8A84F_66%,#E96A8D_82%,#8E75B6_100%)] md:left-1/2 md:-translate-x-1/2"
            aria-hidden="true"
          />

          {steps.map(({ icon: Icon, title, kicker, text, accent, textColor }, index) => {
            const isRight = index % 2 === 1;

            return (
              <li
                key={title}
                className="relative grid grid-cols-[3.5rem_minmax(0,1fr)] items-start gap-4 pb-10 last:pb-0 md:grid-cols-[minmax(0,1fr)_6rem_minmax(0,1fr)] md:items-center md:pb-12"
              >
                <span
                  className={`absolute top-8 hidden h-px bg-plum/25 md:block ${
                    isRight
                      ? "left-1/2 ml-12 w-[calc(50%-3rem)]"
                      : "right-1/2 mr-12 w-[calc(50%-3rem)]"
                  }`}
                  aria-hidden="true"
                />

                <div
                  className={`relative z-10 col-start-1 row-start-1 md:col-start-2 md:row-start-1 md:mx-auto ${accent} grid h-14 w-14 place-items-center rounded-full text-white shadow-[0_16px_35px_rgba(30,50,100,0.18)] ring-8 ring-cream md:h-20 md:w-20`}
                >
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-white text-ink shadow-[inset_0_-8px_16px_rgba(30,50,100,0.06)] md:h-14 md:w-14">
                    <Icon size={24} strokeWidth={1.8} aria-hidden="true" />
                  </span>
                </div>

                <article
                  className={`relative col-start-2 row-start-1 min-w-0 overflow-hidden rounded-lg border border-blush/55 bg-[#FFFEFC] p-5 shadow-[0_18px_44px_rgba(30,50,100,0.13)] ring-1 ring-white/80 md:row-start-1 md:p-6 ${
                    isRight
                      ? "md:col-start-3 md:text-left"
                      : "md:col-start-1 md:text-right"
                  }`}
                >
                  <span
                    className={`absolute inset-x-0 top-0 h-1.5 ${accent}`}
                    aria-hidden="true"
                  />
                  <span
                    className={`block pt-2 text-xs font-bold uppercase tracking-[0.18em] ${textColor}`}
                  >
                    {kicker}
                  </span>
                  <h3 className="mt-2 break-words font-display text-3xl leading-tight text-ink">
                    {title}
                  </h3>
                  <p className="mt-3 break-words text-sm leading-6 text-ink/68 sm:text-base sm:leading-7">
                    {text}
                  </p>
                </article>
              </li>
            );
          })}
        </ol>

        <div className="mx-auto mt-12 flex max-w-4xl flex-col gap-5 rounded-lg border border-lavender/55 bg-white p-5 shadow-[0_18px_44px_rgba(30,50,100,0.12)] md:flex-row md:items-center md:justify-between md:p-6">
          <div className="flex gap-4">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-blush text-ink">
              <MapPin size={21} aria-hidden="true" />
            </span>
            <div>
              <h3 className="font-semibold text-ink">
                Entrega coordinada con anticipación
              </h3>
              <p className="mt-1 max-w-2xl text-sm leading-6 text-ink/65">
                Puedes elegir recojo o delivery según cobertura. El horario,
                punto de entrega y costo de envío se confirman antes del cierre
                del pedido.
              </p>
            </div>
          </div>
          <span className="w-fit shrink-0 rounded-full border border-plum/20 bg-lavender-light px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-plum">
            Trujillo, Perú
          </span>
        </div>
      </div>
    </section>
  );
}
