import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const TasksSection = () => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setTasks(data || []);
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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-destructive text-destructive-foreground';
      case 'medium': return 'bg-secondary text-secondary-foreground';
      case 'low': return 'bg-muted text-muted-foreground';
      default: return 'bg-muted text-muted-foreground';
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
            Tasks
          </h2>
          <p className="text-muted-foreground">Track and manage your tasks</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90 shadow-[var(--shadow-neon)]">
          <Plus className="h-4 w-4 mr-2" />
          New Task
        </Button>
      </div>

      <div className="space-y-4">
        {tasks.map((task) => (
          <Card 
            key={task.id}
            className="bg-[var(--gradient-card)] border-border/50 hover:border-primary/50 transition-[var(--transition-smooth)]"
          >
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-lg text-foreground">{task.title}</CardTitle>
                  {task.description && (
                    <CardDescription className="mt-1">{task.description}</CardDescription>
                  )}
                </div>
                <Badge className={getPriorityColor(task.priority)}>
                  {task.priority}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>Status: <span className="text-accent">{task.status}</span></span>
                {task.due_date && (
                  <span>Due: {new Date(task.due_date).toLocaleDateString()}</span>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {tasks.length === 0 && (
        <Card className="bg-[var(--gradient-card)] border-border/50">
          <CardContent className="flex flex-col items-center justify-center h-64">
            <p className="text-muted-foreground mb-4">No tasks yet</p>
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              Create First Task
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
