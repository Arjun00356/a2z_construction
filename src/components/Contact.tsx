import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Thank you for your message! We'll get back to you soon.");
    setFormData({ name: "", email: "", phone: "", message: "" });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  return (
    <section id="contact" className="py-20 px-4 bg-gradient-to-b from-secondary/30 to-background">
      <div className="max-w-2xl mx-auto space-y-8 animate-fade-in">
        <div className="text-center space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Get In <span className="text-primary">Touch</span>
          </h2>
          <div className="h-1 w-24 bg-accent mx-auto rounded-full" />
          <p className="text-muted-foreground">
            Ready to start your next project? Contact us today for a consultation.
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6 p-8 rounded-xl bg-card shadow-[var(--shadow-card)] border border-border">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-foreground">Name</Label>
              <Input
                id="name"
                placeholder="Your name"
                value={formData.name}
                onChange={handleChange}
                required
                className="bg-background border-border focus:ring-primary transition-[var(--transition-smooth)]"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                value={formData.email}
                onChange={handleChange}
                required
                className="bg-background border-border focus:ring-primary transition-[var(--transition-smooth)]"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-foreground">Phone</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+1 (555) 000-0000"
              value={formData.phone}
              onChange={handleChange}
              className="bg-background border-border focus:ring-primary transition-[var(--transition-smooth)]"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="message" className="text-foreground">Message</Label>
            <Textarea
              id="message"
              placeholder="Tell us about your project..."
              value={formData.message}
              onChange={handleChange}
              required
              rows={5}
              className="bg-background border-border focus:ring-primary transition-[var(--transition-smooth)] resize-none"
            />
          </div>
          
          <Button 
            type="submit"
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-[var(--shadow-soft)] transition-[var(--transition-smooth)] hover:scale-[1.02]"
          >
            Send Message
          </Button>
        </form>
      </div>
    </section>
  );
};

export default Contact;
