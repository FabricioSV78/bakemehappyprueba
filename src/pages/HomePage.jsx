import Contact from "../components/Contact";
import BestSellers from "../components/BestSellers";
import FAQ from "../components/FAQ";
import FeaturedGallery from "../components/FeaturedGallery";
import Hero from "../components/Hero";
import Testimonials from "../components/Testimonials";

export default function HomePage() {
  return (
    <>
      <Hero />
      <BestSellers />
      <FeaturedGallery />
      <FAQ />
      <Testimonials />
      <Contact />
    </>
  );
}
