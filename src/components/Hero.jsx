import { ArrowRight, MessageCircle, Sparkles } from "lucide-react";
import { getWhatsAppUrl } from "../data/site";

export default function Hero() {
  return (
    <section
      id="inicio"
      className="relative flex min-h-[720px] items-end overflow-hidden bg-[#f9f1f3] pt-20 sm:min-h-[760px]"
    >
      <div className="absolute inset-0">
        <img
          src="/images/bake-me-happy-hero.jpg"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full scale-[1.08] object-cover object-[72%_34%] opacity-30 blur-[2px] sm:scale-[1.02] sm:object-[72%_30%] lg:object-[70%_28%]"
        />
        <img
          src="/images/bake-me-happy-hero.jpg"
          alt="Torta artesanal lavanda decorada con mariposas, flores y cupcakes"
          className="absolute inset-0 h-full w-full object-contain object-[82%_86%] sm:object-[82%_84%] lg:object-[86%_88%] xl:object-[84%_86%]"
          fetchPriority="high"
        />
      </div>
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,248,243,0.99)_0%,rgba(255,248,243,0.95)_34%,rgba(255,248,243,0.70)_56%,rgba(255,248,243,0.26)_78%,rgba(255,248,243,0.08)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_26%,rgba(255,255,255,0.88),transparent_28%),radial-gradient(circle_at_84%_18%,rgba(255,255,255,0.34),transparent_24%),radial-gradient(circle_at_86%_78%,rgba(246,183,203,0.22),transparent_22%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,248,243,0.14)_0%,rgba(255,248,243,0.1)_58%,rgba(255,248,243,0.42)_100%)] sm:hidden" />

      <div className="relative mx-auto flex w-full max-w-7xl items-end px-5 pb-12 pt-20 sm:px-8 sm:pb-16 lg:min-h-[680px]">
        <div className="w-full min-w-0 max-w-2xl lg:pb-8">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-plum/20 bg-white/75 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-plum backdrop-blur">
            <Sparkles size={15} aria-hidden="true" />
            Tu pastelería virtual en Trujillo
          </div>
          <h1 className="break-words font-display text-5xl leading-[0.98] text-ink sm:text-6xl lg:text-7xl">
            Bake Me Happy
          </h1>
          <p className="mt-4 max-w-full break-words text-xl font-semibold leading-snug text-plum sm:max-w-xl sm:text-2xl">
            Tortas y postres personalizados para momentos especiales
          </p>
          <p className="mt-5 max-w-full break-words text-base leading-7 text-ink/75 sm:max-w-xl sm:text-lg">
            Creamos tortas temáticas, postres clásicos y detalles dulces
            personalizados para cumpleaños, celebraciones y fechas especiales.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href={getWhatsAppUrl()}
              target="_blank"
              rel="noreferrer"
              className="button-primary w-full sm:w-auto"
            >
              <MessageCircle size={19} aria-hidden="true" />
              Hacer mi pedido
            </a>
            <a href="#/catalogo" className="button-secondary w-full sm:w-auto">
              Ver catálogo
              <ArrowRight size={18} aria-hidden="true" />
            </a>
          </div>
          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium text-ink/65">
            <span>Diseños personalizados</span>
            <span>Precios referenciales</span>
            <span>Delivery coordinado</span>
          </div>
        </div>
      </div>
    </section>
  );
}
