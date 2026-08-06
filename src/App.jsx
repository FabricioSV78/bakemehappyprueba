import { lazy, Suspense, useEffect, useState } from "react";
import CustomOrderModal from "./components/CustomOrderModal";
import Header from "./components/Header";
import Footer from "./components/Footer";
import WhatsAppFloat from "./components/WhatsAppFloat";
import HomePage from "./pages/HomePage";

const AboutPage = lazy(() => import("./pages/AboutPage"));
const CatalogPage = lazy(() => import("./pages/CatalogPage"));
const OrderPage = lazy(() => import("./pages/OrderPage"));
const ProductPage = lazy(() => import("./pages/ProductPage"));

const ROUTES = {
  "/": HomePage,
  "/quienes-somos": AboutPage,
  "/tienda": CatalogPage,
  "/catalogo": CatalogPage,
  "/pedido": OrderPage,
};

function getCurrentPath() {
  const hash = window.location.hash;
  return hash.startsWith("#/") ? hash.slice(1).split("?")[0] : "/";
}

function PageLoadingFallback() {
  return (
    <div
      className="grid min-h-[55vh] place-items-center bg-cream px-5 pt-28 lg:pt-40"
      role="status"
      aria-live="polite"
    >
      <span className="inline-flex items-center gap-3 text-sm font-semibold text-plum">
        <span className="h-5 w-5 animate-spin rounded-full border-2 border-lavender border-t-plum" />
        Cargando contenido...
      </span>
    </div>
  );
}

export default function App() {
  const [currentPath, setCurrentPath] = useState(getCurrentPath);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const Page = currentPath.startsWith("/producto/")
    ? ProductPage
    : ROUTES[currentPath] ?? HomePage;

  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash.startsWith("#/")) {
        setCurrentPath(getCurrentPath());
      }
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [currentPath]);

  return (
    <div className="min-h-screen overflow-x-hidden bg-cream text-ink">
      <a className="skip-link" href="#contenido">
        Ir al contenido
      </a>
      <Header
        currentPath={currentPath}
        onOpenOrderModal={() => setIsOrderModalOpen(true)}
      />
      <main id="contenido">
        <div key={currentPath} className="page-enter">
          <Suspense fallback={<PageLoadingFallback />}>
            <Page
              currentPath={currentPath}
              onOpenOrderModal={() => setIsOrderModalOpen(true)}
            />
          </Suspense>
        </div>
      </main>
      <Footer />
      <WhatsAppFloat />
      <CustomOrderModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
      />
    </div>
  );
}
