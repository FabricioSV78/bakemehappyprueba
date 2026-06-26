export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  light = false,
}) {
  const alignment =
    align === "left" ? "items-start text-left" : "items-center text-center";
  const titleMeasure = align === "left" ? "max-w-full" : "max-w-[13ch] sm:max-w-full";
  const descriptionMeasure =
    align === "left" ? "max-w-2xl" : "max-w-[34ch] sm:max-w-2xl";

  return (
    <div className={`flex w-full min-w-0 max-w-full flex-col sm:max-w-3xl ${alignment}`}>
      <span
        className={`mb-3 text-xs font-semibold uppercase tracking-[0.18em] ${
          light ? "text-blush" : "text-plum"
        }`}
      >
        {eyebrow}
      </span>
      <h2
        className={`w-full min-w-0 break-words font-display text-3xl leading-tight sm:text-5xl ${titleMeasure} ${
          light ? "text-white" : "text-ink"
        }`}
      >
        {title}
      </h2>
      {description && (
        <p
          className={`mt-5 w-full min-w-0 break-words text-base leading-7 sm:text-lg ${descriptionMeasure} ${
            light ? "text-white/75" : "text-ink/70"
          }`}
        >
          {description}
        </p>
      )}
    </div>
  );
}
