-- Add category column to documents table
ALTER TABLE public.documents 
ADD COLUMN IF NOT EXISTS category text NOT NULL DEFAULT 'other';

-- Add check constraint for valid categories
ALTER TABLE public.documents
ADD CONSTRAINT valid_document_category CHECK (
  category IN ('registry', 'rera_permission', 'gda_permission', 'pollution', 'customer_contract', 'other')
);

-- Insert dummy documents for each category
INSERT INTO public.documents (name, description, file_url, type, category, project_id, uploaded_by, file_size)
SELECT 
  'Registry Certificate',
  'Property registry certificate for the project',
  'https://example.com/registry-cert.pdf',
  'contract',
  'registry',
  p.id,
  p.created_by,
  2048576
FROM public.projects p
LIMIT 1;

INSERT INTO public.documents (name, description, file_url, type, category, project_id, uploaded_by, file_size)
SELECT 
  'RERA Approval Letter',
  'Real Estate Regulatory Authority approval document',
  'https://example.com/rera-approval.pdf',
  'permit',
  'rera_permission',
  p.id,
  p.created_by,
  1536000
FROM public.projects p
LIMIT 1;

INSERT INTO public.documents (name, description, file_url, type, category, project_id, uploaded_by, file_size)
SELECT 
  'GDA Building Permit',
  'Ghaziabad Development Authority building permission',
  'https://example.com/gda-permit.pdf',
  'permit',
  'gda_permission',
  p.id,
  p.created_by,
  1824000
FROM public.projects p
LIMIT 1;

INSERT INTO public.documents (name, description, file_url, type, category, project_id, uploaded_by, file_size)
SELECT 
  'Pollution Clearance Certificate',
  'Environmental pollution clearance from authorities',
  'https://example.com/pollution-cert.pdf',
  'permit',
  'pollution',
  p.id,
  p.created_by,
  1024000
FROM public.projects p
LIMIT 1;

INSERT INTO public.documents (name, description, file_url, type, category, project_id, uploaded_by, file_size)
SELECT 
  'Customer Agreement - Plot 101',
  'Sales agreement with customer for Plot 101',
  'https://example.com/customer-contract-101.pdf',
  'contract',
  'customer_contract',
  p.id,
  p.created_by,
  2560000
FROM public.projects p
LIMIT 1;