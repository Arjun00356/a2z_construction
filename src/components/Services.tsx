import { Palette, Hammer, ClipboardCheck, Wrench, RefreshCcw } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const services = [
  {
    icon: Palette,
    title: "Interior Design",
    description: "Transform spaces with innovative and sustainable interior design solutions tailored to your needs."
  },
  {
    icon: Hammer,
    title: "Construction Management",
    description: "Comprehensive project management ensuring timely delivery and quality control at every stage."
  },
  {
    icon: ClipboardCheck,
    title: "Consultancy",
    description: "Expert consultation services to guide your construction projects from concept to completion."
  },
  {
    icon: RefreshCcw,
    title: "Retrofitting",
    description: "Upgrade existing structures with modern, energy-efficient, and sustainable solutions."
  },
  {
    icon: Wrench,
    title: "Repairs & Maintenance",
    description: "Professional repair and maintenance services to keep your property in optimal condition."
  }
];

const Services = () => {
  return (
    <section id="services" className="py-24 px-6 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-6">Services</p>
          <h2 className="text-4xl md:text-5xl font-light tracking-tight mb-4">
            OUR EXPERTISE
          </h2>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.slice(0, 4).map((service, index) => {
            const Icon = service.icon;
            return (
              <div 
                key={index}
                className="group cursor-pointer"
              >
                <div className="aspect-square bg-background mb-6 flex items-center justify-center border border-border group-hover:border-primary/50 transition-colors">
                  <Icon className="w-12 h-12 text-primary" />
                </div>
                <h3 className="text-lg font-light mb-3 uppercase tracking-wide">
                  {service.title}
                </h3>
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
