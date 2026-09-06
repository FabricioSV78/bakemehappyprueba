export default function NotFoundPage() {
  return (
    <section
      className="bg-cream px-5 pb-20 pt-32 sm:px-8 lg:pt-48"
      aria-labelledby="not-found-title"
    >
      <div className="mx-auto max-w-3xl rounded-lg bg-white p-8 text-center shadow-soft">
        <span className="text-xs font-semibold uppercase tracking-[0.16em] text-plum">
          Error 404
        </span>
        <h1
          id="not-found-title"
          className="mt-2 font-display text-4xl text-ink"
        >
          Página no encontrada
        </h1>
        <p className="mt-3 text-sm leading-6 text-ink/65">
          La dirección ingresada no corresponde a una página disponible.
        </p>
        <a href="/" className="button-primary mt-6">
          Volver al inicio
        </a>
      </div>
    </section>
  );
}
