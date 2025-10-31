const projects = [
  {
    title: "A2Z Green Towers",
    subtitle: "Sustainable Living Spaces",
    description: "Eco-friendly residential complex with modern amenities"
  },
  {
    title: "Smart Office Hub",
    subtitle: "Next-Gen Workspaces",
    description: "Intelligent commercial spaces for the future of work"
  }
];

const LatestProjects = () => {
  return (
    <section id="projects" className="py-24 px-6 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-6">Projects</p>
            <h2 className="text-5xl md:text-6xl font-light mb-8 tracking-tight">
              LATEST LAUNCHES
            </h2>
            <p className="text-muted-foreground leading-relaxed text-lg">
              Each of our properties have their own unique design aesthetics, providing an aspirational lifestyle within a thriving community which is supported by A2Z's comprehensive project management team.
            </p>
          </div>
          
          <div className="space-y-8">
            {projects.map((project, index) => (
              <div key={index} className="border-t border-border pt-8">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-2xl font-light tracking-wide">
                    {project.title.toUpperCase()}
                  </h3>
                  <span className="text-xs bg-foreground text-background px-3 py-1">
                    Featured-Image-{index + 1}
                  </span>
                </div>
                <p className="text-sm uppercase tracking-wider text-muted-foreground mb-2">
                  {project.subtitle}
                </p>
                <p className="text-muted-foreground">
                  {project.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default LatestProjects;
