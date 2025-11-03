-- Add site inspections table
CREATE TABLE public.site_inspections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id),
  inspection_date DATE NOT NULL,
  inspector_name TEXT NOT NULL,
  area TEXT NOT NULL,
  findings TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  completed BOOLEAN NOT NULL DEFAULT false,
  completed_by UUID REFERENCES public.profiles(id),
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add quality control forms table
CREATE TABLE public.quality_forms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id),
  form_type TEXT NOT NULL CHECK (form_type IN ('RFI', 'QA', 'QC')),
  reference_number TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'open',
  submitted_by UUID NOT NULL REFERENCES public.profiles(id),
  reviewed_by UUID REFERENCES public.profiles(id),
  submitted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add safety audits table
CREATE TABLE public.safety_audits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id),
  audit_type TEXT NOT NULL CHECK (audit_type IN ('safety_audit', 'hazard_log')),
  audit_date DATE NOT NULL,
  auditor_name TEXT NOT NULL,
  findings TEXT NOT NULL,
  severity TEXT NOT NULL DEFAULT 'medium',
  corrective_action TEXT,
  action_taken BOOLEAN NOT NULL DEFAULT false,
  action_by UUID REFERENCES public.profiles(id),
  action_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add NCR reports table
CREATE TABLE public.ncr_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id),
  ncr_number TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  severity TEXT NOT NULL DEFAULT 'medium',
  raised_by UUID NOT NULL REFERENCES public.profiles(id),
  assigned_to UUID REFERENCES public.profiles(id),
  status TEXT NOT NULL DEFAULT 'open',
  corrective_action TEXT,
  root_cause TEXT,
  raised_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  closed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.site_inspections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quality_forms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.safety_audits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ncr_reports ENABLE ROW LEVEL SECURITY;

-- RLS Policies for site_inspections
CREATE POLICY "Project members can view site inspections"
ON public.site_inspections FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM project_members pm
    JOIN profiles p ON p.id = pm.user_id
    WHERE pm.project_id = site_inspections.project_id
    AND p.user_id = auth.uid()
  )
);

CREATE POLICY "Team members can manage site inspections"
ON public.site_inspections FOR ALL
USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'engineer'));

-- RLS Policies for quality_forms
CREATE POLICY "Project members can view quality forms"
ON public.quality_forms FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM project_members pm
    JOIN profiles p ON p.id = pm.user_id
    WHERE pm.project_id = quality_forms.project_id
    AND p.user_id = auth.uid()
  )
);

CREATE POLICY "Team members can manage quality forms"
ON public.quality_forms FOR ALL
USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'engineer'));

-- RLS Policies for safety_audits
CREATE POLICY "Project members can view safety audits"
ON public.safety_audits FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM project_members pm
    JOIN profiles p ON p.id = pm.user_id
    WHERE pm.project_id = safety_audits.project_id
    AND p.user_id = auth.uid()
  )
);

CREATE POLICY "Team members can manage safety audits"
ON public.safety_audits FOR ALL
USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'engineer'));

-- RLS Policies for ncr_reports
CREATE POLICY "Project members can view NCR reports"
ON public.ncr_reports FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM project_members pm
    JOIN profiles p ON p.id = pm.user_id
    WHERE pm.project_id = ncr_reports.project_id
    AND p.user_id = auth.uid()
  )
);

CREATE POLICY "Team members can manage NCR reports"
ON public.ncr_reports FOR ALL
USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'engineer'));