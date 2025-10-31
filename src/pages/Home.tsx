import Hero from "@/components/Hero";
import About from "@/components/About";
import Services from "@/components/Services";
import Contact from "@/components/Contact";

const Home = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <About />
      <Services />
      <Contact />
      
      <footer className="bg-primary text-primary-foreground py-8 px-4">
        <div className="max-w-6xl mx-auto text-center space-y-2">
          <p className="font-semibold text-lg">A2Z Construction</p>
          <p className="text-sm opacity-90">Building Smarter. Building Greener.</p>
          <p className="text-xs opacity-75">© 2024 A2Z Construction. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
