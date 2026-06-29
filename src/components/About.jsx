import {
  CakeSlice,
  Heart,
  Palette,
  PencilRuler,
  Sparkles,
  WandSparkles,
} from "lucide-react";
import SectionHeading from "./SectionHeading";

const values = [
  {
    icon: Heart,
    title: "Hecho con dedicación",
    text: "Cada pedido se prepara de manera artesanal, cuidando sabor, textura y presentación.",
    color: "bg-blush/60",
  },
  {
    icon: Palette,
    title: "Diseños personalizados",
    text: "Convertimos tu idea, temática o paleta favorita en un dulce pensado para ti.",
    color: "bg-lavender/65",
  },
  {
    icon: Sparkles,
    title: "Detalles especiales",
    text: "Creamos acabados delicados y combinaciones que hacen memorable cada celebración.",
    color: "bg-[#DDEBD9]",
  },
];

const processSteps = [
  {
    icon: PencilRuler,
    title: "Definimos la idea",
    text: "Revisamos temática, colores, porciones, fecha y referencias para aterrizar un diseño posible y bonito.",
    imagePosition: "72% 36%",
  },
  {
    icon: CakeSlice,
    title: "Horneamos y rellenamos",
    text: "Preparamos bases suaves y rellenos equilibrados, cuidando textura, frescura y estabilidad.",
    imagePosition: "38% 80%",
  },
  {
    icon: WandSparkles,
    title: "Decoramos cada detalle",
    text: "Aplicamos buttercream, toppers, flores, perlas o modelados según la personalidad del pedido.",
    imagePosition: "76% 28%",
  },
  {
    icon: Heart,
    title: "Entregamos lista para celebrar",
    text: "Coordinamos recojo o delivery para que la torta llegue en buen estado y en el momento acordado.",
    imagePosition: "88% 78%",
  },
];

export default function About() {
  return (
    <div className="bg-cream pt-20">
      <section id="nosotros" className="section-space scroll-mt-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-[0.82fr_1.18fr] lg:gap-16">
            <div>
              <SectionHeading
                eyebrow="Quiénes somos"
                title="Una pastelería artesanal nacida para celebrar mejor"
                description="Bake Me Happy empezó con pedidos personalizados para personas cercanas y creció gracias a recomendaciones de clientes que buscaban tortas bonitas, ricas y hechas con dedicación."
                align="left"
              />
              <div className="mt-7 space-y-4 text-base leading-7 text-ink/72">
                <p>
                  La historia del negocio se construye alrededor de celebraciones:
                  cumpleaños, fechas familiares, detalles sorpresa y momentos donde
                  una torta se vuelve parte del recuerdo.
                </p>
                <p>
                  Hoy el enfoque sigue siendo cercano y artesanal. Cada pedido se
                  conversa, se adapta a la ocasión y se trabaja con atención en
                  sabor, color, proporción y presentación.
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {values.map(({ icon: Icon, title, text, color }, index) => (
                <article
                  key={title}
                  className={`group min-h-[260px] rounded-lg p-6 transition-transform duration-300 hover:-translate-y-1 ${color}`}
                >
                  <span className="mb-10 grid h-12 w-12 place-items-center rounded-full bg-white text-ink shadow-sm">
                    <Icon size={22} strokeWidth={1.8} aria-hidden="true" />
                  </span>
                  <span className="mb-3 block text-xs font-semibold text-ink/45">
                    0{index + 1}
                  </span>
                  <h3 className="text-lg font-semibold text-ink">{title}</h3>
                  <p className="mt-3 text-sm leading-6 text-ink/70">{text}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="flex justify-center">
            <SectionHeading
              eyebrow="Proceso de elaboración"
              title="De una idea dulce a una torta lista para celebrar"
              description="Así organizamos cada pedido para mantener claridad, cuidado artesanal y una entrega bien coordinada."
            />
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-4">
            {processSteps.map(({ icon: Icon, title, text, imagePosition }, index) => (
              <article
                key={title}
                className="overflow-hidden rounded-lg border border-lavender/35 bg-cream shadow-soft"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-lavender-light">
                  <img
                    src="/images/webp/bake-me-happy-hero.webp"
                    alt={`${title} en Bake Me Happy`}
                    className="h-full w-full scale-[1.85] object-cover"
                    style={{ objectPosition: imagePosition }}
                    loading="lazy"
                    width="640"
                    height="480"
                  />
                  <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-plum backdrop-blur">
                    Paso {index + 1}
                  </span>
                </div>
                <div className="p-6">
                  <span className="grid h-11 w-11 place-items-center rounded-full bg-ink text-white">
                    <Icon size={21} strokeWidth={1.8} aria-hidden="true" />
                  </span>
                  <h3 className="mt-5 text-lg font-semibold text-ink">{title}</h3>
                  <p className="mt-3 text-sm leading-6 text-ink/68">{text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
