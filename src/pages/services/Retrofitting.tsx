import { ArrowLeft, CheckCircle, Zap, Leaf, Shield, Wrench } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import retrofittingImg from "@/assets/service-retrofitting.jpg";

const Retrofitting = () => {
  const navigate = useNavigate();

  const usps = [
    "30-50% Energy Savings with Solar & LED Solutions",
    "Seismic Retrofitting for Earthquake Zones",
    "Heritage Building Restoration Expertise",
    "GRIHA & IGBC Green Building Certification Support",
    "Minimal Disruption with Occupied Building Work",
    "Government Subsidy Assistance (PMAY, Solar Schemes)"
  ];

  const services = [
    { icon: Zap, title: "Energy Efficiency", desc: "Solar panels, LED, insulation upgrades" },
    { icon: Leaf, title: "Green Solutions", desc: "Rainwater harvesting, waste management" },
    { icon: Shield, title: "Structural Strengthening", desc: "Foundation, column, beam reinforcement" },
    { icon: Wrench, title: "System Upgrades", desc: "Plumbing, electrical, HVAC modernization" }
  ];

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <section className="pt-32 pb-16 px-6 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/")}
            className="mb-8 hover:bg-primary/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-4">Our Expertise</p>
              <h1 className="text-5xl md:text-6xl font-light tracking-tight mb-6">
                Retrofitting Services
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                Upgrade existing structures with modern, energy-efficient, and sustainable solutions. Extend building lifespan, 
                improve safety standards, and reduce operational costs. Specialized in old building restoration, seismic 
                retrofitting, and green building conversions compliant with Indian building codes.
              </p>
              <div className="flex gap-4">
                <Button 
                  size="lg"
                  onClick={() => {
                    navigate("/");
                    setTimeout(() => {
                      document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
                    }, 100);
                  }}
                >
                  Get Site Assessment
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  onClick={() => {
                    navigate("/");
                    setTimeout(() => {
                      document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
                    }, 100);
                  }}
                >
                  Case Studies
                </Button>
              </div>
            </div>

            <div className="animate-fade-in-up">
              <img 
                src={retrofittingImg} 
                alt="Retrofitting Services"
                className="w-full h-[500px] object-cover rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-light tracking-tight mb-12 text-center">Key Benefits</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {usps.map((usp, index) => (
              <Card key={index} className="animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <CardContent className="p-6 flex items-start gap-4">
                  <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <p className="text-muted-foreground">{usp}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-6 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-light tracking-tight mb-12 text-center">Retrofitting Solutions</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <Card key={index} className="animate-fade-in-up hover:shadow-lg transition-shadow" style={{ animationDelay: `${index * 0.1}s` }}>
                  <CardContent className="p-6 text-center">
                    <Icon className="w-12 h-12 text-primary mx-auto mb-4" />
                    <h3 className="text-xl font-light mb-2">{service.title}</h3>
                    <p className="text-sm text-muted-foreground">{service.desc}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Retrofitting;
