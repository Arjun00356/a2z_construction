import { Palette, Hammer, ClipboardCheck, Wrench, RefreshCcw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import interiorImg from "@/assets/service-interior.jpg";
import constructionImg from "@/assets/service-construction.jpg";
import consultancyImg from "@/assets/service-consultancy.jpg";
import retrofittingImg from "@/assets/service-retrofitting.jpg";

const services = [
  {
    icon: Palette,
    title: "Interior Design",
    description: "Transform spaces with innovative and sustainable interior design solutions tailored to your needs.",
    image: interiorImg,
    link: "/services/interior-design"
  },
  {
    icon: Hammer,
    title: "Construction Management",
    description: "Comprehensive project management ensuring timely delivery and quality control at every stage.",
    image: constructionImg,
    link: "/services/construction-management"
  },
  {
    icon: ClipboardCheck,
    title: "Consultancy",
    description: "Expert consultation services to guide your construction projects from concept to completion.",
    image: consultancyImg,
    link: "/services/consultancy"
  },
  {
    icon: Wrench,
    title: "Retrofitting",
    description: "Upgrade existing structures with modern, energy-efficient, and sustainable solutions.",
    image: retrofittingImg,
    link: "/services/retrofitting"
  }
];

const Services = () => {
  const navigate = useNavigate();

  return (
    <section id="services" className="py-24 px-6 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 animate-fade-in">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-6">Services</p>
          <h2 className="text-4xl md:text-5xl font-light tracking-tight mb-4">
            OUR EXPERTISE
          </h2>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <div 
                key={index}
                className="group cursor-pointer animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => navigate(service.link)}
              >
                <div className="aspect-square bg-background mb-6 overflow-hidden border border-border group-hover:border-primary/50 transition-colors">
                  <img 
                    src={service.image} 
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="flex items-center gap-3 mb-3">
                  <Icon className="w-6 h-6 text-primary" />
                  <h3 className="text-lg font-light uppercase tracking-wide">
                    {service.title}
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {service.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Services;
