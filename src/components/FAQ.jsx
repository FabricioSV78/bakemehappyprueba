import { HelpCircle } from "lucide-react";
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
    question: "¿Los precios del catálogo son finales?",
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
  return (
    <section id="preguntas" className="section-space scroll-mt-20 bg-lavender-light">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
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
            {faqs.map((faq) => (
              <article
                key={faq.question}
                className="rounded-lg border border-white bg-white/85 p-6 shadow-sm"
              >
                <div className="flex gap-4">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-blush text-ink">
                    <HelpCircle size={21} strokeWidth={1.8} aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className="text-lg font-semibold text-ink">{faq.question}</h3>
                    <p className="mt-2 text-sm leading-6 text-ink/68">{faq.answer}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
