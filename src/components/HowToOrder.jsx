import { useEffect, useRef } from "react";
import {
  CalendarDays,
  CheckCircle2,
  CreditCard,
  MapPin,
  PackageCheck,
  Send,
  ShoppingBag,
} from "lucide-react";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

function OrderIllustration({ type }) {
  const commonProps = {
    fill: "none",
    stroke: "currentColor",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: 1.8,
  };

  const illustrations = {
    cake: (
      <>
        <ellipse cx="36" cy="55" rx="23" ry="5" {...commonProps} />
        <path d="M17 51V34c0-4 8.5-7 19-7s19 3 19 7v17" {...commonProps} />
        <path d="M17 35c0 4 8.5 7 19 7s19-3 19-7" {...commonProps} />
        <path d="M36 27v-8M33 19c0-2 3-4 3-6 0 2 3 4 3 6" {...commonProps} />
        <path d="M23 45c2 2 4 2 6 0 2 2 4 2 6 0 2 2 4 2 6 0 2 2 4 2 6 0" {...commonProps} />
      </>
    ),
    piping: (
      <>
        <path d="M19 17 51 29 34 53 26 35Z" {...commonProps} />
        <path d="m26 35 8 18-5 8M34 53l7 6" {...commonProps} />
        <path d="M23 23c7 3 14 6 22 9" {...commonProps} />
        <circle cx="50" cy="18" r="3" {...commonProps} />
        <circle cx="58" cy="26" r="2" {...commonProps} />
        <path d="m51 42 2 2 4-5" {...commonProps} />
      </>
    ),
    message: (
      <>
        <path d="M15 19h42a5 5 0 0 1 5 5v24a5 5 0 0 1-5 5H33L21 61l2-8h-8a5 5 0 0 1-5-5V24a5 5 0 0 1 5-5Z" {...commonProps} />
        <path d="M21 31h29M21 39h22" {...commonProps} />
        <path d="m47 46 3 3 7-8" {...commonProps} />
      </>
    ),
    payment: (
      <>
        <rect x="11" y="18" width="50" height="38" rx="6" {...commonProps} />
        <path d="M11 30h50M20 44h13" {...commonProps} />
        <circle cx="51" cy="43" r="5" {...commonProps} />
        <path d="m49 43 2 2 3-4" {...commonProps} />
      </>
    ),
    send: (
      <>
        <path d="m10 35 51-20-15 44-13-17Z" {...commonProps} />
        <path d="m33 42 28-27M33 42l-2 14" {...commonProps} />
        <path d="M14 53h10M10 60h15" {...commonProps} />
      </>
    ),
    celebrate: (
      <>
        <path d="M18 50V36c0-4 8-7 18-7s18 3 18 7v14" {...commonProps} />
        <ellipse cx="36" cy="50" rx="22" ry="5" {...commonProps} />
        <path d="M18 36c0 4 8 7 18 7s18-3 18-7M36 29v-8" {...commonProps} />
        <path d="M36 21c-2-3 1-5 0-8 3 3 4 5 0 8ZM13 20l4 2M55 20l4-3M14 29h-5M58 29h5" {...commonProps} />
        <circle cx="22" cy="17" r="1.5" fill="currentColor" stroke="none" />
        <circle cx="51" cy="12" r="1.5" fill="currentColor" stroke="none" />
      </>
    ),
  };

  return (
    <svg
      viewBox="0 0 72 72"
      className="h-full w-full"
      aria-hidden="true"
    >
      {illustrations[type]}
    </svg>
  );
}

const steps = [
  {
    icon: ShoppingBag,
    title: "Elige tu favorito",
    kicker: "Paso 01",
    text: "Entra a la tienda y selecciona la torta o postre que quieres para tu celebración.",
    accent: "bg-blush",
    textColor: "text-[#B93668]",
    illustration: "cake",
    illustrationClass: "bg-blush/15 text-[#A64F70]",
  },
  {
    icon: CheckCircle2,
    title: "Personaliza tu pedido",
    kicker: "Paso 02",
    text: "Configura tamaño, sabor, relleno, mensaje, temática y detalles especiales según la ocasión.",
    accent: "bg-lavender",
    textColor: "text-plum",
    illustration: "piping",
    illustrationClass: "bg-lavender/20 text-plum",
  },
  {
    icon: CalendarDays,
    title: "Confirmamos contigo",
    kicker: "Paso 03",
    text: "Envía tu selección por WhatsApp y revisamos disponibilidad, fecha, precio final y entrega.",
    accent: "bg-[#5DB9AE]",
    textColor: "text-[#24766F]",
    illustration: "message",
    illustrationClass: "bg-[#DFF2EF] text-[#24766F]",
  },
  {
    icon: CreditCard,
    title: "Realiza el pago",
    kicker: "Paso 04",
    text: "Cuando todo esté definido, confirma tu pedido realizando el pago total por Yape.",
    accent: "bg-gold",
    textColor: "text-[#996515]",
    illustration: "payment",
    illustrationClass: "bg-[#F8EACD] text-[#8A641F]",
  },
  {
    icon: Send,
    title: "Envía tu captura",
    kicker: "Paso 05",
    text: "Comparte la captura del pago por WhatsApp para dejar tu pedido validado y en agenda.",
    accent: "bg-[#DD537E]",
    textColor: "text-[#B93668]",
    illustration: "send",
    illustrationClass: "bg-blush/15 text-[#A64F70]",
  },
  {
    icon: PackageCheck,
    title: "Recibe y celebra",
    kicker: "Paso 06",
    text: "Recoge tu pedido o espera la entrega coordinada en la puerta de tu casa.",
    accent: "bg-plum",
    textColor: "text-plum",
    illustration: "celebrate",
    illustrationClass: "bg-lavender/20 text-plum",
  },
];

export default function HowToOrder() {
  const timelineRef = useRef(null);
  const progressLineRef = useRef(null);

  useEffect(() => {
    const timeline = timelineRef.current;
    const progressLine = progressLineRef.current;
    if (!timeline || !progressLine) return undefined;

    let animationFrame;

    const updateProgress = () => {
      const rect = timeline.getBoundingClientRect();
      const startPoint = window.innerHeight * 0.72;
      const travelDistance = rect.height + window.innerHeight * 0.34;
      const progress = Math.min(
        1,
        Math.max(0, (startPoint - rect.top) / travelDistance),
      );

      progressLine.style.transform = `scaleY(${progress})`;
    };

    const requestUpdate = () => {
      window.cancelAnimationFrame(animationFrame);
      animationFrame = window.requestAnimationFrame(updateProgress);
    };

    updateProgress();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
    };
  }, []);

  return (
    <section
      id="pedido"
      className="relative scroll-mt-32 overflow-hidden bg-[linear-gradient(180deg,#FFF4ED_0%,#F8E8EC_48%,#EFF0FC_100%)] pb-20 pt-32 text-ink sm:pb-28 sm:pt-36 lg:scroll-mt-40 lg:pt-44"
    >
      <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex justify-center">
          <SectionHeading
            eyebrow="Fácil, claro y a tu medida"
            title="Cómo hago mi pedido"
            description="Un proceso guiado para que elijas, personalices y confirmes tu torta sin enredos."
          />
        </div>

        <Reveal className="mx-auto mt-8 flex max-w-3xl flex-col items-center gap-3 text-center sm:flex-row sm:justify-center">
          <a href="#/tienda" className="button-primary">
            <ShoppingBag size={19} aria-hidden="true" />
            Ir a la tienda
          </a>
        </Reveal>

        <ol
          ref={timelineRef}
          className="relative mx-auto mt-16 max-w-5xl pr-5 md:pr-0"
        >
          <span
            className="absolute bottom-8 left-7 top-8 w-1 rounded-full bg-plum/15 md:left-1/2 md:-ml-0.5"
            aria-hidden="true"
          />
          <span
            ref={progressLineRef}
            className="absolute bottom-8 left-7 top-8 w-1 origin-top scale-y-0 rounded-full bg-[linear-gradient(180deg,#E49AAF_0%,#AAB3E5_24%,#72B7AE_45%,#BF9040_66%,#D66F91_82%,#765495_100%)] shadow-[0_0_18px_rgba(118,84,149,0.18)] md:left-1/2 md:-ml-0.5"
            aria-hidden="true"
          />

          {steps.map(({
            icon: Icon,
            title,
            kicker,
            text,
            accent,
            textColor,
            illustration,
            illustrationClass,
          }, index) => {
            const isRight = index % 2 === 1;

            return (
              <Reveal
                as="li"
                key={title}
                direction={isRight ? "right" : "left"}
                threshold={0.18}
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
                  className={`timeline-node relative z-10 col-start-1 row-start-1 md:col-start-2 md:row-start-1 md:mx-auto ${accent} grid h-14 w-14 place-items-center rounded-full text-white shadow-[0_16px_35px_rgba(30,50,100,0.18)] ring-8 ring-cream md:h-20 md:w-20`}
                >
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-white text-ink shadow-[inset_0_-8px_16px_rgba(30,50,100,0.06)] md:h-14 md:w-14">
                    <Icon size={24} strokeWidth={1.8} aria-hidden="true" />
                  </span>
                </div>

                <article
                  className={`order-step-card relative col-start-2 row-start-1 min-w-0 overflow-hidden rounded-lg border border-blush/30 bg-[#FFFDFC] p-5 shadow-[0_18px_44px_rgba(23,54,109,0.11)] ring-1 ring-white/80 md:row-start-1 md:p-6 ${
                    isRight
                      ? "md:col-start-3 md:text-left"
                      : "md:col-start-1 md:text-right"
                  }`}
                >
                  <span
                    className={`absolute inset-x-0 top-0 h-1.5 ${accent}`}
                    aria-hidden="true"
                  />
                  <div
                    className={`flex items-center justify-between gap-4 pt-1 ${
                      isRight ? "" : "md:flex-row-reverse"
                    }`}
                  >
                    <span
                      className={`block text-xs font-bold uppercase tracking-[0.18em] ${textColor}`}
                    >
                      {kicker}
                    </span>
                    <span
                      className={`order-step-illustration block h-16 w-16 shrink-0 rounded-[1.25rem] p-1.5 ${illustrationClass}`}
                      style={{ "--illustration-delay": `${index * 70}ms` }}
                      aria-hidden="true"
                    >
                      <OrderIllustration type={illustration} />
                    </span>
                  </div>
                  <h3 className="mt-2 break-words font-display text-3xl leading-tight text-ink">
                    {title}
                  </h3>
                  <p className="mt-3 break-words text-sm leading-6 text-ink/68 sm:text-base sm:leading-7">
                    {text}
                  </p>
                </article>
              </Reveal>
            );
          })}
        </ol>

        <Reveal className="mx-auto mt-12 flex max-w-4xl flex-col gap-5 rounded-lg border border-lavender/30 bg-white p-5 shadow-[0_18px_44px_rgba(23,54,109,0.10)] md:flex-row md:items-center md:justify-between md:p-6">
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
        </Reveal>
      </div>
    </section>
  );
}
