import Contact from "../components/Contact";
import FAQ from "../components/FAQ";
import FeaturedGallery from "../components/FeaturedGallery";
import Hero from "../components/Hero";
import Testimonials from "../components/Testimonials";

export default function HomePage() {
  return (
    <>
      <Hero />
      <FeaturedGallery />
      <FAQ />
      <Testimonials />
      <Contact />
    </>
  );
}
