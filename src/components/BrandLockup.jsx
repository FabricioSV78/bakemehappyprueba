import AssetImage from "./AssetImage";

const SIZE_STYLES = {
  header: {
    mark: "h-14 w-14 sm:h-[3.75rem] sm:w-[3.75rem]",
    title: "text-lg sm:text-xl",
    descriptor: "text-[8px] sm:text-[9px]",
  },
  footer: {
    mark: "h-16 w-16",
    title: "text-2xl sm:text-3xl",
    descriptor: "text-[9px] sm:text-[10px]",
  },
};

/**
 * Cambio 5: lockup reutilizable para mantener proporciones, espacio de
 * seguridad y una aplicación consistente del identificador de marca.
 */
export default function BrandLockup({
  size = "header",
  inverted = false,
  className = "",
}) {
  const styles = SIZE_STYLES[size] ?? SIZE_STYLES.header;

  if (size === "footer") {
    return (
      <span className={`inline-flex min-w-0 flex-col items-start ${className}`}>
        <span
          className={`block font-display text-3xl font-semibold leading-none sm:text-[2rem] ${
            inverted ? "text-white" : "text-ink"
          }`}
        >
          Bake Me Happy
        </span>
        <span
          className={`mt-2.5 block font-semibold uppercase tracking-[0.18em] ${styles.descriptor} ${
            inverted ? "text-blush" : "text-plum"
          }`}
        >
          Pastelería artesanal
        </span>
      </span>
    );
  }

  return (
    <span className={`inline-flex min-w-0 items-center gap-3 ${className}`}>
      <AssetImage
        src="/images/webp/LOGO/logo-principal-header.webp"
        alt=""
        className={`${styles.mark} shrink-0 rounded-[1rem] object-cover shadow-sm ring-1 ${
          inverted ? "ring-white/20" : "ring-ink/10"
        }`}
        width="320"
        height="320"
      />
      <span className="min-w-0">
        <span
          className={`block truncate font-display font-semibold leading-none ${styles.title} ${
            inverted ? "text-white" : "text-ink"
          }`}
        >
          Bake Me Happy
        </span>
        <span
          className={`mt-1.5 block truncate font-semibold uppercase tracking-[0.18em] ${styles.descriptor} ${
            inverted ? "text-blush" : "text-plum"
          }`}
        >
          Pastelería artesanal
        </span>
      </span>
    </span>
  );
}
