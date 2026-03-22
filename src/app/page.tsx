import { Hero } from "@/components/home/Hero";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { ConcernCards } from "@/components/home/ConcernCards";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { WhyYuveda } from "@/components/home/WhyYuveda";
import { Testimonials } from "@/components/home/Testimonials";

export default function HomePage() {
  return (
    <>
      <Hero />
      <CategoryGrid />
      <ConcernCards />
      <FeaturedProducts />
      <WhyYuveda />
      <Testimonials />
    </>
  );
}
