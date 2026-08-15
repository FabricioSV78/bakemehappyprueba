import {
  ArrowRight,
  CakeSlice,
  ClipboardCheck,
  PackageCheck,
  WandSparkles,
} from "lucide-react";
import Reveal from "./Reveal";
import AssetImage from "./AssetImage";

const aboutImagesBasePath = "/images/webp/QUIENES SOMOS";
const heroImage = `${aboutImagesBasePath}/1.webp`;
const celebrationImage = `${aboutImagesBasePath}/2.webp`;
const birthdayImage = `${aboutImagesBasePath}/3.webp`;
const SHOW_PRODUCTION_PROCESS = false;

const processSteps = [
  {
    icon: ClipboardCheck,
    title: "Definimos tu idea",
    text: "Conversamos sobre fecha, porciones, colores, temática y mensaje.",
    image: birthdayImage,
    imagePosition: "74% 42%",
  },
  {
    icon: CakeSlice,
    title: "Horneamos con cuidado",
    text: "Preparamos queque, relleno y cobertura con sabor artesanal.",
    image: heroImage,
    imagePosition: "48% 78%",
  },
  {
    icon: WandSparkles,
    title: "Decoramos los detalles",
    text: "Trabajamos buttercream, flores, toppers y acabados personalizados.",
    image: celebrationImage,
    imagePosition: "72% 52%",
  },
  {
    icon: PackageCheck,
    title: "Entregamos listo",
    text: "Coordinamos recojo o delivery para que llegue perfecto a tu celebración.",
    image: heroImage,
    imagePosition: "78% 38%",
  },
];

function EditorialImage({
  src,
  alt,
  className = "",
  imagePosition = "center",
  width = "760",
  height = "520",
  loading = "lazy",
}) {
  return (
    <Reveal
      as="figure"
      className={`overflow-hidden rounded-lg bg-lavender-light ${className}`}
      direction="scale"
    >
      <AssetImage
        src={src}
        alt={alt}
        className="h-full w-full object-cover"
        style={{ objectPosition: imagePosition }}
        loading={loading}
        decoding="async"
        width={width}
        height={height}
      />
    </Reveal>
  );
}

function AboutActions({ className = "" }) {
  return (
    <Reveal
      className={`flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center ${className}`}
    >
      <a href="/tienda" className="button-primary">
        Ver nuestras tortas
        <ArrowRight size={18} aria-hidden="true" />
      </a>
      <a href="/pedido" className="button-secondary">
        Conocer cómo hacer un pedido
      </a>
    </Reveal>
  );
}

export default function About() {
  return (
    <div className="bg-white pt-20 text-ink lg:pt-[9.375rem]">
      <section
        id="nosotros"
        className="scroll-mt-20 bg-[#F2E4D8]"
        aria-labelledby="about-title"
      >
        <div className="mx-auto grid max-w-5xl items-center gap-8 px-4 py-10 min-[380px]:px-5 sm:px-8 sm:py-14 md:grid-cols-[0.95fr_1.05fr] md:gap-10 lg:grid-cols-[1fr_0.82fr] lg:py-16">
          <Reveal direction="left">
            <h1
              id="about-title"
              className="font-display text-4xl leading-tight text-ink sm:text-5xl lg:text-6xl"
            >
              Quiénes somos
            </h1>
            <p className="mt-4 max-w-xl text-[0.95rem] leading-7 text-ink/78 sm:text-base sm:leading-8">
              Bake Me Happy es una pastelería artesanal en Trujillo, creada
              para convertir celebraciones familiares, cumpleaños y fechas
              especiales en momentos dulces, memorables y hechos a medida.
            </p>
          </Reveal>

          <EditorialImage
            src={heroImage}
            alt="Tres tortas artesanales decoradas por Bake Me Happy"
            className="aspect-[3/2] w-full md:aspect-[4/3] lg:aspect-[3/2]"
            imagePosition="74% 42%"
            width="520"
            height="345"
            loading="eager"
          />
        </div>
      </section>

      <section className="bg-white py-14 sm:py-20 lg:py-24" aria-labelledby="mission-title">
        <div className="mx-auto max-w-5xl px-4 min-[380px]:px-5 sm:px-8">
          <div className="grid items-center gap-8 md:grid-cols-[1fr_0.95fr] md:gap-10 lg:gap-12">
            <EditorialImage
              src={celebrationImage}
              alt="Dos tortas temáticas decoradas por Bake Me Happy"
              className="order-2 aspect-[16/10] w-full md:order-1"
              imagePosition="70% 52%"
            />

            <Reveal direction="right" className="order-1 md:order-2">
              <h2 id="mission-title" className="max-w-xl text-2xl font-semibold leading-snug text-ink sm:text-3xl">
                Nuestra misión: endulzar celebraciones con tortas hechas con
                amor
              </h2>
              <p className="mt-4 max-w-xl text-[0.95rem] leading-7 text-ink/76 sm:text-base sm:leading-8">
                Creemos que una torta no solo debe verse bonita: también debe
                sentirse personal. Por eso cuidamos sabor, presentación,
                proporciones y detalles para que cada pedido acompañe de verdad
                el momento que quieres celebrar.
              </p>
            </Reveal>
          </div>

          <div className="mt-14 grid items-center gap-8 sm:mt-16 md:grid-cols-[0.95fr_1fr] md:gap-10 lg:gap-12" aria-labelledby="history-title">
            <Reveal direction="left">
              <h2 id="history-title" className="text-2xl font-semibold leading-snug text-ink sm:text-3xl">
                Nuestra historia
              </h2>
              <div className="mt-4 max-w-xl space-y-4 text-[0.95rem] leading-7 text-ink/76 sm:space-y-5 sm:text-base sm:leading-8">
                <p>
                  Bake Me Happy empezó desde pedidos cercanos: tortas para
                  cumpleaños, detalles sorpresa y celebraciones familiares donde
                  cada cliente buscaba algo rico, bonito y preparado con
                  dedicación.
                </p>
                <p>
                  Con el tiempo, las recomendaciones dieron forma al negocio.
                  Hoy elaboramos tortas clásicas, tortas temáticas y complementos
                  personalizados, manteniendo una atención cercana y una
                  estética dulce, limpia y artesanal.
                </p>
              </div>
            </Reveal>

            <EditorialImage
              src={birthdayImage}
              alt="Pastelera de Bake Me Happy acompañada de sus tortas decoradas"
              className="aspect-[16/10] w-full"
              imagePosition="72% 46%"
            />
          </div>

          {!SHOW_PRODUCTION_PROCESS && (
            <AboutActions className="mt-10 sm:mt-12" />
          )}
        </div>
      </section>

      {SHOW_PRODUCTION_PROCESS && (
        <section
          className="bg-[#FFF4ED] py-14 sm:py-20"
          aria-labelledby="process-title"
        >
          <div className="mx-auto max-w-5xl px-4 min-[380px]:px-5 sm:px-8">
            <div className="grid items-start gap-10 lg:grid-cols-[0.75fr_1fr] lg:gap-14">
              <Reveal direction="left">
                <h2 id="process-title" className="font-display text-4xl leading-tight text-ink sm:text-5xl">
                  Proceso de elaboración
                </h2>
                <p className="mt-4 max-w-md text-[0.95rem] leading-7 text-ink/72 sm:text-base sm:leading-8">
                  Trabajamos cada pedido con un flujo claro para que el diseño,
                  sabor y entrega estén bien coordinados desde el inicio.
                </p>
              </Reveal>

              <div className="grid gap-5 sm:grid-cols-2" role="list">
                {processSteps.map(
                  ({ icon: Icon, title, text, image, imagePosition }, index) => (
                    <Reveal
                      as="article"
                      key={title}
                      delay={index * 65}
                      className="grid grid-cols-1 gap-4 border-b border-blush/25 pb-5 min-[420px]:grid-cols-[5.75rem_minmax(0,1fr)] sm:last:border-b sm:[&:nth-last-child(-n+2)]:border-b-0 last:border-b-0"
                      role="listitem"
                    >
                      <EditorialImage
                        src={image}
                        alt=""
                        className="aspect-[16/9] w-full min-[420px]:aspect-square"
                        imagePosition={imagePosition}
                        width="160"
                        height="160"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white text-plum shadow-sm">
                            <Icon size={16} strokeWidth={1.8} aria-hidden="true" />
                          </span>
                          <span className="text-xs font-semibold uppercase tracking-[0.14em] text-plum">
                            Paso {index + 1}
                          </span>
                        </div>
                        <h3 className="mt-3 text-base font-semibold leading-snug text-ink">
                          {title}
                        </h3>
                        <p className="mt-2 text-sm leading-6 text-ink/66">{text}</p>
                      </div>
                    </Reveal>
                  ),
                )}
              </div>
            </div>

            <AboutActions className="mt-10 sm:mt-12" />
          </div>
        </section>
      )}
    </div>
  );
}
