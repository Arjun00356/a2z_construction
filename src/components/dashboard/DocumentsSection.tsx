import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, FileText, Upload, Download } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

export const DocumentsSection = () => {
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    file_url: '',
    project_id: '',
    type: 'other'
  });

  useEffect(() => {
    fetchDocuments();
    fetchProjects();
  }, []);

  const fetchDocuments = async () => {
    const { data, error } = await supabase
      .from('documents')
      .select('*, projects(name)')
      .order('created_at', { ascending: false });
    
    if (!error) setDocuments(data || []);
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

    const { error } = await supabase.from('documents').insert({
      ...formData,
      uploaded_by: profile?.id
    });

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Document added successfully" });
      setIsOpen(false);
      setFormData({ name: '', description: '', file_url: '', project_id: '', type: 'other' });
      fetchDocuments();
    }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Documents</h2>
          <p className="text-muted-foreground mt-1">Manage project documents and files</p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="cyber-button"><Upload className="w-4 h-4 mr-2" />Upload Document</Button>
          </DialogTrigger>
          <DialogContent className="glass-card border-primary/20">
            <DialogHeader>
              <DialogTitle>Upload New Document</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Document Name</Label>
                <Input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
              </div>
              <div>
                <Label>File URL</Label>
                <Input value={formData.file_url} onChange={(e) => setFormData({...formData, file_url: e.target.value})} required />
              </div>
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
              <Button type="submit" className="w-full">Upload</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {documents.map((doc) => (
          <Card key={doc.id} className="glass-card border-primary/20 p-6 hover:border-accent transition-all">
            <div className="flex items-start gap-4">
              <FileText className="w-10 h-10 text-accent" />
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{doc.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">{doc.description}</p>
                <p className="text-xs text-primary mt-2">{doc.projects?.name}</p>
                <Button size="sm" variant="outline" className="mt-3" asChild>
                  <a href={doc.file_url} target="_blank" rel="noopener noreferrer">
                    <Download className="w-3 h-3 mr-1" />Download
                  </a>
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
