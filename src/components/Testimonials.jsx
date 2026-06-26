import { Quote, Star } from "lucide-react";
import SectionHeading from "./SectionHeading";
import { testimonials } from "../data/testimonials";

export default function Testimonials() {
  return (
    <section
      id="testimonios"
      className="section-space scroll-mt-20 bg-cream"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex justify-center">
          <SectionHeading
            eyebrow="Clientes felices"
            title="Celebraciones que dejan un dulce recuerdo"
            description="Cada mensaje nos inspira a seguir creando pedidos que se vean tan bien como saben."
          />
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <figure
              key={testimonial.id}
              className={`relative min-h-[280px] rounded-lg border p-7 ${
                index === 1
                  ? "border-lavender bg-lavender/45"
                  : "border-blush/70 bg-white"
              }`}
            >
              <Quote
                size={42}
                strokeWidth={1.2}
                className="absolute right-6 top-6 text-plum/25"
                aria-hidden="true"
              />
              <div
                className="flex gap-1 text-gold"
                aria-label="Calificación: 5 de 5 estrellas"
              >
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} size={16} fill="currentColor" aria-hidden="true" />
                ))}
              </div>
              <blockquote className="mt-8 font-display text-2xl leading-snug text-ink">
                "{testimonial.quote}"
              </blockquote>
              <figcaption className="mt-8 border-t border-ink/10 pt-5">
                <span className="block font-semibold text-ink">
                  {testimonial.name}
                </span>
                <span className="mt-1 block text-xs font-medium uppercase tracking-[0.13em] text-plum">
                  {testimonial.occasion}
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
