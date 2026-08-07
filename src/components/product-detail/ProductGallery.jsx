import AssetImage from "../AssetImage";

function getProductGallery(product) {
  const gallery = product?.images?.length
    ? product.images
    : [
        {
          src: product?.image,
          alt: `${product?.name} de Bake Me Happy`,
          position: product?.imagePosition,
        },
        {
          src: "/images/webp/hero 2.webp",
          alt: `Vista alternativa de ${product?.name}`,
          position: "center",
        },
        {
          src: "/images/webp/hero 3.webp",
          alt: `Presentacion alternativa de ${product?.name}`,
          position: "center",
        },
      ];

  return gallery
    .map((image) =>
      typeof image === "string"
        ? {
            src: image,
            alt: `${product?.name} de Bake Me Happy`,
            position: "center",
          }
        : image,
    )
    .filter((image) => image?.src)
    .filter(
      (image, index, collection) =>
        collection.findIndex((candidate) => candidate.src === image.src) ===
        index,
    )
    .slice(0, 3);
}

export default function ProductGallery({ product, activeIndex, onSelect }) {
  const gallery = getProductGallery(product);
  const activeImage = gallery[activeIndex] ?? gallery[0];

  return (
    <div className="w-full max-w-full min-w-0 overflow-hidden rounded-3xl bg-white/55 p-1.5 shadow-[0_20px_60px_rgba(77,35,67,0.08)] ring-1 ring-blush/35 min-[380px]:p-2 sm:rounded-[2rem] sm:p-3 lg:p-4">
      <div className="grid w-full min-w-0 grid-cols-1 gap-3 sm:grid-cols-[5.75rem_minmax(0,1fr)] lg:grid-cols-[6.5rem_minmax(0,1fr)] 2xl:grid-cols-[7rem_minmax(0,1fr)]">
        <div
          className="order-2 grid w-full min-w-0 grid-cols-3 gap-2 sm:order-1 sm:grid-cols-1 sm:gap-3"
          aria-label={`Vistas de ${product.name}`}
        >
          {gallery.map((image, index) => {
            const isSelected = activeIndex === index;

            return (
              <button
                key={image.src}
                type="button"
                onClick={() => onSelect(index)}
                aria-label={`Ver imagen ${index + 1} de ${product.name}`}
                aria-pressed={isSelected}
                className={`relative aspect-[701/561] min-h-11 min-w-0 w-full overflow-hidden rounded-xl bg-white transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-plum focus-visible:ring-offset-2 sm:rounded-[1.4rem] ${
                  isSelected
                    ? "shadow-[0_0_0_2px_rgba(145,112,188,0.45)]"
                    : "opacity-75 hover:opacity-100 hover:shadow-[0_0_0_1px_rgba(145,112,188,0.22)]"
                }`}
              >
                <AssetImage
                  src={image.src}
                  alt=""
                  className="block h-full w-full rounded-[inherit] object-contain"
                  style={{
                    objectPosition:
                      image.position ?? product.imagePosition ?? "center",
                  }}
                  loading="lazy"
                  decoding="async"
                  width="1402"
                  height="1122"
                />
              </button>
            );
          })}
        </div>

        <div className="relative order-1 aspect-[701/561] w-full max-w-[620px] justify-self-center overflow-hidden rounded-3xl bg-white sm:order-2 sm:rounded-[2.5rem] xl:max-w-[660px]">
          <AssetImage
            key={activeImage.src}
            src={activeImage.src}
            alt={activeImage.alt}
            className="block h-full w-full rounded-[inherit] object-contain"
            style={{
              objectPosition:
                activeImage.position ?? product.imagePosition ?? "center",
            }}
            width="1402"
            height="1122"
          />
        </div>
      </div>
    </div>
  );
}
