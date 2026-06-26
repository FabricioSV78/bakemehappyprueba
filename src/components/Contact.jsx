import {
  Clock3,
  Instagram,
  MapPin,
  MessageCircle,
  Navigation,
} from "lucide-react";
import SectionHeading from "./SectionHeading";
import { getWhatsAppUrl, SITE_CONFIG } from "../data/site";

const contactItems = [
  {
    icon: MessageCircle,
    label: "WhatsApp",
    value: SITE_CONFIG.whatsappDisplay,
  },
  {
    icon: Instagram,
    label: "Instagram",
    value: SITE_CONFIG.instagramHandle,
  },
  { icon: Clock3, label: "Horario", value: SITE_CONFIG.hours },
  { icon: MapPin, label: "Zona de atención", value: SITE_CONFIG.location },
];

export default function Contact() {
  return (
    <section id="contacto" className="scroll-mt-20 bg-blush/35 py-16 sm:py-24">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 sm:px-8 lg:grid-cols-[1fr_0.9fr] lg:gap-16">
        <div>
          <SectionHeading
            eyebrow="Hablemos de tu idea"
            title="Hagamos algo especial para tu celebración"
            description="¿Tienes una idea para una torta personalizada? Escríbenos y te ayudamos a definir porciones, diseño, fecha y detalles del pedido."
            align="left"
          />

          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            {contactItems.map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex gap-3">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white text-plum">
                  <Icon size={20} strokeWidth={1.8} aria-hidden="true" />
                </span>
                <div>
                  <span className="block text-xs font-semibold uppercase tracking-[0.12em] text-ink/45">
                    {label}
                  </span>
                  <span className="mt-1 block text-sm font-medium leading-6 text-ink">
                    {value}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <a
            href={getWhatsAppUrl()}
            target="_blank"
            rel="noreferrer"
            className="button-primary mt-9"
          >
            <MessageCircle size={19} aria-hidden="true" />
            Escribir por WhatsApp
          </a>
        </div>

        <div className="relative min-h-[380px] overflow-hidden rounded-lg bg-lavender-light shadow-soft">
          <div className="absolute inset-0 bg-soft-grid bg-[size:28px_28px]" />
          <div className="absolute left-[18%] top-[24%] h-px w-[68%] rotate-12 bg-plum/20" />
          <div className="absolute left-[12%] top-[58%] h-px w-[74%] -rotate-6 bg-plum/20" />
          <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center text-center">
            <span className="grid h-16 w-16 place-items-center rounded-full bg-ink text-white shadow-lift">
              <MapPin size={28} aria-hidden="true" />
            </span>
            <h3 className="mt-5 font-display text-2xl text-ink">
              Trujillo, Perú
            </h3>
            <p className="mt-2 max-w-[240px] text-sm leading-6 text-ink/65">
              Delivery o recojo previa coordinación.
            </p>
            <span className="mt-5 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-plum">
              <Navigation size={15} aria-hidden="true" />
              Ubicación referencial
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
