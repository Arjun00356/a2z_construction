import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import heroBg from "@/assets/hero-bg.jpg";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: `url(${heroBg})` }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/70 to-background/80" />
      
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto space-y-8 animate-fade-in">
        <div className="inline-block bg-primary rounded-lg p-8 mb-4 shadow-[var(--shadow-card)]">
          <h1 className="text-5xl md:text-6xl font-bold text-primary-foreground">A2Z</h1>
        </div>
        
        <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight">
          A2Z Construction
        </h2>
        
        <p className="text-2xl md:text-3xl text-primary font-semibold">
          Building Smarter. Building Greener.
        </p>
        
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          Sustainable and innovative construction solutions for a better tomorrow
        </p>
        
        <div className="pt-8">
          <Button 
            size="lg"
            onClick={() => navigate("/login")}
            className="text-lg px-12 py-6 bg-primary hover:bg-primary/90 text-primary-foreground shadow-[var(--shadow-soft)] transition-[var(--transition-smooth)] hover:scale-105"
          >
            Login to Get Started
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Landing;
