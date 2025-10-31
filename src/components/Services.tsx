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
    <section className="py-20 px-4 bg-background">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-4 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Our <span className="text-primary">Services</span>
          </h2>
          <div className="h-1 w-24 bg-accent mx-auto rounded-full" />
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Comprehensive construction solutions designed to meet all your building needs
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <Card 
                key={index}
                className="group border-border hover:border-primary/50 transition-[var(--transition-smooth)] hover:shadow-[var(--shadow-card)] hover:-translate-y-1 bg-card"
              >
                <CardHeader>
                  <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-[var(--transition-smooth)]">
                    <Icon className="w-7 h-7 text-primary" />
                  </div>
                  <CardTitle className="text-xl text-foreground">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-muted-foreground">
                    {service.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Services;
