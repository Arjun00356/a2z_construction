import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import About from "@/components/About";
import LatestProjects from "@/components/LatestProjects";
import FeaturedProjects from "@/components/FeaturedProjects";
import Services from "@/components/Services";
import Newsletter from "@/components/Newsletter";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import { CostPredictorChat } from "@/components/CostPredictorChat";

const Home = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <Hero />
      <About />
      <LatestProjects />
      <FeaturedProjects />
      <Services />
      <Newsletter />
      <Contact />
      <Footer />
      <CostPredictorChat />
    </div>
  );
};

export default Home;
