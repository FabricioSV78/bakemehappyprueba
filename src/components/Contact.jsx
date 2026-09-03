import {
  Clock3,
  Instagram,
  MapPin,
  MessageCircle,
  Navigation,
} from "lucide-react";
import SectionHeading from "./SectionHeading";
import { getWhatsAppUrl, SITE_CONFIG } from "../data/site";
import Reveal from "./Reveal";

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
        <Reveal direction="left">
          <SectionHeading
            eyebrow="Hablemos de tu idea"
            title="Hagamos algo especial para tu celebración"
            description="¿Tienes una idea para una torta personalizada? Escríbenos y te ayudamos a definir porciones, diseño, fecha y detalles del pedido."
            align="left"
          />

          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            {contactItems.map(({ icon: Icon, label, value }, index) => (
              <Reveal
                key={label}
                className="flex gap-3"
                delay={index * 60}
              >
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
              </Reveal>
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
        </Reveal>

        <Reveal
          className="relative min-h-[380px] overflow-hidden rounded-lg bg-lavender-light shadow-soft"
          direction="right"
          delay={100}
        >
          <iframe
            title="Ubicación de Bake Me Happy en Trujillo"
            src={SITE_CONFIG.mapEmbedUrl}
            className="absolute inset-0 h-full w-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
          <div className="pointer-events-none absolute left-3 right-3 top-3 z-10 rounded-xl border border-lavender/25 bg-white/95 px-4 py-3 text-left shadow-soft backdrop-blur sm:left-4 sm:right-auto sm:w-[17rem]">
            <p className="text-sm font-semibold text-ink">
              {SITE_CONFIG.mapLabel}
            </p>
            <p className="mt-1 text-xs leading-5 text-ink/65">
              {SITE_CONFIG.mapAddress}
            </p>
          </div>
          <a
            href={SITE_CONFIG.mapsUrl}
            target="_blank"
            rel="noreferrer"
            className="absolute bottom-4 left-1/2 z-10 inline-flex min-h-11 -translate-x-1/2 items-center justify-center gap-2 whitespace-nowrap rounded-full border border-white/80 bg-white/95 px-5 py-2.5 text-sm font-semibold text-ink shadow-lift backdrop-blur transition-[color,transform,box-shadow] duration-200 hover:-translate-x-1/2 hover:-translate-y-0.5 hover:text-plum"
            aria-label="Abrir la ubicación de Bake Me Happy en Google Maps"
          >
            <Navigation size={17} aria-hidden="true" />
            Cómo llegar
          </a>
        </Reveal>
      </div>
    </section>
  );
}
