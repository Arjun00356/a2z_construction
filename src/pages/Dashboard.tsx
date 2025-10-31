import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import ProjectsTab from '@/components/dashboard/tabs/ProjectsTab';
import TasksTab from '@/components/dashboard/tabs/TasksTab';
import DocumentsTab from '@/components/dashboard/tabs/DocumentsTab';
import BudgetTab from '@/components/dashboard/tabs/BudgetTab';
import ResourcesTab from '@/components/dashboard/tabs/ResourcesTab';
import AnalyticsTab from '@/components/dashboard/tabs/AnalyticsTab';
import SafetyTab from '@/components/dashboard/tabs/SafetyTab';
import ClientPortalTab from '@/components/dashboard/tabs/ClientPortalTab';
import VendorPortalTab from '@/components/dashboard/tabs/VendorPortalTab';

const Dashboard = () => {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('projects');
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loadingRole, setLoadingRole] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserRole();
    }
  }, [user]);

  const fetchUserRole = async () => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user?.id)
        .single();

      if (!error && data) {
        setUserRole(data.role);
      }
    } catch (error) {
      console.error('Error fetching user role:', error);
    } finally {
      setLoadingRole(false);
    }
  };

  if (loading || loadingRole) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'projects':
        return <ProjectsTab userRole={userRole} />;
      case 'tasks':
        return <TasksTab userRole={userRole} />;
      case 'documents':
        return <DocumentsTab userRole={userRole} />;
      case 'budget':
        return <BudgetTab userRole={userRole} />;
      case 'resources':
        return <ResourcesTab userRole={userRole} />;
      case 'analytics':
        return <AnalyticsTab />;
      case 'safety':
        return <SafetyTab userRole={userRole} />;
      case 'client-portal':
        return <ClientPortalTab />;
      case 'vendor-portal':
        return <VendorPortalTab />;
      default:
        return <ProjectsTab userRole={userRole} />;
    }
  };

  return (
    <div className="min-h-screen flex w-full bg-background">
      <DashboardSidebar activeTab={activeTab} setActiveTab={setActiveTab} userRole={userRole} />
      
      <div className="flex-1 flex flex-col">
        <DashboardHeader />
        
        <main className="flex-1 p-6 overflow-auto">
          {renderTabContent()}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
