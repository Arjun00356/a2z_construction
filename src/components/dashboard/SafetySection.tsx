import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';

export const SafetySection = () => {
  const [checklists, setChecklists] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    project_id: '',
    title: '',
    description: ''
  });

  useEffect(() => {
    fetchChecklists();
    fetchProjects();
  }, []);

  const fetchChecklists = async () => {
    const { data, error } = await supabase
      .from('safety_checklists')
      .select('*, projects(name)')
      .order('created_at', { ascending: false });
    
    if (!error) setChecklists(data || []);
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
    const { error } = await supabase.from('safety_checklists').insert(formData);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Safety checklist created" });
      setIsOpen(false);
      setFormData({ project_id: '', title: '', description: '' });
      fetchChecklists();
    }
  };

  const toggleComplete = async (id: string, completed: boolean) => {
    const { data: { user } } = await supabase.auth.getUser();
    const { data: profile } = await supabase
      .from('profiles')
      .select('id')
      .eq('user_id', user?.id)
      .single();

    const { error } = await supabase
      .from('safety_checklists')
      .update({ 
        completed: !completed,
        completed_by: !completed ? profile?.id : null,
        completed_at: !completed ? new Date().toISOString() : null
      })
      .eq('id', id);

    if (!error) {
      toast({ title: "Success", description: "Checklist updated" });
      fetchChecklists();
    }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Safety Checklists</h2>
          <p className="text-muted-foreground mt-1">Ensure workplace safety compliance</p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="cyber-button"><ShieldCheck className="w-4 h-4 mr-2" />New Checklist</Button>
          </DialogTrigger>
          <DialogContent className="glass-card border-primary/20">
            <DialogHeader>
              <DialogTitle>Create Safety Checklist</DialogTitle>
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
                <Label>Checklist Title</Label>
                <Input value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} required />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
              </div>
              <Button type="submit" className="w-full">Create Checklist</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-3">
        {checklists.map((checklist) => (
          <Card key={checklist.id} className="glass-card border-primary/20 p-4 hover:border-accent transition-all">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{checklist.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{checklist.description}</p>
                <p className="text-xs text-primary mt-2">{checklist.projects?.name}</p>
                {checklist.completed_at && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Completed: {new Date(checklist.completed_at).toLocaleDateString()}
                  </p>
                )}
              </div>
              <Button
                size="sm"
                variant={checklist.completed ? "default" : "outline"}
                onClick={() => toggleComplete(checklist.id, checklist.completed)}
              >
                {checklist.completed ? <CheckCircle2 className="w-4 h-4 mr-1" /> : null}
                {checklist.completed ? 'Completed' : 'Mark Complete'}
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
