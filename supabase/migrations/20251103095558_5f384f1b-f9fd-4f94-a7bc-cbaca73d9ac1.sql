-- Create vendors table
CREATE TABLE public.vendors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  contact_person TEXT,
  email TEXT,
  phone TEXT,
  address TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.vendors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view vendors"
  ON public.vendors FOR SELECT
  USING (true);

CREATE POLICY "Admins and engineers can manage vendors"
  ON public.vendors FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'engineer'::app_role));

-- Create material_prices table (links materials to vendors with pricing)
CREATE TABLE public.material_prices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  material_id UUID NOT NULL REFERENCES public.materials(id) ON DELETE CASCADE,
  vendor_id UUID NOT NULL REFERENCES public.vendors(id) ON DELETE CASCADE,
  price NUMERIC NOT NULL,
  unit TEXT NOT NULL,
  last_updated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(material_id, vendor_id)
);

ALTER TABLE public.material_prices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view material prices"
  ON public.material_prices FOR SELECT
  USING (true);

CREATE POLICY "Admins and engineers can manage material prices"
  ON public.material_prices FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'engineer'::app_role));

-- Create material_requests table
CREATE TABLE public.material_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  material_id UUID NOT NULL REFERENCES public.materials(id) ON DELETE CASCADE,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  requested_by UUID NOT NULL,
  quantity INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'fulfilled')),
  approved_by UUID,
  approved_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.material_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own requests"
  ON public.material_requests FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role) OR 
         has_role(auth.uid(), 'engineer'::app_role) OR
         EXISTS (SELECT 1 FROM profiles WHERE id = requested_by AND user_id = auth.uid()));

CREATE POLICY "Team members can create requests"
  ON public.material_requests FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins and engineers can update requests"
  ON public.material_requests FOR UPDATE
  USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'engineer'::app_role));

-- Create material_transactions table (for inflow/outflow tracking)
CREATE TABLE public.material_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  material_id UUID NOT NULL REFERENCES public.materials(id) ON DELETE CASCADE,
  project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('inflow', 'outflow')),
  quantity INTEGER NOT NULL,
  unit_price NUMERIC,
  vendor_id UUID REFERENCES public.vendors(id) ON DELETE SET NULL,
  reference_number TEXT,
  notes TEXT,
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.material_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view transactions"
  ON public.material_transactions FOR SELECT
  USING (true);

CREATE POLICY "Admins and engineers can create transactions"
  ON public.material_transactions FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'engineer'::app_role));

-- Create purchase_orders table
CREATE TABLE public.purchase_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  po_number TEXT NOT NULL UNIQUE,
  vendor_id UUID NOT NULL REFERENCES public.vendors(id) ON DELETE CASCADE,
  project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
  total_amount NUMERIC NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'approved', 'received', 'cancelled')),
  order_date DATE NOT NULL,
  expected_delivery DATE,
  actual_delivery DATE,
  document_url TEXT,
  notes TEXT,
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.purchase_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view purchase orders"
  ON public.purchase_orders FOR SELECT
  USING (true);

CREATE POLICY "Admins and engineers can manage purchase orders"
  ON public.purchase_orders FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'engineer'::app_role));

-- Create purchase_order_items table
CREATE TABLE public.purchase_order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  purchase_order_id UUID NOT NULL REFERENCES public.purchase_orders(id) ON DELETE CASCADE,
  material_id UUID NOT NULL REFERENCES public.materials(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL,
  unit_price NUMERIC NOT NULL,
  total_price NUMERIC NOT NULL
);

ALTER TABLE public.purchase_order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view PO items"
  ON public.purchase_order_items FOR SELECT
  USING (true);

CREATE POLICY "Admins and engineers can manage PO items"
  ON public.purchase_order_items FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'engineer'::app_role));

-- Add triggers for updated_at
CREATE TRIGGER update_vendors_updated_at BEFORE UPDATE ON public.vendors
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_material_requests_updated_at BEFORE UPDATE ON public.material_requests
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_purchase_orders_updated_at BEFORE UPDATE ON public.purchase_orders
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert dummy data for vendors
INSERT INTO public.vendors (name, contact_person, email, phone, address) VALUES
('BuildMart Suppliers', 'Rajesh Kumar', 'rajesh@buildmart.com', '+91-9876543210', 'Sector 12, Noida, UP'),
('Steel & Cement Co.', 'Amit Sharma', 'amit@steelcement.com', '+91-9876543211', 'Industrial Area, Ghaziabad, UP'),
('Modern Hardware', 'Priya Singh', 'priya@modernhw.com', '+91-9876543212', 'Nehru Place, Delhi'),
('Quality Materials Ltd', 'Vikram Patel', 'vikram@qualitymat.com', '+91-9876543213', 'Sector 18, Noida, UP');

-- Insert dummy material prices
INSERT INTO public.material_prices (material_id, vendor_id, price, unit)
SELECT m.id, v.id, 
  CASE 
    WHEN m.name LIKE '%Cement%' THEN 450
    WHEN m.name LIKE '%Steel%' THEN 65
    WHEN m.name LIKE '%Sand%' THEN 800
    WHEN m.name LIKE '%Bricks%' THEN 6
    ELSE 100
  END,
  m.unit
FROM public.materials m
CROSS JOIN public.vendors v
WHERE v.name IN ('BuildMart Suppliers', 'Steel & Cement Co.')
LIMIT 20;