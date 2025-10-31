import { useState } from "react";
import { Button } from "@/components/ui/button";
import heroBg from "@/assets/hero-bg.jpg";
import ServiceSelectionDialog from "./ServiceSelectionDialog";

const Hero = () => {
  const [showServiceDialog, setShowServiceDialog] = useState(false);


  return (
    <>
      <section 
        className="relative min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBg})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/60 to-background/80" />
        
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto space-y-8 animate-fade-in">
          <div className="inline-block bg-primary rounded-lg p-6 mb-4 shadow-[var(--shadow-card)]">
            <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground">A2Z Construction</h1>
          </div>
          
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight">
            Building Smarter.
            <br />
            <span className="text-primary">Building Greener.</span>
          </h2>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Sustainable and innovative construction solutions for a better tomorrow
          </p>
          
          <div className="flex gap-4 justify-center flex-wrap pt-4">
            <Button 
              size="lg" 
              onClick={() => setShowServiceDialog(true)}
              className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-[var(--shadow-soft)] transition-[var(--transition-smooth)] hover:scale-105"
            >
              Get Started
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })}
              className="border-primary text-primary hover:bg-primary/10 transition-[var(--transition-smooth)] hover:scale-105"
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>

      <ServiceSelectionDialog open={showServiceDialog} onOpenChange={setShowServiceDialog} />
    </>
  );
};

export default Hero;
