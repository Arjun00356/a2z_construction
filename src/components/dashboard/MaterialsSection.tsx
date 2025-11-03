import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Package, AlertTriangle, Edit, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';

export const MaterialsSection = () => {
  const [materials, setMaterials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<any>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    quantity: '0',
    unit: '',
    reorder_level: '10'
  });

  useEffect(() => {
    fetchMaterials();
  }, []);

  const fetchMaterials = async () => {
    const { data, error } = await supabase
      .from('materials')
      .select('*')
      .order('name');
    
    if (!error) setMaterials(data || []);
    setLoading(false);
  };

  const handleEdit = (material: any) => {
    setEditingMaterial(material);
    setFormData({
      name: material.name,
      description: material.description || '',
      quantity: material.quantity.toString(),
      unit: material.unit,
      reorder_level: material.reorder_level.toString()
    });
    setIsOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    const { error } = await supabase.from('materials').delete().eq('id', deleteId);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Material deleted" });
      setDeleteId(null);
      fetchMaterials();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingMaterial) {
      const { error } = await supabase
        .from('materials')
        .update({
          ...formData,
          quantity: parseInt(formData.quantity),
          reorder_level: parseInt(formData.reorder_level)
        })
        .eq('id', editingMaterial.id);
      
      if (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Success", description: "Material updated" });
        setIsOpen(false);
        setEditingMaterial(null);
        setFormData({ name: '', description: '', quantity: '0', unit: '', reorder_level: '10' });
        fetchMaterials();
      }
    } else {
      const { error } = await supabase.from('materials').insert({
        ...formData,
        quantity: parseInt(formData.quantity),
        reorder_level: parseInt(formData.reorder_level)
      });

      if (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Success", description: "Material added successfully" });
        setIsOpen(false);
        setFormData({ name: '', description: '', quantity: '0', unit: '', reorder_level: '10' });
        fetchMaterials();
      }
    }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Materials Inventory</h2>
          <p className="text-muted-foreground mt-1">Track construction materials and supplies</p>
        </div>
        <Dialog open={isOpen} onOpenChange={(open) => {
          setIsOpen(open);
          if (!open) {
            setEditingMaterial(null);
            setFormData({ name: '', description: '', quantity: '0', unit: '', reorder_level: '10' });
          }
        }}>
          <DialogTrigger asChild>
            <Button className="cyber-button"><Package className="w-4 h-4 mr-2" />Add Material</Button>
          </DialogTrigger>
          <DialogContent className="glass-card border-primary/20">
            <DialogHeader>
              <DialogTitle>{editingMaterial ? 'Edit Material' : 'Add New Material'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Material Name</Label>
                <Input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
              </div>
              <div>
                <Label>Quantity</Label>
                <Input type="number" value={formData.quantity} onChange={(e) => setFormData({...formData, quantity: e.target.value})} required />
              </div>
              <div>
                <Label>Unit</Label>
                <Input value={formData.unit} onChange={(e) => setFormData({...formData, unit: e.target.value})} required placeholder="e.g., bags, pieces, sheets" />
              </div>
              <div>
                <Label>Reorder Level</Label>
                <Input type="number" value={formData.reorder_level} onChange={(e) => setFormData({...formData, reorder_level: e.target.value})} required />
              </div>
              <Button type="submit" className="w-full">{editingMaterial ? 'Update' : 'Add Material'}</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {materials.map((material) => (
          <Card key={material.id} className="glass-card border-primary/20 p-6 hover:border-accent transition-all">
            <div className="flex items-start gap-4">
              <Package className="w-10 h-10 text-accent" />
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{material.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">{material.description}</p>
                <div className="flex gap-2 mt-3">
                  <Badge variant="outline">{material.quantity} {material.unit}</Badge>
                  {material.quantity <= material.reorder_level && (
                    <Badge className="bg-yellow-500/20 text-yellow-500">
                      <AlertTriangle className="w-3 h-3 mr-1" />Low Stock
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-2">Reorder at: {material.reorder_level} {material.unit}</p>
                <div className="flex gap-2 mt-3">
                  <Button size="sm" variant="outline" onClick={() => handleEdit(material)}>
                    <Edit className="w-3 h-3" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setDeleteId(material.id)}>
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Material</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this material? This action cannot be undone.
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
