import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import heroBg from "@/assets/hero-bg.jpg";
import logo from "@/assets/a2z-logo.png";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: `url(${heroBg})` }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/70 to-background/80" />
      
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto space-y-8">
        <div className="inline-block mb-4 animate-scale-in">
          <img src={logo} alt="A2Z Construction" className="h-40 w-auto mx-auto" />
        </div>
        
        <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight animate-fade-in-up">
          A2Z Construction
        </h2>
        
        <p className="text-2xl md:text-3xl text-primary font-semibold animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          Building Smarter. Building Greener.
        </p>
        
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          Sustainable and innovative construction solutions for a better tomorrow
        </p>
        
        <div className="pt-8 flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
          <Button 
            size="lg"
            onClick={() => navigate("/login")}
            className="text-lg px-12 py-6 bg-primary hover:bg-primary/90 text-primary-foreground shadow-[var(--shadow-soft)] transition-[var(--transition-smooth)] hover:scale-105"
          >
            Login
          </Button>
          <Button 
            size="lg"
            onClick={() => navigate("/signup")}
            variant="outline"
            className="text-lg px-12 py-6 border-primary text-primary hover:bg-primary hover:text-primary-foreground shadow-[var(--shadow-soft)] transition-[var(--transition-smooth)] hover:scale-105"
          >
            Sign Up
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Landing;
