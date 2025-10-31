const About = () => {
  return (
    <section id="about" className="py-24 px-6 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="animate-slide-in-left">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-6">About</p>
            <h2 className="text-5xl md:text-6xl font-light mb-8 tracking-tight">
              BUILDING SMARTER.<br />
              BUILDING GREENER.
            </h2>
          </div>
          
          <div className="space-y-8 animate-slide-in-right">
            <div>
              <h3 className="text-xl font-light mb-4 uppercase tracking-wide">Our Mission</h3>
              <p className="text-muted-foreground leading-relaxed">
                To revolutionize the construction industry through sustainable practices and innovative solutions that create lasting value for our clients and communities.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-light mb-4 uppercase tracking-wide">Our Vision</h3>
              <p className="text-muted-foreground leading-relaxed">
                To be the leading sustainable construction company, setting new standards in eco-friendly building practices and delivering excellence in every project.
              </p>
            </div>
            
            <p className="text-muted-foreground leading-relaxed pt-4 border-t border-border">
              With years of experience in the construction industry, A2Z Construction has built a reputation for excellence, reliability, and innovation. We specialize in sustainable building practices, cutting-edge design, and comprehensive project management.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
