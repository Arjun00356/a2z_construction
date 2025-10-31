import { useState } from "react";
import { Button } from "@/components/ui/button";
import heroBg from "@/assets/hero-bg.jpg";
import ServiceSelectionDialog from "./ServiceSelectionDialog";

const Hero = () => {
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
        </div>
      </section>

      <ServiceSelectionDialog open={showServiceDialog} onOpenChange={setShowServiceDialog} />
    </>
  );
};

export default Hero;
