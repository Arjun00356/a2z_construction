import { ChevronLeft, ChevronRight } from "lucide-react";
import project1 from "@/assets/project-1.jpg";
import project2 from "@/assets/project-2.jpg";
import project3 from "@/assets/project-3.jpg";
import project4 from "@/assets/project-4.jpg";

const projects = [
  {
    title: "A2Z CONSTRUCTION CENTRE",
    subtitle: "WHERE THE FUTURE OF CONSTRUCTION TAKES SHAPE.",
    description: "Modern Construction Office spaces",
    image: project1
  },
  {
    title: "ELITE RESIDENCE",
    subtitle: "AN OASIS OF LUXURY",
    description: "3 & 4 BHK residences",
    image: project2
  },
  {
    title: "URBAN ASCENT, DOWNTOWN",
    subtitle: "RISE ABOVE THE ORDINARY",
    description: "3 & 4 BHK residences",
    image: project3
  },
  {
    title: "GREEN VALLEY",
    subtitle: "A MEANINGFUL LIFE STARTS HERE.",
    description: "2,3 & 4 BHK Residences",
    image: project4
  }
];

const FeaturedProjects = () => {
  return (
    <section className="py-24 px-6 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-12 animate-fade-in">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-4">Projects</p>
            <h2 className="text-4xl md:text-5xl font-light tracking-tight">
              FEATURED PROJECTS
            </h2>
          </div>
          <div className="flex gap-4">
            <button className="w-10 h-10 border border-border hover:bg-muted transition-colors flex items-center justify-center">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button className="w-10 h-10 border border-border hover:bg-muted transition-colors flex items-center justify-center">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <div className="grid md:grid-cols-4 gap-8">
          {projects.map((project, index) => (
            <div 
              key={index} 
              className="group cursor-pointer animate-fade-in-up"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              <div className="aspect-[3/4] bg-muted mb-6 relative overflow-hidden">
                <img 
                  src={project.image} 
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <h3 className="text-xl font-light mb-2 tracking-wide">
                {project.title}
              </h3>
              <p className="text-xs uppercase tracking-wider text-muted-foreground mb-3">
                {project.subtitle}
              </p>
              <p className="text-sm text-muted-foreground">
                {project.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProjects;
