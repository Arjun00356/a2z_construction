import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Package, AlertTriangle, Edit, Trash2, ShoppingCart, TrendingUp, Users, FileText, Plus, Check, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export const MaterialsSection = () => {
  const [materials, setMaterials] = useState<any[]>([]);
  const [vendors, setVendors] = useState<any[]>([]);
  const [materialRequests, setMaterialRequests] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [purchaseOrders, setPurchaseOrders] = useState<any[]>([]);
  const [materialPrices, setMaterialPrices] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
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

  const [vendorForm, setVendorForm] = useState({
    name: '',
    contact_person: '',
    email: '',
    phone: '',
    address: ''
  });

  const [requestForm, setRequestForm] = useState({
    material_id: '',
    project_id: '',
    quantity: '1',
    notes: ''
  });

  const [transactionForm, setTransactionForm] = useState({
    material_id: '',
    project_id: '',
    transaction_type: 'inflow',
    quantity: '1',
    unit_price: '',
    vendor_id: '',
    reference_number: '',
    notes: ''
  });

  const [poForm, setPoForm] = useState({
    po_number: '',
    vendor_id: '',
    project_id: '',
    order_date: new Date().toISOString().split('T')[0],
    expected_delivery: '',
    notes: ''
  });

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    const [materialsRes, vendorsRes, requestsRes, transactionsRes, posRes, pricesRes, projectsRes] = await Promise.all([
      supabase.from('materials').select('*').order('name'),
      supabase.from('vendors').select('*').order('name'),
      supabase.from('material_requests').select('*, materials(name), projects(name), profiles!material_requests_requested_by_fkey(full_name)').order('created_at', { ascending: false }),
      supabase.from('material_transactions').select('*, materials(name), projects(name), vendors(name)').order('created_at', { ascending: false }),
      supabase.from('purchase_orders').select('*').order('created_at', { ascending: false }),
      supabase.from('material_prices').select('*, materials(name), vendors(name)'),
      supabase.from('projects').select('id, name')
    ]);
    
    if (!materialsRes.error) setMaterials(materialsRes.data || []);
    if (!vendorsRes.error) setVendors(vendorsRes.data || []);
    if (!requestsRes.error) setMaterialRequests(requestsRes.data || []);
    if (!transactionsRes.error) setTransactions(transactionsRes.data || []);
    if (!posRes.error) setPurchaseOrders(posRes.data || []);
    if (!pricesRes.error) setMaterialPrices(pricesRes.data || []);
    if (!projectsRes.error) setProjects(projectsRes.data || []);
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
      fetchAllData();
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
        fetchAllData();
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
        fetchAllData();
      }
    }
  };

  const handleVendorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from('vendors').insert(vendorForm);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Vendor added successfully" });
      setVendorForm({ name: '', contact_person: '', email: '', phone: '', address: '' });
      fetchAllData();
    }
  };

  const handleRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: profile } = await supabase.from('profiles').select('id').eq('user_id', user.id).single();
    if (!profile) return;

    const { error } = await supabase.from('material_requests').insert({
      ...requestForm,
      quantity: parseInt(requestForm.quantity),
      requested_by: profile.id
    });

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Material request submitted" });
      setRequestForm({ material_id: '', project_id: '', quantity: '1', notes: '' });
      fetchAllData();
    }
  };

  const handleApproveRequest = async (requestId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: profile } = await supabase.from('profiles').select('id').eq('user_id', user.id).single();
    if (!profile) return;

    const { error } = await supabase
      .from('material_requests')
      .update({ status: 'approved', approved_by: profile.id, approved_at: new Date().toISOString() })
      .eq('id', requestId);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Request approved" });
      fetchAllData();
    }
  };

  const handleRejectRequest = async (requestId: string) => {
    const { error } = await supabase
      .from('material_requests')
      .update({ status: 'rejected' })
      .eq('id', requestId);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Request rejected" });
      fetchAllData();
    }
  };

  const handleTransactionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: profile } = await supabase.from('profiles').select('id').eq('user_id', user.id).single();
    if (!profile) return;

    const quantity = parseInt(transactionForm.quantity);
    const { error } = await supabase.from('material_transactions').insert({
      material_id: transactionForm.material_id,
      project_id: transactionForm.project_id || null,
      transaction_type: transactionForm.transaction_type,
      quantity: quantity,
      unit_price: transactionForm.unit_price ? parseFloat(transactionForm.unit_price) : null,
      vendor_id: transactionForm.vendor_id || null,
      reference_number: transactionForm.reference_number,
      notes: transactionForm.notes,
      created_by: profile.id
    });

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }

    // Update material quantity
    const material = materials.find(m => m.id === transactionForm.material_id);
    if (material) {
      const newQuantity = transactionForm.transaction_type === 'inflow' 
        ? material.quantity + quantity 
        : material.quantity - quantity;
      
      await supabase
        .from('materials')
        .update({ quantity: newQuantity })
        .eq('id', transactionForm.material_id);
    }

    toast({ title: "Success", description: "Transaction recorded" });
    setTransactionForm({
      material_id: '',
      project_id: '',
      transaction_type: 'inflow',
      quantity: '1',
      unit_price: '',
      vendor_id: '',
      reference_number: '',
      notes: ''
    });
    fetchAllData();
  };

  const handlePOSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: profile } = await supabase.from('profiles').select('id').eq('user_id', user.id).single();
    if (!profile) return;

    const { error } = await supabase.from('purchase_orders').insert({
      ...poForm,
      total_amount: 0,
      project_id: poForm.project_id || null,
      created_by: profile.id
    });

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Purchase order created" });
      setPoForm({
        po_number: '',
        vendor_id: '',
        project_id: '',
        order_date: new Date().toISOString().split('T')[0],
        expected_delivery: '',
        notes: ''
      });
      fetchAllData();
    }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

  const lowStockMaterials = materials.filter(m => m.quantity <= m.reorder_level);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Materials Management</h2>
          <p className="text-muted-foreground mt-1">Comprehensive material tracking and vendor management</p>
        </div>
      </div>

      {lowStockMaterials.length > 0 && (
        <Card className="glass-card border-yellow-500/20 bg-yellow-500/10 p-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-500" />
            <div>
              <h3 className="font-semibold text-yellow-500">Low Stock Alert</h3>
              <p className="text-sm text-muted-foreground">
                {lowStockMaterials.length} material(s) below reorder level: {lowStockMaterials.map(m => m.name).join(', ')}
              </p>
            </div>
          </div>
        </Card>
      )}

      <Tabs defaultValue="inventory" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="requests">Requests</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="vendors">Vendors</TabsTrigger>
          <TabsTrigger value="purchase-orders">Purchase Orders</TabsTrigger>
        </TabsList>

        <TabsContent value="inventory" className="space-y-4">
          <div className="flex justify-end">
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
        </TabsContent>

        <TabsContent value="requests" className="space-y-4">
          <Card className="glass-card border-primary/20 p-6">
            <h3 className="text-lg font-semibold mb-4">New Material Request</h3>
            <form onSubmit={handleRequestSubmit} className="grid grid-cols-2 gap-4">
              <div>
                <Label>Material</Label>
                <Select value={requestForm.material_id} onValueChange={(value) => setRequestForm({...requestForm, material_id: value})}>
                  <SelectTrigger><SelectValue placeholder="Select material" /></SelectTrigger>
                  <SelectContent>
                    {materials.map(m => <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Project</Label>
                <Select value={requestForm.project_id} onValueChange={(value) => setRequestForm({...requestForm, project_id: value})}>
                  <SelectTrigger><SelectValue placeholder="Select project" /></SelectTrigger>
                  <SelectContent>
                    {projects.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Quantity</Label>
                <Input type="number" value={requestForm.quantity} onChange={(e) => setRequestForm({...requestForm, quantity: e.target.value})} required />
              </div>
              <div>
                <Label>Notes</Label>
                <Input value={requestForm.notes} onChange={(e) => setRequestForm({...requestForm, notes: e.target.value})} />
              </div>
              <div className="col-span-2">
                <Button type="submit" className="w-full"><Plus className="w-4 h-4 mr-2" />Submit Request</Button>
              </div>
            </form>
          </Card>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Material</TableHead>
                <TableHead>Project</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Requested By</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {materialRequests.map((req) => (
                <TableRow key={req.id}>
                  <TableCell>{req.materials?.name}</TableCell>
                  <TableCell>{req.projects?.name}</TableCell>
                  <TableCell>{req.quantity}</TableCell>
                  <TableCell>{req.profiles?.full_name}</TableCell>
                  <TableCell>
                    <Badge variant={req.status === 'approved' ? 'default' : req.status === 'rejected' ? 'destructive' : 'secondary'}>
                      {req.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {req.status === 'pending' && (
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => handleApproveRequest(req.id)}><Check className="w-3 h-3" /></Button>
                        <Button size="sm" variant="destructive" onClick={() => handleRejectRequest(req.id)}><X className="w-3 h-3" /></Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-4">
          <Card className="glass-card border-primary/20 p-6">
            <h3 className="text-lg font-semibold mb-4">Record Transaction</h3>
            <form onSubmit={handleTransactionSubmit} className="grid grid-cols-2 gap-4">
              <div>
                <Label>Material</Label>
                <Select value={transactionForm.material_id} onValueChange={(value) => setTransactionForm({...transactionForm, material_id: value})}>
                  <SelectTrigger><SelectValue placeholder="Select material" /></SelectTrigger>
                  <SelectContent>
                    {materials.map(m => <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Type</Label>
                <Select value={transactionForm.transaction_type} onValueChange={(value) => setTransactionForm({...transactionForm, transaction_type: value})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="inflow">Inflow (Received)</SelectItem>
                    <SelectItem value="outflow">Outflow (Used)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Quantity</Label>
                <Input type="number" value={transactionForm.quantity} onChange={(e) => setTransactionForm({...transactionForm, quantity: e.target.value})} required />
              </div>
              <div>
                <Label>Unit Price</Label>
                <Input type="number" step="0.01" value={transactionForm.unit_price} onChange={(e) => setTransactionForm({...transactionForm, unit_price: e.target.value})} />
              </div>
              <div>
                <Label>Vendor</Label>
                <Select value={transactionForm.vendor_id} onValueChange={(value) => setTransactionForm({...transactionForm, vendor_id: value})}>
                  <SelectTrigger><SelectValue placeholder="Select vendor (optional)" /></SelectTrigger>
                  <SelectContent>
                    {vendors.map(v => <SelectItem key={v.id} value={v.id}>{v.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Project</Label>
                <Select value={transactionForm.project_id} onValueChange={(value) => setTransactionForm({...transactionForm, project_id: value})}>
                  <SelectTrigger><SelectValue placeholder="Select project (optional)" /></SelectTrigger>
                  <SelectContent>
                    {projects.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Reference Number</Label>
                <Input value={transactionForm.reference_number} onChange={(e) => setTransactionForm({...transactionForm, reference_number: e.target.value})} placeholder="Invoice/PO number" />
              </div>
              <div>
                <Label>Notes</Label>
                <Input value={transactionForm.notes} onChange={(e) => setTransactionForm({...transactionForm, notes: e.target.value})} />
              </div>
              <div className="col-span-2">
                <Button type="submit" className="w-full"><TrendingUp className="w-4 h-4 mr-2" />Record Transaction</Button>
              </div>
            </form>
          </Card>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Material</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Project</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>Reference</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((txn) => (
                <TableRow key={txn.id}>
                  <TableCell>{new Date(txn.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>{txn.materials?.name}</TableCell>
                  <TableCell>
                    <Badge variant={txn.transaction_type === 'inflow' ? 'default' : 'secondary'}>
                      {txn.transaction_type}
                    </Badge>
                  </TableCell>
                  <TableCell>{txn.quantity}</TableCell>
                  <TableCell>{txn.projects?.name || '-'}</TableCell>
                  <TableCell>{txn.vendors?.name || '-'}</TableCell>
                  <TableCell>{txn.reference_number || '-'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>

        <TabsContent value="vendors" className="space-y-4">
          <Card className="glass-card border-primary/20 p-6">
            <h3 className="text-lg font-semibold mb-4">Add New Vendor</h3>
            <form onSubmit={handleVendorSubmit} className="grid grid-cols-2 gap-4">
              <div>
                <Label>Vendor Name</Label>
                <Input value={vendorForm.name} onChange={(e) => setVendorForm({...vendorForm, name: e.target.value})} required />
              </div>
              <div>
                <Label>Contact Person</Label>
                <Input value={vendorForm.contact_person} onChange={(e) => setVendorForm({...vendorForm, contact_person: e.target.value})} />
              </div>
              <div>
                <Label>Email</Label>
                <Input type="email" value={vendorForm.email} onChange={(e) => setVendorForm({...vendorForm, email: e.target.value})} />
              </div>
              <div>
                <Label>Phone</Label>
                <Input value={vendorForm.phone} onChange={(e) => setVendorForm({...vendorForm, phone: e.target.value})} />
              </div>
              <div className="col-span-2">
                <Label>Address</Label>
                <Textarea value={vendorForm.address} onChange={(e) => setVendorForm({...vendorForm, address: e.target.value})} />
              </div>
              <div className="col-span-2">
                <Button type="submit" className="w-full"><Users className="w-4 h-4 mr-2" />Add Vendor</Button>
              </div>
            </form>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {vendors.map((vendor) => (
              <Card key={vendor.id} className="glass-card border-primary/20 p-6">
                <h3 className="font-semibold text-lg">{vendor.name}</h3>
                <div className="mt-3 space-y-1 text-sm text-muted-foreground">
                  {vendor.contact_person && <p>Contact: {vendor.contact_person}</p>}
                  {vendor.email && <p>Email: {vendor.email}</p>}
                  {vendor.phone && <p>Phone: {vendor.phone}</p>}
                  {vendor.address && <p>Address: {vendor.address}</p>}
                </div>
                <div className="mt-4">
                  <h4 className="text-sm font-semibold mb-2">Material Prices</h4>
                  <div className="space-y-1">
                    {materialPrices
                      .filter(mp => mp.vendor_id === vendor.id)
                      .map(mp => (
                        <div key={mp.id} className="flex justify-between text-sm">
                          <span>{mp.materials?.name}</span>
                          <span className="text-accent">₹{mp.price}/{mp.unit}</span>
                        </div>
                      ))}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="purchase-orders" className="space-y-4">
          <Card className="glass-card border-primary/20 p-6">
            <h3 className="text-lg font-semibold mb-4">Create Purchase Order</h3>
            <form onSubmit={handlePOSubmit} className="grid grid-cols-2 gap-4">
              <div>
                <Label>PO Number</Label>
                <Input value={poForm.po_number} onChange={(e) => setPoForm({...poForm, po_number: e.target.value})} required />
              </div>
              <div>
                <Label>Vendor</Label>
                <Select value={poForm.vendor_id} onValueChange={(value) => setPoForm({...poForm, vendor_id: value})}>
                  <SelectTrigger><SelectValue placeholder="Select vendor" /></SelectTrigger>
                  <SelectContent>
                    {vendors.map(v => <SelectItem key={v.id} value={v.id}>{v.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Project</Label>
                <Select value={poForm.project_id} onValueChange={(value) => setPoForm({...poForm, project_id: value})}>
                  <SelectTrigger><SelectValue placeholder="Select project (optional)" /></SelectTrigger>
                  <SelectContent>
                    {projects.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Order Date</Label>
                <Input type="date" value={poForm.order_date} onChange={(e) => setPoForm({...poForm, order_date: e.target.value})} required />
              </div>
              <div>
                <Label>Expected Delivery</Label>
                <Input type="date" value={poForm.expected_delivery} onChange={(e) => setPoForm({...poForm, expected_delivery: e.target.value})} />
              </div>
              <div>
                <Label>Notes</Label>
                <Input value={poForm.notes} onChange={(e) => setPoForm({...poForm, notes: e.target.value})} />
              </div>
              <div className="col-span-2">
                <Button type="submit" className="w-full"><FileText className="w-4 h-4 mr-2" />Create PO</Button>
              </div>
            </form>
          </Card>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>PO Number</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>Order Date</TableHead>
                <TableHead>Expected Delivery</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {purchaseOrders.map((po) => {
                const vendor = vendors.find(v => v.id === po.vendor_id);
                return (
                  <TableRow key={po.id}>
                    <TableCell className="font-medium">{po.po_number}</TableCell>
                    <TableCell>{vendor?.name}</TableCell>
                    <TableCell>{new Date(po.order_date).toLocaleDateString()}</TableCell>
                    <TableCell>{po.expected_delivery ? new Date(po.expected_delivery).toLocaleDateString() : '-'}</TableCell>
                    <TableCell>
                      <Badge variant={po.status === 'received' ? 'default' : 'secondary'}>
                        {po.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TabsContent>
      </Tabs>

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