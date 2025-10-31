import { Palette, Hammer, ClipboardCheck, Wrench } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const services = [
  {
    icon: Palette,
    title: "Interior Designing",
    description: "Transform your spaces with innovative and sustainable interior design solutions."
  },
  {
    icon: Hammer,
    title: "Construction Management",
    description: "Comprehensive project management ensuring quality control at every stage."
  },
  {
    icon: ClipboardCheck,
    title: "Consultancy Services",
    description: "Expert consultation to guide your projects from concept to completion."
  },
  {
    icon: Wrench,
    title: "Retrofitting and Repairs",
    description: "Home, Kitchen, Bathroom, and Furniture upgrades with modern solutions."
  }
];

interface ServiceSelectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ServiceSelectionDialog = ({ open, onOpenChange }: ServiceSelectionDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold text-center text-foreground">
            Choose Your <span className="text-primary">Service</span>
          </DialogTitle>
          <DialogDescription className="text-center text-muted-foreground">
            Select the service that best fits your needs
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid md:grid-cols-2 gap-4 mt-6">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <Card 
                key={index}
                className="group cursor-pointer border-border hover:border-primary/50 transition-[var(--transition-smooth)] hover:shadow-[var(--shadow-card)] hover:-translate-y-1 bg-background"
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
      </DialogContent>
    </Dialog>
  );
};

export default ServiceSelectionDialog;
