import { z } from 'zod';

// Project validation schema
export const projectSchema = z.object({
  name: z.string()
    .trim()
    .min(1, "Project name is required")
    .max(100, "Project name must be less than 100 characters"),
  description: z.string()
    .trim()
    .max(1000, "Description must be less than 1000 characters")
    .optional()
    .or(z.literal('')),
  location: z.string()
    .trim()
    .max(200, "Location must be less than 200 characters")
    .optional()
    .or(z.literal('')),
  budget: z.string()
    .optional()
    .refine((val) => {
      if (!val || val === '') return true;
      const num = parseFloat(val);
      return !isNaN(num) && num >= 0 && num <= 999999999999;
    }, "Budget must be a valid positive number"),
  status: z.enum(['planning', 'in_progress', 'on_hold', 'completed', 'cancelled']),
  start_date: z.string().optional().or(z.literal('')),
  end_date: z.string().optional().or(z.literal('')),
});

// Document validation schema
export const documentSchema = z.object({
  name: z.string()
    .trim()
    .min(1, "Document name is required")
    .max(200, "Document name must be less than 200 characters"),
  description: z.string()
    .trim()
    .max(500, "Description must be less than 500 characters")
    .optional()
    .or(z.literal('')),
  file_url: z.string()
    .trim()
    .url("Must be a valid URL")
    .max(500, "URL must be less than 500 characters"),
  project_id: z.string()
    .uuid("Invalid project ID"),
  category: z.string(),
  type: z.string(),
});

// Safety checklist validation schema
export const checklistSchema = z.object({
  project_id: z.string()
    .uuid("Invalid project ID"),
  title: z.string()
    .trim()
    .min(1, "Title is required")
    .max(200, "Title must be less than 200 characters"),
  description: z.string()
    .trim()
    .max(1000, "Description must be less than 1000 characters")
    .optional()
    .or(z.literal('')),
});

// Site inspection validation schema
export const inspectionSchema = z.object({
  project_id: z.string()
    .uuid("Invalid project ID"),
  inspection_date: z.string()
    .min(1, "Inspection date is required"),
  inspector_name: z.string()
    .trim()
    .min(1, "Inspector name is required")
    .max(100, "Inspector name must be less than 100 characters"),
  area: z.string()
    .trim()
    .min(1, "Area is required")
    .max(100, "Area must be less than 100 characters"),
  findings: z.string()
    .trim()
    .max(2000, "Findings must be less than 2000 characters")
    .optional()
    .or(z.literal('')),
  status: z.enum(['pending', 'in_progress', 'completed']),
});

// Quality form validation schema
export const qualityFormSchema = z.object({
  project_id: z.string()
    .uuid("Invalid project ID"),
  form_type: z.string()
    .min(1, "Form type is required"),
  reference_number: z.string()
    .trim()
    .min(1, "Reference number is required")
    .max(50, "Reference number must be less than 50 characters"),
  title: z.string()
    .trim()
    .min(1, "Title is required")
    .max(200, "Title must be less than 200 characters"),
  description: z.string()
    .trim()
    .max(2000, "Description must be less than 2000 characters")
    .optional()
    .or(z.literal('')),
  status: z.enum(['open', 'in_review', 'closed']),
});

// Safety audit validation schema
export const auditSchema = z.object({
  project_id: z.string()
    .uuid("Invalid project ID"),
  audit_type: z.string()
    .min(1, "Audit type is required"),
  audit_date: z.string()
    .min(1, "Audit date is required"),
  auditor_name: z.string()
    .trim()
    .min(1, "Auditor name is required")
    .max(100, "Auditor name must be less than 100 characters"),
  findings: z.string()
    .trim()
    .min(1, "Findings are required")
    .max(2000, "Findings must be less than 2000 characters"),
  severity: z.enum(['low', 'medium', 'high']),
  corrective_action: z.string()
    .trim()
    .max(2000, "Corrective action must be less than 2000 characters")
    .optional()
    .or(z.literal('')),
});

// NCR validation schema
export const ncrSchema = z.object({
  project_id: z.string()
    .uuid("Invalid project ID"),
  ncr_number: z.string()
    .trim()
    .min(1, "NCR number is required")
    .max(50, "NCR number must be less than 50 characters"),
  title: z.string()
    .trim()
    .min(1, "Title is required")
    .max(200, "Title must be less than 200 characters"),
  description: z.string()
    .trim()
    .min(1, "Description is required")
    .max(2000, "Description must be less than 2000 characters"),
  category: z.string()
    .trim()
    .min(1, "Category is required")
    .max(100, "Category must be less than 100 characters"),
  severity: z.enum(['low', 'medium', 'high']),
  corrective_action: z.string()
    .trim()
    .max(2000, "Corrective action must be less than 2000 characters")
    .optional()
    .or(z.literal('')),
  root_cause: z.string()
    .trim()
    .max(2000, "Root cause must be less than 2000 characters")
    .optional()
    .or(z.literal('')),
  status: z.enum(['open', 'in_progress', 'closed']),
});

// Material validation schema
export const materialSchema = z.object({
  name: z.string()
    .trim()
    .min(1, "Material name is required")
    .max(100, "Material name must be less than 100 characters"),
  description: z.string()
    .trim()
    .max(500, "Description must be less than 500 characters")
    .optional()
    .or(z.literal('')),
  unit: z.string()
    .trim()
    .min(1, "Unit is required")
    .max(20, "Unit must be less than 20 characters"),
  quantity: z.string()
    .refine((val) => {
      const num = parseInt(val);
      return !isNaN(num) && num >= 0 && num <= 999999999;
    }, "Quantity must be a valid positive number"),
  reorder_level: z.string()
    .refine((val) => {
      const num = parseInt(val);
      return !isNaN(num) && num >= 0 && num <= 999999999;
    }, "Reorder level must be a valid positive number"),
});

// Vendor validation schema
export const vendorSchema = z.object({
  name: z.string()
    .trim()
    .min(1, "Vendor name is required")
    .max(100, "Vendor name must be less than 100 characters"),
  contact_person: z.string()
    .trim()
    .max(100, "Contact person name must be less than 100 characters")
    .optional()
    .or(z.literal('')),
  email: z.string()
    .trim()
    .email("Must be a valid email address")
    .max(255, "Email must be less than 255 characters")
    .optional()
    .or(z.literal('')),
  phone: z.string()
    .trim()
    .regex(/^[0-9\s\-\+\(\)]*$/, "Phone number can only contain numbers, spaces, and +-()")
    .max(20, "Phone number must be less than 20 characters")
    .optional()
    .or(z.literal('')),
  address: z.string()
    .trim()
    .max(300, "Address must be less than 300 characters")
    .optional()
    .or(z.literal('')),
});
