import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ShieldCheck, CheckCircle2, ClipboardCheck, FileText, AlertTriangle, XCircle } from 'lucide-react';
import { checklistSchema, inspectionSchema, qualityFormSchema, auditSchema, ncrSchema } from '@/lib/validation';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export const SafetySection = () => {
  const [checklists, setChecklists] = useState<any[]>([]);
  const [inspections, setInspections] = useState<any[]>([]);
  const [qualityForms, setQualityForms] = useState<any[]>([]);
  const [audits, setAudits] = useState<any[]>([]);
  const [ncrs, setNcrs] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('checklists');
  const { toast } = useToast();
  
  const [checklistForm, setChecklistForm] = useState({ project_id: '', title: '', description: '' });
  const [inspectionForm, setInspectionForm] = useState({ project_id: '', inspection_date: '', inspector_name: '', area: '', findings: '', status: 'pending' });
  const [qualityForm, setQualityForm] = useState({ project_id: '', form_type: 'RFI', reference_number: '', title: '', description: '', status: 'open' });
  const [auditForm, setAuditForm] = useState({ project_id: '', audit_type: 'safety_audit', audit_date: '', auditor_name: '', findings: '', severity: 'medium', corrective_action: '' });
  const [ncrForm, setNcrForm] = useState({ project_id: '', ncr_number: '', title: '', description: '', category: '', severity: 'medium', corrective_action: '', root_cause: '', status: 'open' });

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    await Promise.all([
      fetchChecklists(),
      fetchInspections(),
      fetchQualityForms(),
      fetchAudits(),
      fetchNcrs(),
      fetchProjects(),
      fetchProfiles()
    ]);
    setLoading(false);
  };

  const fetchChecklists = async () => {
    const { data } = await supabase
      .from('safety_checklists')
      .select('*, projects(name)')
      .order('created_at', { ascending: false });
    setChecklists(data || []);
  };

  const fetchInspections = async () => {
    const { data } = await supabase
      .from('site_inspections')
      .select('*, projects(name)')
      .order('created_at', { ascending: false });
    setInspections(data || []);
  };

  const fetchQualityForms = async () => {
    const { data } = await supabase
      .from('quality_forms')
      .select('*, projects(name), submitted_by:profiles!quality_forms_submitted_by_fkey(full_name)')
      .order('created_at', { ascending: false });
    setQualityForms(data || []);
  };

  const fetchAudits = async () => {
    const { data } = await supabase
      .from('safety_audits')
      .select('*, projects(name)')
      .order('created_at', { ascending: false });
    setAudits(data || []);
  };

  const fetchNcrs = async () => {
    const { data } = await supabase
      .from('ncr_reports')
      .select('*, projects(name), raised_by:profiles!ncr_reports_raised_by_fkey(full_name)')
      .order('created_at', { ascending: false });
    setNcrs(data || []);
  };

  const fetchProjects = async () => {
    const { data } = await supabase
      .from('projects')
      .select('id, name')
      .order('name');
    setProjects(data || []);
  };

  const fetchProfiles = async () => {
    const { data } = await supabase
      .from('profiles')
      .select('id, full_name')
      .order('full_name');
    setProfiles(data || []);
  };

  const handleChecklistSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationResult = checklistSchema.safeParse(checklistForm);
    if (!validationResult.success) {
      toast({ title: "Validation Error", description: validationResult.error.errors[0].message, variant: "destructive" });
      return;
    }
    const trimmedData = {
      ...checklistForm,
      title: checklistForm.title.trim(),
      description: checklistForm.description?.trim() || '',
    };
    const { error } = await supabase.from('safety_checklists').insert(trimmedData);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Safety checklist created" });
      setIsOpen(false);
      setChecklistForm({ project_id: '', title: '', description: '' });
      fetchChecklists();
    }
  };

  const handleInspectionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationResult = inspectionSchema.safeParse(inspectionForm);
    if (!validationResult.success) {
      toast({ title: "Validation Error", description: validationResult.error.errors[0].message, variant: "destructive" });
      return;
    }
    const trimmedData = {
      ...inspectionForm,
      inspector_name: inspectionForm.inspector_name.trim(),
      area: inspectionForm.area.trim(),
      findings: inspectionForm.findings?.trim() || '',
    };
    const { error } = await supabase.from('site_inspections').insert(trimmedData);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Site inspection created" });
      setIsOpen(false);
      setInspectionForm({ project_id: '', inspection_date: '', inspector_name: '', area: '', findings: '', status: 'pending' });
      fetchInspections();
    }
  };

  const handleQualitySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationResult = qualityFormSchema.safeParse(qualityForm);
    if (!validationResult.success) {
      toast({ title: "Validation Error", description: validationResult.error.errors[0].message, variant: "destructive" });
      return;
    }
    const { data: { user } } = await supabase.auth.getUser();
    const { data: profile } = await supabase.from('profiles').select('id').eq('user_id', user?.id).single();
    
    const trimmedData = {
      ...qualityForm,
      reference_number: qualityForm.reference_number.trim(),
      title: qualityForm.title.trim(),
      description: qualityForm.description?.trim() || '',
    };
    
    const { error } = await supabase.from('quality_forms').insert({ ...trimmedData, submitted_by: profile?.id });
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Quality form created" });
      setIsOpen(false);
      setQualityForm({ project_id: '', form_type: 'RFI', reference_number: '', title: '', description: '', status: 'open' });
      fetchQualityForms();
    }
  };

  const handleAuditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationResult = auditSchema.safeParse(auditForm);
    if (!validationResult.success) {
      toast({ title: "Validation Error", description: validationResult.error.errors[0].message, variant: "destructive" });
      return;
    }
    const trimmedData = {
      ...auditForm,
      auditor_name: auditForm.auditor_name.trim(),
      findings: auditForm.findings.trim(),
      corrective_action: auditForm.corrective_action?.trim() || '',
    };
    const { error } = await supabase.from('safety_audits').insert(trimmedData);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Safety audit created" });
      setIsOpen(false);
      setAuditForm({ project_id: '', audit_type: 'safety_audit', audit_date: '', auditor_name: '', findings: '', severity: 'medium', corrective_action: '' });
      fetchAudits();
    }
  };

  const handleNcrSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationResult = ncrSchema.safeParse(ncrForm);
    if (!validationResult.success) {
      toast({ title: "Validation Error", description: validationResult.error.errors[0].message, variant: "destructive" });
      return;
    }
    const { data: { user } } = await supabase.auth.getUser();
    const { data: profile } = await supabase.from('profiles').select('id').eq('user_id', user?.id).single();
    
    const trimmedData = {
      ...ncrForm,
      ncr_number: ncrForm.ncr_number.trim(),
      title: ncrForm.title.trim(),
      description: ncrForm.description.trim(),
      category: ncrForm.category.trim(),
      corrective_action: ncrForm.corrective_action?.trim() || '',
      root_cause: ncrForm.root_cause?.trim() || '',
    };
    
    const { error } = await supabase.from('ncr_reports').insert({ ...trimmedData, raised_by: profile?.id });
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Success", description: "NCR report created" });
      setIsOpen(false);
      setNcrForm({ project_id: '', ncr_number: '', title: '', description: '', category: '', severity: 'medium', corrective_action: '', root_cause: '', status: 'open' });
      fetchNcrs();
    }
  };

  const toggleComplete = async (id: string, completed: boolean) => {
    const { data: { user } } = await supabase.auth.getUser();
    const { data: profile } = await supabase.from('profiles').select('id').eq('user_id', user?.id).single();

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

  const updateInspectionStatus = async (id: string, status: string) => {
    const { error } = await supabase.from('site_inspections').update({ status, completed: status === 'completed' }).eq('id', id);
    if (!error) {
      toast({ title: "Success", description: "Inspection updated" });
      fetchInspections();
    }
  };

  const updateQualityStatus = async (id: string, status: string) => {
    const { error } = await supabase.from('quality_forms').update({ status }).eq('id', id);
    if (!error) {
      toast({ title: "Success", description: "Quality form updated" });
      fetchQualityForms();
    }
  };

  const updateNcrStatus = async (id: string, status: string) => {
    const { error } = await supabase.from('ncr_reports').update({ status, closed_at: status === 'closed' ? new Date().toISOString() : null }).eq('id', id);
    if (!error) {
      toast({ title: "Success", description: "NCR updated" });
      fetchNcrs();
    }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

  const getDialogContent = () => {
    switch (activeTab) {
      case 'checklists':
        return (
          <form onSubmit={handleChecklistSubmit} className="space-y-4">
            <div><Label>Project</Label><select className="w-full px-3 py-2 border rounded-md bg-background" value={checklistForm.project_id} onChange={(e) => setChecklistForm({...checklistForm, project_id: e.target.value})} required><option value="">Select Project</option>{projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</select></div>
            <div><Label>Title</Label><Input value={checklistForm.title} onChange={(e) => setChecklistForm({...checklistForm, title: e.target.value})} required /></div>
            <div><Label>Description</Label><Textarea value={checklistForm.description} onChange={(e) => setChecklistForm({...checklistForm, description: e.target.value})} /></div>
            <Button type="submit" className="w-full">Create Checklist</Button>
          </form>
        );
      case 'inspections':
        return (
          <form onSubmit={handleInspectionSubmit} className="space-y-4">
            <div><Label>Project</Label><select className="w-full px-3 py-2 border rounded-md bg-background" value={inspectionForm.project_id} onChange={(e) => setInspectionForm({...inspectionForm, project_id: e.target.value})} required><option value="">Select Project</option>{projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</select></div>
            <div><Label>Inspection Date</Label><Input type="date" value={inspectionForm.inspection_date} onChange={(e) => setInspectionForm({...inspectionForm, inspection_date: e.target.value})} required /></div>
            <div><Label>Inspector Name</Label><Input value={inspectionForm.inspector_name} onChange={(e) => setInspectionForm({...inspectionForm, inspector_name: e.target.value})} required /></div>
            <div><Label>Area</Label><Input value={inspectionForm.area} onChange={(e) => setInspectionForm({...inspectionForm, area: e.target.value})} required /></div>
            <div><Label>Findings</Label><Textarea value={inspectionForm.findings} onChange={(e) => setInspectionForm({...inspectionForm, findings: e.target.value})} /></div>
            <Button type="submit" className="w-full">Create Inspection</Button>
          </form>
        );
      case 'quality':
        return (
          <form onSubmit={handleQualitySubmit} className="space-y-4">
            <div><Label>Project</Label><select className="w-full px-3 py-2 border rounded-md bg-background" value={qualityForm.project_id} onChange={(e) => setQualityForm({...qualityForm, project_id: e.target.value})} required><option value="">Select Project</option>{projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</select></div>
            <div><Label>Form Type</Label><Select value={qualityForm.form_type} onValueChange={(v) => setQualityForm({...qualityForm, form_type: v})}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="RFI">RFI</SelectItem><SelectItem value="QA">QA Report</SelectItem><SelectItem value="QC">QC Report</SelectItem></SelectContent></Select></div>
            <div><Label>Reference Number</Label><Input value={qualityForm.reference_number} onChange={(e) => setQualityForm({...qualityForm, reference_number: e.target.value})} required /></div>
            <div><Label>Title</Label><Input value={qualityForm.title} onChange={(e) => setQualityForm({...qualityForm, title: e.target.value})} required /></div>
            <div><Label>Description</Label><Textarea value={qualityForm.description} onChange={(e) => setQualityForm({...qualityForm, description: e.target.value})} /></div>
            <Button type="submit" className="w-full">Create Form</Button>
          </form>
        );
      case 'audits':
        return (
          <form onSubmit={handleAuditSubmit} className="space-y-4">
            <div><Label>Project</Label><select className="w-full px-3 py-2 border rounded-md bg-background" value={auditForm.project_id} onChange={(e) => setAuditForm({...auditForm, project_id: e.target.value})} required><option value="">Select Project</option>{projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</select></div>
            <div><Label>Type</Label><Select value={auditForm.audit_type} onValueChange={(v) => setAuditForm({...auditForm, audit_type: v})}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="safety_audit">Safety Audit</SelectItem><SelectItem value="hazard_log">Hazard Log</SelectItem></SelectContent></Select></div>
            <div><Label>Audit Date</Label><Input type="date" value={auditForm.audit_date} onChange={(e) => setAuditForm({...auditForm, audit_date: e.target.value})} required /></div>
            <div><Label>Auditor Name</Label><Input value={auditForm.auditor_name} onChange={(e) => setAuditForm({...auditForm, auditor_name: e.target.value})} required /></div>
            <div><Label>Findings</Label><Textarea value={auditForm.findings} onChange={(e) => setAuditForm({...auditForm, findings: e.target.value})} required /></div>
            <div><Label>Severity</Label><Select value={auditForm.severity} onValueChange={(v) => setAuditForm({...auditForm, severity: v})}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="low">Low</SelectItem><SelectItem value="medium">Medium</SelectItem><SelectItem value="high">High</SelectItem></SelectContent></Select></div>
            <div><Label>Corrective Action</Label><Textarea value={auditForm.corrective_action} onChange={(e) => setAuditForm({...auditForm, corrective_action: e.target.value})} /></div>
            <Button type="submit" className="w-full">Create Audit</Button>
          </form>
        );
      case 'ncr':
        return (
          <form onSubmit={handleNcrSubmit} className="space-y-4">
            <div><Label>Project</Label><select className="w-full px-3 py-2 border rounded-md bg-background" value={ncrForm.project_id} onChange={(e) => setNcrForm({...ncrForm, project_id: e.target.value})} required><option value="">Select Project</option>{projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</select></div>
            <div><Label>NCR Number</Label><Input value={ncrForm.ncr_number} onChange={(e) => setNcrForm({...ncrForm, ncr_number: e.target.value})} required /></div>
            <div><Label>Title</Label><Input value={ncrForm.title} onChange={(e) => setNcrForm({...ncrForm, title: e.target.value})} required /></div>
            <div><Label>Description</Label><Textarea value={ncrForm.description} onChange={(e) => setNcrForm({...ncrForm, description: e.target.value})} required /></div>
            <div><Label>Category</Label><Input value={ncrForm.category} onChange={(e) => setNcrForm({...ncrForm, category: e.target.value})} required /></div>
            <div><Label>Severity</Label><Select value={ncrForm.severity} onValueChange={(v) => setNcrForm({...ncrForm, severity: v})}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="low">Low</SelectItem><SelectItem value="medium">Medium</SelectItem><SelectItem value="high">High</SelectItem><SelectItem value="critical">Critical</SelectItem></SelectContent></Select></div>
            <div><Label>Root Cause</Label><Textarea value={ncrForm.root_cause} onChange={(e) => setNcrForm({...ncrForm, root_cause: e.target.value})} /></div>
            <div><Label>Corrective Action</Label><Textarea value={ncrForm.corrective_action} onChange={(e) => setNcrForm({...ncrForm, corrective_action: e.target.value})} /></div>
            <Button type="submit" className="w-full">Create NCR</Button>
          </form>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Safety & Quality Management</h2>
          <p className="text-muted-foreground mt-1">Comprehensive safety and quality control</p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="cyber-button"><ShieldCheck className="w-4 h-4 mr-2" />New Entry</Button>
          </DialogTrigger>
          <DialogContent className="glass-card border-primary/20">
            <DialogHeader>
              <DialogTitle>Create {activeTab === 'checklists' ? 'Safety Checklist' : activeTab === 'inspections' ? 'Site Inspection' : activeTab === 'quality' ? 'Quality Form' : activeTab === 'audits' ? 'Safety Audit' : 'NCR Report'}</DialogTitle>
            </DialogHeader>
            {getDialogContent()}
          </DialogContent>
        </Dialog>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="checklists"><ShieldCheck className="w-4 h-4 mr-2" />Checklists</TabsTrigger>
          <TabsTrigger value="inspections"><ClipboardCheck className="w-4 h-4 mr-2" />Inspections</TabsTrigger>
          <TabsTrigger value="quality"><FileText className="w-4 h-4 mr-2" />Quality Forms</TabsTrigger>
          <TabsTrigger value="audits"><AlertTriangle className="w-4 h-4 mr-2" />Audits</TabsTrigger>
          <TabsTrigger value="ncr"><XCircle className="w-4 h-4 mr-2" />NCR</TabsTrigger>
        </TabsList>

        <TabsContent value="checklists" className="space-y-3">
          {checklists.map((item) => (
            <Card key={item.id} className="glass-card border-primary/20 p-4 hover:border-accent transition-all">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{item.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                  <p className="text-xs text-primary mt-2">{item.projects?.name}</p>
                  {item.completed_at && <p className="text-xs text-muted-foreground mt-1">Completed: {new Date(item.completed_at).toLocaleDateString()}</p>}
                </div>
                <Button size="sm" variant={item.completed ? "default" : "outline"} onClick={() => toggleComplete(item.id, item.completed)}>{item.completed ? <CheckCircle2 className="w-4 h-4 mr-1" /> : null}{item.completed ? 'Completed' : 'Mark Complete'}</Button>
              </div>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="inspections" className="space-y-3">
          {inspections.map((item) => (
            <Card key={item.id} className="glass-card border-primary/20 p-4 hover:border-accent transition-all">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-lg">{item.area}</h3>
                    <Badge variant={item.status === 'completed' ? 'default' : item.status === 'in_progress' ? 'secondary' : 'outline'}>{item.status}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">Inspector: {item.inspector_name}</p>
                  <p className="text-sm text-muted-foreground">Date: {new Date(item.inspection_date).toLocaleDateString()}</p>
                  {item.findings && <p className="text-sm mt-2">{item.findings}</p>}
                  <p className="text-xs text-primary mt-2">{item.projects?.name}</p>
                </div>
                <Select value={item.status} onValueChange={(v) => updateInspectionStatus(item.id, v)}><SelectTrigger className="w-32"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="pending">Pending</SelectItem><SelectItem value="in_progress">In Progress</SelectItem><SelectItem value="completed">Completed</SelectItem></SelectContent></Select>
              </div>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="quality" className="space-y-3">
          {qualityForms.map((item) => (
            <Card key={item.id} className="glass-card border-primary/20 p-4 hover:border-accent transition-all">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{item.form_type}</Badge>
                    <h3 className="font-semibold text-lg">{item.title}</h3>
                    <Badge variant={item.status === 'closed' ? 'default' : 'secondary'}>{item.status}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">Ref: {item.reference_number}</p>
                  {item.description && <p className="text-sm mt-2">{item.description}</p>}
                  <p className="text-xs text-muted-foreground mt-2">Submitted by: {item.submitted_by?.full_name}</p>
                  <p className="text-xs text-primary mt-1">{item.projects?.name}</p>
                </div>
                <Select value={item.status} onValueChange={(v) => updateQualityStatus(item.id, v)}><SelectTrigger className="w-32"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="open">Open</SelectItem><SelectItem value="under_review">Under Review</SelectItem><SelectItem value="closed">Closed</SelectItem></SelectContent></Select>
              </div>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="audits" className="space-y-3">
          {audits.map((item) => (
            <Card key={item.id} className="glass-card border-primary/20 p-4 hover:border-accent transition-all">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{item.audit_type === 'safety_audit' ? 'Safety Audit' : 'Hazard Log'}</Badge>
                    <Badge variant={item.severity === 'high' ? 'destructive' : item.severity === 'medium' ? 'secondary' : 'default'}>{item.severity}</Badge>
                  </div>
                  <p className="text-sm font-semibold mt-2">Auditor: {item.auditor_name}</p>
                  <p className="text-sm text-muted-foreground">Date: {new Date(item.audit_date).toLocaleDateString()}</p>
                  <p className="text-sm mt-2">{item.findings}</p>
                  {item.corrective_action && <p className="text-sm mt-2 text-green-600">Action: {item.corrective_action}</p>}
                  <p className="text-xs text-primary mt-2">{item.projects?.name}</p>
                </div>
                {item.action_taken && <Badge variant="default">Action Taken</Badge>}
              </div>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="ncr" className="space-y-3">
          {ncrs.map((item) => (
            <Card key={item.id} className="glass-card border-primary/20 p-4 hover:border-accent transition-all">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">NCR-{item.ncr_number}</Badge>
                    <h3 className="font-semibold text-lg">{item.title}</h3>
                    <Badge variant={item.severity === 'critical' ? 'destructive' : item.severity === 'high' ? 'destructive' : 'secondary'}>{item.severity}</Badge>
                  </div>
                  <p className="text-sm mt-2">{item.description}</p>
                  <p className="text-sm text-muted-foreground mt-2">Category: {item.category}</p>
                  {item.root_cause && <p className="text-sm mt-1">Root Cause: {item.root_cause}</p>}
                  {item.corrective_action && <p className="text-sm mt-1 text-green-600">Corrective Action: {item.corrective_action}</p>}
                  <p className="text-xs text-muted-foreground mt-2">Raised by: {item.raised_by?.full_name}</p>
                  <p className="text-xs text-primary mt-1">{item.projects?.name}</p>
                  <Badge variant={item.status === 'closed' ? 'default' : item.status === 'in_progress' ? 'secondary' : 'outline'} className="mt-2">{item.status}</Badge>
                </div>
                <Select value={item.status} onValueChange={(v) => updateNcrStatus(item.id, v)}><SelectTrigger className="w-32"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="open">Open</SelectItem><SelectItem value="in_progress">In Progress</SelectItem><SelectItem value="closed">Closed</SelectItem></SelectContent></Select>
              </div>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};
