import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const ProjectsSection = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Projects
          </h2>
          <p className="text-muted-foreground">Manage your construction projects</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90 shadow-[var(--shadow-neon)]">
          <Plus className="h-4 w-4 mr-2" />
          New Project
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Card 
            key={project.id} 
            className="bg-[var(--gradient-card)] border-border/50 hover:border-primary/50 transition-[var(--transition-smooth)] hover:shadow-[var(--shadow-card)]"
          >
            <CardHeader>
              <CardTitle className="text-foreground">{project.name}</CardTitle>
              <CardDescription>{project.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <span className="text-accent font-medium">{project.status}</span>
                </div>
                {project.budget && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Budget:</span>
                    <span className="text-foreground font-medium">${Number(project.budget).toLocaleString()}</span>
                  </div>
                )}
                {project.location && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Location:</span>
                    <span className="text-foreground">{project.location}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {projects.length === 0 && (
        <Card className="bg-[var(--gradient-card)] border-border/50">
          <CardContent className="flex flex-col items-center justify-center h-64">
            <p className="text-muted-foreground mb-4">No projects yet</p>
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              Create First Project
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
