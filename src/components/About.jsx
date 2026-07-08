import { CakeSlice, ClipboardCheck, PackageCheck, WandSparkles } from "lucide-react";

const heroImage = "/images/webp/hero 1.webp";
const celebrationImage = "/images/webp/hero 2.webp";
const birthdayImage = "/images/webp/hero 3.webp";

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
}) {
  return (
    <figure className={`overflow-hidden rounded-lg bg-lavender-light ${className}`}>
      <img
        src={src}
        alt={alt}
        className="h-full w-full object-cover"
        style={{ objectPosition: imagePosition }}
        loading="lazy"
        width={width}
        height={height}
      />
    </figure>
  );
}

export default function About() {
  return (
    <div className="bg-white pt-20 text-ink lg:pt-28">
      <section
        id="nosotros"
        className="scroll-mt-20 bg-[#F7F2EA]"
      >
        <div className="mx-auto grid max-w-5xl items-center gap-10 px-5 py-14 sm:px-8 lg:grid-cols-[1fr_0.82fr] lg:py-16">
          <div>
            <h1 className="font-display text-5xl leading-tight text-ink sm:text-6xl">
              Quiénes somos
            </h1>
            <p className="mt-4 max-w-xl text-base leading-8 text-ink/78">
              Bake Me Happy es una pastelería artesanal en Trujillo, creada
              para convertir celebraciones familiares, cumpleaños y fechas
              especiales en momentos dulces, memorables y hechos a medida.
            </p>
          </div>

          <EditorialImage
            src={heroImage}
            alt="Torta lavanda con cupcakes de Bake Me Happy"
            className="aspect-[3/2] w-full"
            imagePosition="74% 42%"
            width="520"
            height="345"
          />
        </div>
      </section>

      <section className="bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-5xl px-5 sm:px-8">
          <div className="grid items-center gap-10 lg:grid-cols-[1fr_0.95fr] lg:gap-12">
            <EditorialImage
              src={celebrationImage}
              alt="Torta pastel decorada en tonos rosados"
              className="aspect-[16/10] w-full"
              imagePosition="70% 52%"
            />

            <div>
              <h2 className="max-w-xl text-2xl font-semibold leading-snug text-ink sm:text-3xl">
                Nuestra misión: endulzar celebraciones con tortas hechas con
                amor
              </h2>
              <p className="mt-4 max-w-xl text-base leading-8 text-ink/76">
                Creemos que una torta no solo debe verse bonita: también debe
                sentirse personal. Por eso cuidamos sabor, presentación,
                proporciones y detalles para que cada pedido acompañe de verdad
                el momento que quieres celebrar.
              </p>
            </div>
          </div>

          <div className="mt-16 grid items-start gap-10 lg:grid-cols-[0.95fr_1fr] lg:gap-12">
            <div>
              <h2 className="text-2xl font-semibold leading-snug text-ink sm:text-3xl">
                Nuestra historia
              </h2>
              <div className="mt-4 max-w-xl space-y-5 text-base leading-8 text-ink/76">
                <p>
                  Bake Me Happy empezó desde pedidos cercanos: tortas para
                  cumpleaños, detalles sorpresa y celebraciones familiares donde
                  cada cliente buscaba algo rico, bonito y preparado con
                  dedicación.
                </p>
                <p>
                  Con el tiempo, las recomendaciones dieron forma al negocio.
                  Hoy elaboramos tortas clasicas, tortas tematicas y bocaditos
                  tortas, manteniendo una atención cercana y una estética dulce,
                  limpia y artesanal.
                </p>
              </div>
            </div>

            <EditorialImage
              src={birthdayImage}
              alt="Torta de cumpleaños con globos pastel"
              className="aspect-[16/10] w-full"
              imagePosition="72% 46%"
            />
          </div>
        </div>
      </section>

      <section className="bg-[#FFF8F3] py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-5 sm:px-8">
          <div className="grid items-start gap-10 lg:grid-cols-[0.75fr_1fr] lg:gap-14">
            <div>
              <h2 className="font-display text-4xl leading-tight text-ink sm:text-5xl">
                Proceso de elaboración
              </h2>
              <p className="mt-4 max-w-md text-base leading-8 text-ink/72">
                Trabajamos cada pedido con un flujo claro para que el diseño,
                sabor y entrega estén bien coordinados desde el inicio.
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              {processSteps.map(
                ({ icon: Icon, title, text, image, imagePosition }, index) => (
                  <article
                    key={title}
                    className="grid grid-cols-[5.75rem_minmax(0,1fr)] gap-4 border-b border-blush/40 pb-5 last:border-b-0 sm:last:border-b sm:[&:nth-last-child(-n+2)]:border-b-0"
                  >
                    <EditorialImage
                      src={image}
                      alt={`${title} en Bake Me Happy`}
                      className="aspect-square w-full"
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
                  </article>
                ),
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
