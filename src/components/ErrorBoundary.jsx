import { Component } from "react";

export default class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    if (import.meta.env.DEV) {
      console.error("Error no controlado en la interfaz", error, errorInfo);
    }
  }

  handleRetry = () => {
    window.location.reload();
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <main className="grid min-h-screen place-items-center bg-cream px-5 py-12 text-ink">
        <section
          className="w-full max-w-xl rounded-2xl border border-blush/35 bg-white p-6 text-center shadow-soft sm:p-10"
          role="alert"
          aria-labelledby="error-title"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-plum">
            Bake Me Happy
          </p>
          <h1 id="error-title" className="mt-3 font-display text-3xl sm:text-4xl">
            No pudimos mostrar esta pagina
          </h1>
          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-ink/65 sm:text-base">
            Ocurrio un problema inesperado. Tus datos no fueron enviados; puedes
            recargar la pagina e intentarlo nuevamente.
          </p>
          <button type="button" className="button-primary mt-6" onClick={this.handleRetry}>
            Recargar pagina
          </button>
        </section>
      </main>
    );
  }
}
