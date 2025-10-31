const About = () => {
  return (
    <section id="about" className="py-20 px-4 bg-gradient-to-b from-background to-secondary/30">
      <div className="max-w-4xl mx-auto space-y-12 animate-fade-in">
        <div className="text-center space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            About <span className="text-primary">A2Z Construction</span>
          </h2>
          <div className="h-1 w-24 bg-accent mx-auto rounded-full" />
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4 p-8 rounded-xl bg-card shadow-[var(--shadow-card)] border border-border hover:shadow-[var(--shadow-soft)] transition-[var(--transition-smooth)]">
            <h3 className="text-2xl font-semibold text-primary">Our Mission</h3>
            <p className="text-muted-foreground leading-relaxed">
              To revolutionize the construction industry through sustainable practices, innovative solutions, 
              and unwavering commitment to quality. We build structures that stand the test of time while 
              protecting our planet for future generations.
            </p>
          </div>
          
          <div className="space-y-4 p-8 rounded-xl bg-card shadow-[var(--shadow-card)] border border-border hover:shadow-[var(--shadow-soft)] transition-[var(--transition-smooth)]">
            <h3 className="text-2xl font-semibold text-primary">Our Vision</h3>
            <p className="text-muted-foreground leading-relaxed">
              To be the leading construction company recognized for excellence in sustainable building practices, 
              delivering innovative solutions that exceed client expectations while minimizing environmental impact.
            </p>
          </div>
        </div>
        
        <div className="p-8 rounded-xl bg-card shadow-[var(--shadow-card)] border border-border">
          <p className="text-center text-lg text-foreground leading-relaxed">
            With years of experience in the construction industry, A2Z Construction has built a reputation 
            for delivering high-quality projects on time and within budget. Our team of skilled professionals 
            is dedicated to transforming your vision into reality through comprehensive services ranging from 
            interior design to complete construction management.
          </p>
        </div>
      </div>
    </section>
  );
};

export default About;
