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
    message: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Thank you for your message! We'll get back to you soon.");
    setFormData({ name: "", email: "", message: "" });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <section id="contact" className="py-24 px-6 bg-background">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-16 animate-fade-in">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-6">Contact</p>
          <h2 className="text-4xl md:text-5xl font-light tracking-tight mb-4">
            LET'S BUILD TOGETHER
          </h2>
          <p className="text-muted-foreground text-sm">Email: <a href="mailto:A2Z@GMAIL.COM" className="text-primary hover:underline">A2Z@GMAIL.COM</a></p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-xs uppercase tracking-wider">Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="bg-background border-border border-t-0 border-l-0 border-r-0 rounded-none px-0 focus-visible:ring-0 focus-visible:border-primary"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs uppercase tracking-wider">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="bg-background border-border border-t-0 border-l-0 border-r-0 rounded-none px-0 focus-visible:ring-0 focus-visible:border-primary"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message" className="text-xs uppercase tracking-wider">Message</Label>
            <Textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows={5}
              className="bg-background border-border border-t-0 border-l-0 border-r-0 rounded-none px-0 focus-visible:ring-0 focus-visible:border-primary resize-none"
            />
          </div>

          <div className="flex justify-center pt-4">
            <Button 
              type="submit" 
              className="bg-foreground hover:bg-foreground/90 text-background uppercase text-xs tracking-wider px-12"
            >
              Send Message
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Contact;
