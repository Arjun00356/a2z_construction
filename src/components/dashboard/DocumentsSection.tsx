import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, FileText, Upload, Download, Edit, Trash2, FolderOpen } from 'lucide-react';
import { documentSchema } from '@/lib/validation';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export const DocumentsSection = () => {
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [editingDoc, setEditingDoc] = useState<any>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    file_url: '',
    project_id: '',
    type: 'other',
    category: 'other'
  });

  const categories = [
    { id: 'registry', label: 'Registry', icon: '📋' },
    { id: 'rera_permission', label: 'RERA Permission', icon: '✅' },
    { id: 'gda_permission', label: 'GDA Permission', icon: '🏛️' },
    { id: 'pollution', label: 'Pollution Clearance', icon: '🌱' },
    { id: 'customer_contract', label: 'Customer Contracts', icon: '📝' },
    { id: 'other', label: 'Other Documents', icon: '📄' }
  ];

  const getCategoryDocuments = (categoryId: string) => {
    return documents.filter(doc => doc.category === categoryId);
  };

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

  const handleEdit = (doc: any) => {
    setEditingDoc(doc);
    setFormData({
      name: doc.name,
      description: doc.description || '',
      file_url: doc.file_url,
      project_id: doc.project_id,
      type: doc.type,
      category: doc.category || 'other'
    });
    setIsOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    const { error } = await supabase.from('documents').delete().eq('id', deleteId);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Document deleted" });
      setDeleteId(null);
      fetchDocuments();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form data
    const validationResult = documentSchema.safeParse(formData);
    if (!validationResult.success) {
      const errorMessage = validationResult.error.errors[0].message;
      toast({ title: "Validation Error", description: errorMessage, variant: "destructive" });
      return;
    }

    const trimmedData = {
      ...formData,
      name: formData.name.trim(),
      description: formData.description?.trim() || '',
      file_url: formData.file_url.trim(),
    };
    
    if (editingDoc) {
      const { error } = await supabase
        .from('documents')
        .update(trimmedData)
        .eq('id', editingDoc.id);
      
      if (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Success", description: "Document updated" });
        setIsOpen(false);
        setEditingDoc(null);
        setFormData({ name: '', description: '', file_url: '', project_id: '', type: 'other', category: 'other' });
        fetchDocuments();
      }
    } else {
      const { data: { user } } = await supabase.auth.getUser();
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user?.id)
        .single();

      const { error } = await supabase.from('documents').insert({
        ...trimmedData,
        uploaded_by: profile?.id
      });

      if (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Success", description: "Document added successfully" });
        setIsOpen(false);
        setFormData({ name: '', description: '', file_url: '', project_id: '', type: 'other', category: 'other' });
        fetchDocuments();
      }
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
        <Dialog open={isOpen} onOpenChange={(open) => {
          setIsOpen(open);
          if (!open) {
            setEditingDoc(null);
            setFormData({ name: '', description: '', file_url: '', project_id: '', type: 'other', category: 'other' });
          }
        }}>
          <DialogTrigger asChild>
            <Button className="cyber-button"><Upload className="w-4 h-4 mr-2" />Upload Document</Button>
          </DialogTrigger>
          <DialogContent className="glass-card border-primary/20 max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingDoc ? 'Edit Document' : 'Upload New Document'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Document Name *</Label>
                  <Input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} maxLength={200} required />
                </div>
                <div>
                  <Label>Category</Label>
                  <select 
                    className="w-full px-3 py-2 border rounded-md bg-background"
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    required
                  >
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.icon} {cat.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <Label>Description</Label>
                <Textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} maxLength={500} rows={3} />
              </div>
              <div>
                <Label>File URL *</Label>
                <Input value={formData.file_url} onChange={(e) => setFormData({...formData, file_url: e.target.value})} maxLength={500} placeholder="https://example.com/document.pdf" required />
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
              <Button type="submit" className="w-full cyber-button">{editingDoc ? 'Update Document' : 'Upload Document'}</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="registry" className="w-full">
        <TabsList className="grid grid-cols-3 lg:grid-cols-6 w-full">
          {categories.map(cat => (
            <TabsTrigger key={cat.id} value={cat.id} className="text-xs sm:text-sm">
              <span className="mr-1">{cat.icon}</span>
              <span className="hidden sm:inline">{cat.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {categories.map(category => (
          <TabsContent key={category.id} value={category.id} className="mt-6">
            <div className="mb-4">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <FolderOpen className="w-5 h-5 text-primary" />
                {category.label}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                {getCategoryDocuments(category.id).length} document(s) in this category
              </p>
            </div>
            
            {getCategoryDocuments(category.id).length === 0 ? (
              <Card className="glass-card border-primary/20 p-12 text-center">
                <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-muted-foreground">No documents in this category yet</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => {
                    setFormData({ ...formData, category: category.id });
                    setIsOpen(true);
                  }}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload First Document
                </Button>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {getCategoryDocuments(category.id).map((doc) => (
                  <Card key={doc.id} className="glass-card border-primary/20 p-6 hover:border-accent transition-all hover:shadow-lg">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-primary/10 rounded-lg">
                        <FileText className="w-8 h-8 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg truncate">{doc.name}</h3>
                        {doc.description && (
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{doc.description}</p>
                        )}
                        <p className="text-xs text-primary mt-2 font-medium">{doc.projects?.name}</p>
                        {doc.file_size && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Size: {(doc.file_size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        )}
                        <div className="flex gap-2 mt-4">
                          <Button size="sm" variant="outline" className="flex-1" asChild>
                            <a href={doc.file_url} target="_blank" rel="noopener noreferrer">
                              <Download className="w-3 h-3 mr-1" />Download
                            </a>
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleEdit(doc)}>
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => setDeleteId(doc.id)}>
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Document</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this document? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
