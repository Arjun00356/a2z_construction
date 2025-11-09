import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export type UserRole = 'admin' | 'engineer' | 'client';

export const useUserRole = () => {
  const { user } = useAuth();
  const [roles, setRoles] = useState<UserRole[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserRole = async () => {
      if (!user) {
        setRoles([]);
        setLoading(false);
        return;
      }

      try {
        // First get the profile ID
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('id')
          .eq('user_id', user.id)
          .single();

        if (profileError) throw profileError;

        // Then get the roles
        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', profileData.id);

        if (error) throw error;

        setRoles(data?.map(r => r.role as UserRole) || []);
      } catch (error) {
        console.error('Error fetching user role:', error);
        setRoles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUserRole();
  }, [user]);

  const hasRole = (role: UserRole) => roles.includes(role);
  const isAdmin = hasRole('admin');
  const isEngineer = hasRole('engineer');
  const isClient = hasRole('client');

  return { roles, hasRole, isAdmin, isEngineer, isClient, loading };
};
