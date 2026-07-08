import { ArrowRight } from "lucide-react";
import ProductCard from "./ProductCard";
import SectionHeading from "./SectionHeading";
import { products } from "../data/products";

const bestSellerProductIds = [1, 6, 7, 8];
const bestSellerProducts = bestSellerProductIds
  .map((productId) => products.find((product) => product.id === productId))
  .filter(Boolean);

export default function BestSellers() {
  return (
    <section
      id="mas-vendido"
      className="relative overflow-hidden border-y border-blush/35 bg-[linear-gradient(180deg,#FFFDFC_0%,#FFF4F8_54%,#F8F6FF_100%)] py-20 sm:py-24"
      aria-labelledby="best-sellers-title"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-soft-grid opacity-30 [background-size:28px_28px]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute left-[-8%] top-10 h-40 w-40 rounded-full bg-blush/35 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute bottom-0 right-[-6%] h-52 w-52 rounded-full bg-lavender/35 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex flex-col items-center">
          <SectionHeading
            eyebrow="Lo mas vendido"
            title="Las tortas favoritas para celebrar"
            description="Las preferidas de nuestros clientes, encuentralas en sus diferentes tamaños y sabores"
          />
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {bestSellerProducts.map((product, index) => (
            <div key={product.id} className="relative">
              {index < bestSellerProducts.length - 1 && (
                <div
                  className="absolute right-0 top-8 hidden h-[72%] w-px bg-[radial-gradient(circle,rgba(247,200,216,0.95)_0%,rgba(247,200,216,0)_72%)] xl:block"
                  aria-hidden="true"
                />
              )}
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <a href="#/tienda" className="button-secondary min-w-[220px]">
            Ver mas tortas
            <ArrowRight size={18} aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}
