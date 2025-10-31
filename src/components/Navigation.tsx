import { Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/a2z-logo.png";

const Navigation = () => {
  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-b border-border z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src={logo} alt="A2Z Construction" className="h-16 w-auto" />
        </div>
        
        <div className="hidden md:flex items-center gap-8">
          <button 
            onClick={() => scrollToSection("about")}
            className="text-sm uppercase tracking-wider text-foreground hover:text-primary transition-colors"
          >
            About
          </button>
          <button 
            onClick={() => scrollToSection("projects")}
            className="text-sm uppercase tracking-wider text-foreground hover:text-primary transition-colors"
          >
            Projects
          </button>
          <button 
            onClick={() => scrollToSection("services")}
            className="text-sm uppercase tracking-wider text-foreground hover:text-primary transition-colors"
          >
            Services
          </button>
          <button 
            onClick={() => scrollToSection("contact")}
            className="text-sm uppercase tracking-wider text-foreground hover:text-primary transition-colors"
          >
            Contact Us
          </button>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden lg:flex flex-col text-right text-xs">
            <span className="text-muted-foreground">+91 8770122794 - Mr. Arjun Mishra</span>
            <span className="text-muted-foreground">+91 8949930566</span>
          </div>
          <Button 
            variant="ghost" 
            size="sm"
            className="hidden md:flex items-center gap-2"
            onClick={() => window.location.href = 'tel:+918770122794'}
          >
            <Phone className="w-4 h-4" />
            <span className="uppercase text-xs tracking-wider">Call</span>
          </Button>
          <Button 
            size="sm"
            onClick={() => scrollToSection("contact")}
            className="bg-foreground text-background hover:bg-foreground/90 uppercase text-xs tracking-wider px-6"
          >
            Get in Touch
          </Button>
          <Button 
            size="sm"
            variant="outline"
            onClick={() => window.location.href = '/login'}
            className="uppercase text-xs tracking-wider px-6"
          >
            Login
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
