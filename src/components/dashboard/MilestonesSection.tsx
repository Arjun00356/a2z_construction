import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Flag, CheckCircle2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export const MilestonesSection = () => {
  const [milestones, setMilestones] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    project_id: '',
    title: '',
    description: '',
    target_date: ''
  });

  useEffect(() => {
    fetchMilestones();
    fetchProjects();
  }, []);

  const fetchMilestones = async () => {
    const { data, error } = await supabase
      .from('milestones')
      .select('*, projects(name)')
      .order('target_date', { ascending: true });
    
    if (!error) setMilestones(data || []);
    setLoading(false);
  };

  const fetchProjects = async () => {
    const { data } = await supabase
      .from('projects')
      .select('id, name')
      .order('name');
    setProjects(data || []);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from('milestones').insert(formData);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Milestone created" });
      setIsOpen(false);
      setFormData({ project_id: '', title: '', description: '', target_date: '' });
      fetchMilestones();
    }
  };

  const toggleComplete = async (id: string, completed: boolean) => {
    const { error } = await supabase
      .from('milestones')
      .update({ 
        completed: !completed,
        completed_at: !completed ? new Date().toISOString() : null
      })
      .eq('id', id);

    if (!error) {
      toast({ title: "Success", description: "Milestone updated" });
      fetchMilestones();
    }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Project Milestones</h2>
          <p className="text-muted-foreground mt-1">Track key project achievements</p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="cyber-button"><Flag className="w-4 h-4 mr-2" />New Milestone</Button>
          </DialogTrigger>
          <DialogContent className="glass-card border-primary/20">
            <DialogHeader>
              <DialogTitle>Create Milestone</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Project</Label>
                <select 
                  className="w-full px-3 py-2 border rounded-md bg-background"
                  value={formData.project_id}
                  onChange={(e) => setFormData({...formData, project_id: e.target.value})}
                  required
                >
                  <option value="">Select Project</option>
                  {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
              <div>
                <Label>Title</Label>
                <Input value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} required />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
              </div>
              <div>
                <Label>Target Date</Label>
                <Input type="date" value={formData.target_date} onChange={(e) => setFormData({...formData, target_date: e.target.value})} required />
              </div>
              <Button type="submit" className="w-full">Create Milestone</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-3">
        {milestones.map((milestone) => (
          <Card key={milestone.id} className="glass-card border-primary/20 p-4 hover:border-accent transition-all">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{milestone.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{milestone.description}</p>
                <div className="flex gap-4 mt-2">
                  <p className="text-xs text-primary">{milestone.projects?.name}</p>
                  <p className="text-xs text-muted-foreground">
                    Target: {new Date(milestone.target_date).toLocaleDateString()}
                  </p>
                </div>
                {milestone.completed_at && (
                  <p className="text-xs text-green-500 mt-1">
                    ✓ Completed: {new Date(milestone.completed_at).toLocaleDateString()}
                  </p>
                )}
              </div>
              <Button
                size="sm"
                variant={milestone.completed ? "default" : "outline"}
                onClick={() => toggleComplete(milestone.id, milestone.completed)}
              >
                {milestone.completed ? <CheckCircle2 className="w-4 h-4 mr-1" /> : null}
                {milestone.completed ? 'Completed' : 'Mark Complete'}
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
