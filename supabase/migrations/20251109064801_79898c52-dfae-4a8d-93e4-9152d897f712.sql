-- Create security definer function to get current user's profile ID
-- This bypasses RLS and prevents infinite recursion
CREATE OR REPLACE FUNCTION public.get_current_user_profile_id()
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id
  FROM public.profiles
  WHERE user_id = auth.uid()
  LIMIT 1
$$;

-- Drop the existing recursive policy
DROP POLICY IF EXISTS "Users view own and project profiles" ON public.profiles;

-- Create new policy using the security definer function
CREATE POLICY "Users view own and project profiles" ON public.profiles
FOR SELECT 
USING (
  auth.uid() = user_id 
  OR EXISTS (
    SELECT 1
    FROM project_members pm1
    JOIN project_members pm2 ON pm1.project_id = pm2.project_id
    WHERE pm1.user_id = profiles.id
      AND pm2.user_id = public.get_current_user_profile_id()
  )
);