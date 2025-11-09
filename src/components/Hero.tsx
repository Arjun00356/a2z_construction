import { useState } from "react";
import { Button } from "@/components/ui/button";
import heroBg from "@/assets/hero-bg.jpg";
import ServiceSelectionDialog from "./ServiceSelectionDialog";
import { Calculator } from "lucide-react";

interface HeroProps {
  onOpenCostEstimator?: () => void;
}

const Hero = ({ onOpenCostEstimator }: HeroProps) => {
  const [showServiceDialog, setShowServiceDialog] = useState(false);

  return (
    <>
      <section 
        className="relative h-screen flex items-end bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBg})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
        
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 pb-20 animate-fade-in">
          <div className="text-background/10 text-8xl md:text-9xl font-bold mb-4">
            A2Z
          </div>
          <h1 className="text-2xl md:text-3xl font-light text-foreground mb-4 tracking-wide">
            CONSTRUCTION
          </h1>
          <p className="text-foreground/80 mb-8 max-w-2xl text-lg">
            Building your dreams with precision and expertise. Get instant cost estimates for your next project.
          </p>
          <Button 
            onClick={onOpenCostEstimator}
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all"
          >
            <Calculator className="mr-2 h-5 w-5" />
            Get Free Cost Estimate
          </Button>
        </div>
      </section>

      <ServiceSelectionDialog open={showServiceDialog} onOpenChange={setShowServiceDialog} />
    </>
  );
};

export default Hero;
