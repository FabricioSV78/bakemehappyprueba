import { ArrowRight } from "lucide-react";
import ProductCard from "./ProductCard";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import { products } from "../data/products";

const bestSellerProductIds = [101, 103, 7, 8];
const bestSellerProducts = bestSellerProductIds
  .map((productId) => products.find((product) => product.id === productId))
  .filter(Boolean);

export default function BestSellers() {
  return (
    <section
      id="mas-vendido"
      className="relative overflow-hidden border-y border-blush/25 bg-[linear-gradient(180deg,#FFFAF7_0%,#F8E8EC_54%,#EFF0FC_100%)] py-16 sm:py-24"
      aria-labelledby="best-sellers-title"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-soft-grid opacity-40 [background-size:28px_28px]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute left-[-8%] top-10 h-40 w-40 rounded-full bg-blush/50 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute bottom-0 right-[-6%] h-52 w-52 rounded-full bg-lavender/45 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex flex-col items-center">
          <SectionHeading
            eyebrow="Lo más vendido"
            title="Las tortas favoritas para celebrar"
            description="Conoce las preferidas de nuestros clientes y elige entre diferentes tamaños y sabores."
          />
        </div>

        <div className="mt-10 grid gap-4 min-[420px]:grid-cols-2 sm:gap-6 md:mt-12 xl:grid-cols-4">
          {bestSellerProducts.map((product, index) => (
            <Reveal
              key={product.id}
              className="relative"
              delay={(index % 4) * 70}
            >
              {index < bestSellerProducts.length - 1 && (
                <div
                  className="absolute right-0 top-8 hidden h-[72%] w-px bg-[radial-gradient(circle,rgba(234,134,168,0.95)_0%,rgba(234,134,168,0)_72%)] xl:block"
                  aria-hidden="true"
                />
              )}
              <ProductCard product={product} />
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-10 flex justify-center" delay={120}>
          <a href="/tienda" className="button-secondary min-w-[220px]">
            Ver mas tortas
            <ArrowRight size={18} aria-hidden="true" />
          </a>
        </Reveal>
      </div>
    </section>
  );
}
