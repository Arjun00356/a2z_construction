import { Facebook, Youtube, Instagram } from "lucide-react";
import logo from "@/assets/a2z-logo.png";

const Footer = () => {
  return (
    <footer className="bg-background border-t border-border">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <img src={logo} alt="A2Z Construction" className="h-20 w-auto mb-4" />
          </div>
          
          <div className="flex flex-col items-start md:items-end gap-6">
            <nav className="flex flex-col items-start md:items-end gap-4">
              <a href="#" className="text-sm uppercase tracking-wider hover:text-primary transition-colors">About A2Z</a>
              <a href="#" className="text-sm uppercase tracking-wider hover:text-primary transition-colors">Who We Are</a>
              <a href="#" className="text-sm uppercase tracking-wider hover:text-primary transition-colors">Services</a>
              <a href="#" className="text-sm uppercase tracking-wider hover:text-primary transition-colors">Blog</a>
              <a href="#" className="text-sm uppercase tracking-wider hover:text-primary transition-colors">Contact Us</a>
              <a href="#" className="text-sm uppercase tracking-wider hover:text-primary transition-colors">Compliance</a>
            </nav>
            
            <div className="flex gap-4">
              <a href="#" className="hover:text-primary transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
      
      <div className="border-t border-border">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row gap-4 justify-center items-center text-xs uppercase tracking-wider text-muted-foreground">
            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
            <span className="hidden md:inline">|</span>
            <a href="#" className="hover:text-primary transition-colors">Disclaimer</a>
            <span className="hidden md:inline">|</span>
            <a href="#" className="hover:text-primary transition-colors">Terms & Conditions</a>
            <span className="hidden md:inline">|</span>
            <a href="#" className="hover:text-primary transition-colors">Country and Language</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
