import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import CustomOrderModal from "./components/CustomOrderModal";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Seo from "./components/Seo";
import WhatsAppFloat from "./components/WhatsAppFloat";
import HomePage from "./pages/HomePage";
import { categories, products } from "./data/products";
import {
  CATALOG_PRELOAD,
  IMAGE_ASSETS,
  IMAGE_SIZES,
  RESPONSIVE_IMAGE_WIDTHS,
  getCatalogPreloadCount,
} from "./data/imageDelivery";
import { getSeoForLocation } from "./data/seo";
import {
  preloadCatalogProductImage,
  preloadImageAsset,
  preloadProductAssets,
} from "./utils/assets";

const AboutPage = lazy(() => import("./pages/AboutPage"));
const CatalogPage = lazy(() => import("./pages/CatalogPage"));
const OrderPage = lazy(() => import("./pages/OrderPage"));
const ProductPage = lazy(() => import("./pages/ProductPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));
const catalogProducts = products.filter((product) =>
  categories.includes(product.category),
);

function preloadAboutImage() {
  return preloadImageAsset(IMAGE_ASSETS.aboutPrimary, {
    fetchPriority: "high",
    responsiveWidths: RESPONSIVE_IMAGE_WIDTHS.product,
    sizes: IMAGE_SIZES.editorial,
    sourceWidth: 1536,
  });
}

const ROUTES = {
  "/": HomePage,
  "/quienes-somos": AboutPage,
  "/tienda": CatalogPage,
  "/pedido": OrderPage,
};

function normalizePathname(pathname) {
  return pathname.length > 1 ? pathname.replace(/\/+$/, "") : "/";
}

function migrateLegacyHashRoute() {
  const legacyRoute = window.location.hash;

  if (!legacyRoute.startsWith("#/")) return;

  window.history.replaceState(
    window.history.state,
    "",
    legacyRoute.slice(1),
  );
}

function redirectLegacyCatalogRoute() {
  if (normalizePathname(window.location.pathname) !== "/catalogo") return;

  window.history.replaceState(
    window.history.state,
    "",
    `/tienda${window.location.search}${window.location.hash}`,
  );
}

function getCurrentLocation() {
  migrateLegacyHashRoute();
  redirectLegacyCatalogRoute();

  return `${normalizePathname(window.location.pathname)}${window.location.search}${window.location.hash}`;
}

function getPathname(location) {
  return normalizePathname(location.split(/[?#]/, 1)[0] || "/");
}

function isApplicationPath(pathname) {
  return Boolean(ROUTES[pathname]) || pathname.startsWith("/producto/");
}

function getCatalogPreviewProducts(location) {
  const url = new URL(location, window.location.origin);
  const requestedCategory = url.searchParams.get("categoria");
  const matchingProducts = requestedCategory
    ? catalogProducts.filter((product) => product.category === requestedCategory)
    : catalogProducts;
  const isDesktop = window.matchMedia(CATALOG_PRELOAD.desktopMedia).matches;

  return matchingProducts.slice(0, getCatalogPreloadCount(isDesktop));
}

function PageLoadingFallback() {
  return (
    <div
      className="grid min-h-[100svh] place-items-center bg-cream px-5 pt-28 lg:pt-40"
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
  const [currentLocation, setCurrentLocation] = useState(getCurrentLocation);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const currentPath = getPathname(currentLocation);
  const Page = currentPath.startsWith("/producto/")
    ? ProductPage
    : ROUTES[currentPath] ?? NotFoundPage;
  const seo = useMemo(
    () => getSeoForLocation(currentLocation, currentPath),
    [currentLocation, currentPath],
  );

  useEffect(() => {
    const handlePopState = () => setCurrentLocation(getCurrentLocation());
    const handleInternalNavigation = (event) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const target = event.target instanceof Element ? event.target : null;
      const link = target?.closest("a[href]");
      const href = link?.getAttribute("href") ?? "";

      if (
        !link ||
        !href ||
        href.startsWith("#") ||
        link.hasAttribute("download") ||
        (link.target && link.target !== "_self")
      ) {
        return;
      }

      const destination = new URL(link.href, window.location.href);
      const pathname = normalizePathname(destination.pathname);

      if (
        destination.origin !== window.location.origin ||
        !isApplicationPath(pathname)
      ) {
        return;
      }

      event.preventDefault();
      const nextLocation = `${pathname}${destination.search}${destination.hash}`;

      if (nextLocation === currentLocation) {
        window.scrollTo({ top: 0, behavior: "auto" });
        return;
      }

      window.history.pushState({}, "", nextLocation);
      setCurrentLocation(nextLocation);
    };

    window.addEventListener("popstate", handlePopState);
    document.addEventListener("click", handleInternalNavigation);

    return () => {
      window.removeEventListener("popstate", handlePopState);
      document.removeEventListener("click", handleInternalNavigation);
    };
  }, [currentLocation]);

  useEffect(() => {
    const prepareLinkedRoute = (event) => {
      const target = event.target instanceof Element ? event.target : null;
      const link = target?.closest("a[href]");
      if (!link) return;

      const destination = new URL(link.href, window.location.href);
      if (destination.origin !== window.location.origin) return;

      const pathname = normalizePathname(destination.pathname);

      if (pathname === "/tienda") {
        getCatalogPreviewProducts(destination.href).forEach((product, index) => {
          void preloadCatalogProductImage(
            product,
            index === 0 ? "high" : "auto",
          );
        });
        return;
      }

      if (pathname === "/quienes-somos") {
        void preloadAboutImage();
        return;
      }

      if (pathname.startsWith("/producto/")) {
        const productId = Number.parseInt(pathname.split("/").pop(), 10);
        const product = products.find((item) => item.id === productId);
        if (product) void preloadProductAssets(product);
      }
    };

    document.addEventListener("pointerover", prepareLinkedRoute, {
      passive: true,
    });
    document.addEventListener("focusin", prepareLinkedRoute);

    return () => {
      document.removeEventListener("pointerover", prepareLinkedRoute);
      document.removeEventListener("focusin", prepareLinkedRoute);
    };
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [currentLocation]);

  useEffect(() => {
    if (currentPath.startsWith("/producto/")) {
      const productId = Number.parseInt(currentPath.split("/").pop(), 10);
      const product = products.find((item) => item.id === productId);

      if (product) void preloadProductAssets(product);
      return;
    }

    if (currentPath === "/tienda") {
      getCatalogPreviewProducts(currentLocation).forEach((product, index) => {
        void preloadCatalogProductImage(
          product,
          index === 0 ? "high" : "auto",
        );
      });
      return;
    }

    if (currentPath === "/quienes-somos") void preloadAboutImage();
  }, [currentLocation, currentPath]);

  return (
    <div className="min-h-screen overflow-x-hidden bg-cream text-ink">
      <Seo {...seo} />
      <a className="skip-link" href="#contenido">
        Ir al contenido
      </a>
      <Header
        currentPath={currentPath}
        onOpenOrderModal={() => setIsOrderModalOpen(true)}
      />
      <main id="contenido">
        <div key={currentLocation} className="page-enter">
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
