import { ArrowLeft, CheckCircle, HardHat, FileCheck, Users, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import constructionImg from "@/assets/service-construction.jpg";

const ConstructionManagement = () => {
  const navigate = useNavigate();

  const usps = [
    "RERA-Registered Projects Across Ghaziabad",
    "On-Time Delivery with Penalty Clauses",
    "Quality Assurance by IIT-Certified Engineers",
    "Transparent Pricing with No Hidden Costs",
    "ISO 9001:2015 Certified Processes",
    "10-Year Structural Warranty"
  ];

  const services = [
    { icon: HardHat, title: "Project Planning", desc: "End-to-end planning & scheduling" },
    { icon: FileCheck, title: "Quality Control", desc: "Material testing & compliance" },
    { icon: Users, title: "Team Management", desc: "Skilled labor & contractor coordination" },
    { icon: Shield, title: "Safety Standards", desc: "OSHA-compliant safety protocols" }
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
                Construction Management
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                Comprehensive construction management services ensuring timely delivery and quality control at every stage. 
                With expertise in residential, commercial, and industrial projects across NCR, we bring global standards to 
                Indian construction with locally sourced materials and skilled workforce.
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
                  Request Quotation
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
                  View Projects
                </Button>
              </div>
            </div>

            <div className="animate-fade-in-up">
              <img 
                src={constructionImg} 
                alt="Construction Management"
                className="w-full h-[500px] object-cover rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-light tracking-tight mb-12 text-center">Why Choose Us</h2>
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
          <h2 className="text-3xl font-light tracking-tight mb-12 text-center">Our Services</h2>
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

export default ConstructionManagement;
