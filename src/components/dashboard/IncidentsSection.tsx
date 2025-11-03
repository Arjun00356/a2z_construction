import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader2, AlertTriangle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';

export const IncidentsSection = () => {
  const [incidents, setIncidents] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    project_id: '',
    title: '',
    description: '',
    severity: 'medium'
  });

  useEffect(() => {
    fetchIncidents();
    fetchProjects();
  }, []);

  const fetchIncidents = async () => {
    const { data, error } = await supabase
      .from('incidents')
      .select('*, projects(name)')
      .order('created_at', { ascending: false });
    
    if (!error) setIncidents(data || []);
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
    const { data: { user } } = await supabase.auth.getUser();
    const { data: profile } = await supabase
      .from('profiles')
      .select('id')
      .eq('user_id', user?.id)
      .single();

    const { error } = await supabase.from('incidents').insert({
      ...formData,
      reported_by: profile?.id
    });

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Incident reported" });
      setIsOpen(false);
      setFormData({ project_id: '', title: '', description: '', severity: 'medium' });
      fetchIncidents();
    }
  };

  const toggleResolved = async (id: string, resolved: boolean) => {
    const { error } = await supabase
      .from('incidents')
      .update({ 
        resolved: !resolved,
        resolved_at: !resolved ? new Date().toISOString() : null
      })
      .eq('id', id);

    if (!error) {
      toast({ title: "Success", description: "Incident updated" });
      fetchIncidents();
    }
  };

  const getSeverityColor = (severity: string) => {
    switch(severity) {
      case 'low': return 'bg-blue-500/20 text-blue-500';
      case 'medium': return 'bg-yellow-500/20 text-yellow-500';
      case 'high': return 'bg-red-500/20 text-red-500';
      default: return 'bg-gray-500/20 text-gray-500';
    }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Incidents</h2>
          <p className="text-muted-foreground mt-1">Track and resolve safety incidents</p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="cyber-button"><AlertTriangle className="w-4 h-4 mr-2" />Report Incident</Button>
          </DialogTrigger>
          <DialogContent className="glass-card border-primary/20">
            <DialogHeader>
              <DialogTitle>Report New Incident</DialogTitle>
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
                <Textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} required />
              </div>
              <div>
                <Label>Severity</Label>
                <select 
                  className="w-full px-3 py-2 border rounded-md bg-background"
                  value={formData.severity}
                  onChange={(e) => setFormData({...formData, severity: e.target.value})}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <Button type="submit" className="w-full">Report Incident</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-3">
        {incidents.map((incident) => (
          <Card key={incident.id} className="glass-card border-primary/20 p-4 hover:border-accent transition-all">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold text-lg">{incident.title}</h3>
                  <Badge className={getSeverityColor(incident.severity)}>{incident.severity}</Badge>
                  {incident.resolved && <Badge className="bg-green-500/20 text-green-500">Resolved</Badge>}
                </div>
                <p className="text-sm text-muted-foreground">{incident.description}</p>
                <p className="text-xs text-primary mt-2">{incident.projects?.name}</p>
                {incident.resolved_at && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Resolved: {new Date(incident.resolved_at).toLocaleDateString()}
                  </p>
                )}
              </div>
              <Button
                size="sm"
                variant={incident.resolved ? "outline" : "default"}
                onClick={() => toggleResolved(incident.id, incident.resolved)}
              >
                {incident.resolved ? 'Reopen' : 'Resolve'}
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
