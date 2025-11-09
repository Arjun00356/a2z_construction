-- Fix profiles table RLS policy to prevent data harvesting
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;

CREATE POLICY "Users view own and project profiles"
ON public.profiles
FOR SELECT
USING (
  auth.uid() = user_id OR
  EXISTS (
    SELECT 1 FROM project_members pm1
    JOIN project_members pm2 ON pm1.project_id = pm2.project_id
    JOIN profiles p ON p.id = pm1.user_id
    WHERE p.user_id = profiles.user_id
    AND pm2.user_id = (SELECT user_id FROM profiles WHERE user_id = auth.uid())
  )
);

-- Fix vendors table RLS policy to restrict access
DROP POLICY IF EXISTS "Authenticated users can view vendors" ON public.vendors;

CREATE POLICY "Admins and engineers view vendors"
ON public.vendors
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'engineer'::app_role));

-- Fix material_prices table RLS policy to restrict access
DROP POLICY IF EXISTS "Authenticated users can view material prices" ON public.material_prices;

CREATE POLICY "Admins and engineers view pricing"
ON public.material_prices
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'engineer'::app_role));

-- Add missing RLS policies for equipment_allocation table
CREATE POLICY "Project members view allocations"
ON public.equipment_allocation
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM project_members pm
    JOIN profiles p ON p.id = pm.user_id
    WHERE pm.project_id = equipment_allocation.project_id
    AND p.user_id = auth.uid()
  )
);

CREATE POLICY "Team manages allocations"
ON public.equipment_allocation
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'engineer'::app_role));