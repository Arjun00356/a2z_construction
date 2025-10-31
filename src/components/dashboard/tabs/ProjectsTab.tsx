import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Calendar, DollarSign } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import CreateProjectDialog from '../dialogs/CreateProjectDialog';

interface ProjectsTabProps {
  userRole: string | null;
}

const ProjectsTab = ({ userRole }: ProjectsTabProps) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    const { data } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (data) setProjects(data);
    setLoading(false);
  };

  const statusColors: Record<string, string> = {
    planning: 'bg-blue-500/10 text-blue-500',
    in_progress: 'bg-green-500/10 text-green-500',
    on_hold: 'bg-yellow-500/10 text-yellow-500',
    completed: 'bg-purple-500/10 text-purple-500',
    cancelled: 'bg-red-500/10 text-red-500',
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Projects</h2>
          <p className="text-muted-foreground">Manage and track all construction projects</p>
        </div>
        {(userRole === 'admin' || userRole === 'engineer') && (
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Project
          </Button>
        )}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project: any) => (
          <Card key={project.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-xl">{project.name}</CardTitle>
                <Badge className={statusColors[project.status]}>
                  {project.status.replace('_', ' ')}
                </Badge>
              </div>
              <CardDescription className="line-clamp-2">{project.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {project.budget && (
                <div className="flex items-center text-sm text-muted-foreground">
                  <DollarSign className="mr-2 h-4 w-4" />
                  Budget: ${Number(project.budget).toLocaleString()}
                </div>
              )}
              {project.start_date && (
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="mr-2 h-4 w-4" />
                  {new Date(project.start_date).toLocaleDateString()}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <CreateProjectDialog 
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onProjectCreated={fetchProjects}
      />
    </div>
  );
};

export default ProjectsTab;
