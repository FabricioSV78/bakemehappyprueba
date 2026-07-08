import { useEffect, useState } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import WhatsAppFloat from "./components/WhatsAppFloat";
import AboutPage from "./pages/AboutPage";
import CatalogPage from "./pages/CatalogPage";
import HomePage from "./pages/HomePage";
import OrderPage from "./pages/OrderPage";
import ProductPage from "./pages/ProductPage";

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

export default function App() {
  const [currentPath, setCurrentPath] = useState(getCurrentPath);
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
      <Header currentPath={currentPath} />
      <main id="contenido">
        <Page currentPath={currentPath} />
      </main>
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
