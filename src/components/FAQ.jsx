import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

const faqs = [
  {
    question: "¿Con cuánta anticipación debo pedir?",
    answer:
      "Lo ideal es reservar con 5 a 7 días de anticipación. Para tortas con modelado, toppers o temáticas muy detalladas, mientras antes coordinemos, mejor.",
  },
  {
    question: "¿Puedo enviar una referencia de Pinterest o Instagram?",
    answer:
      "Sí. Puedes enviar referencias, paleta de colores, temática y cantidad de porciones. Adaptamos la idea al estilo de Bake Me Happy y al presupuesto.",
  },
  {
    question: "¿Los precios de la tienda son finales?",
    answer:
      "Son referenciales. El precio final depende del tamaño, relleno, decoración, acabados personalizados y complejidad del diseño.",
  },
  {
    question: "¿Tienen delivery?",
    answer:
      "Sí, se coordina según zona, fecha y horario. También puede acordarse recojo en punto definido previamente.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section
      id="preguntas"
      className="section-space relative scroll-mt-20 overflow-hidden bg-[linear-gradient(135deg,#F5F4FC_0%,#FFF9F6_52%,#F1F3FC_100%)]"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 top-16 h-64 w-64 rounded-full bg-blush/15 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 bottom-8 h-72 w-72 rounded-full bg-lavender/20 blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:gap-16">
          <div>
            <SectionHeading
              eyebrow="Preguntas frecuentes"
              title="Antes de separar tu fecha"
              description="Resolvemos las dudas más comunes para que pedir una torta personalizada sea claro desde el primer mensaje."
              align="left"
            />
          </div>

          <div className="grid gap-4">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;
              const answerId = `faq-answer-${index}`;

              return (
                <Reveal
                  as="article"
                  key={faq.question}
                  delay={index * 70}
                  direction="right"
                  className={`overflow-hidden rounded-2xl border transition-[border-color,box-shadow,background-color,transform] duration-300 ${
                    isOpen
                      ? "border-plum/20 bg-white/95 shadow-soft"
                      : "border-ink/10 bg-white/80 shadow-[0_8px_24px_rgba(23,54,109,0.05)] hover:-translate-y-0.5 hover:border-plum/20 hover:bg-white/95"
                  }`}
                >
                <h3>
                  <button
                    type="button"
                    className="flex w-full items-center gap-4 px-5 py-5 text-left sm:px-6 sm:py-6"
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    aria-expanded={isOpen}
                    aria-controls={answerId}
                  >
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-blush/25 text-plum ring-1 ring-blush/20">
                      <HelpCircle size={20} strokeWidth={1.9} aria-hidden="true" />
                    </span>
                    <span className="flex-1 text-base font-semibold leading-snug text-ink sm:text-lg">
                      {faq.question}
                    </span>
                    <span
                      className={`grid h-9 w-9 shrink-0 place-items-center rounded-full border text-plum transition-all duration-300 ${
                        isOpen
                          ? "rotate-180 border-plum/20 bg-plum/10"
                          : "border-lavender/35 bg-cream/70"
                      }`}
                    >
                      <ChevronDown size={18} aria-hidden="true" />
                    </span>
                  </button>
                </h3>

                <div
                  id={answerId}
                  className={`grid transition-[grid-template-rows,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    isOpen
                      ? "grid-rows-[1fr] opacity-100"
                      : "grid-rows-[0fr] opacity-0"
                  }`}
                  aria-hidden={!isOpen}
                >
                  <div className="overflow-hidden">
                    <p className="border-t border-ink/10 px-5 pb-6 pt-4 text-sm leading-7 text-ink/72 sm:ml-[4.5rem] sm:px-0 sm:pr-6">
                      {faq.answer}
                    </p>
                  </div>
                </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
