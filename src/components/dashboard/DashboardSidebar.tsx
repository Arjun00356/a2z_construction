import { LayoutDashboard, FolderKanban, CheckSquare, FileText, DollarSign, Users, BarChart3, Shield, MessageSquare, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import logo from "@/assets/a2z-logo.png";

interface DashboardSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userRole: string | null;
}

const DashboardSidebar = ({ activeTab, setActiveTab, userRole }: DashboardSidebarProps) => {
  const menuItems = [
    { id: 'projects', label: 'Projects', icon: FolderKanban, roles: ['admin', 'engineer', 'client', 'vendor'] },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare, roles: ['admin', 'engineer'] },
    { id: 'documents', label: 'Documents', icon: FileText, roles: ['admin', 'engineer', 'client'] },
    { id: 'budget', label: 'Budget & Costs', icon: DollarSign, roles: ['admin', 'engineer'] },
    { id: 'resources', label: 'Resources', icon: Users, roles: ['admin', 'engineer'] },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, roles: ['admin', 'engineer'] },
    { id: 'safety', label: 'Safety', icon: Shield, roles: ['admin', 'engineer'] },
    { id: 'client-portal', label: 'Client Portal', icon: MessageSquare, roles: ['client'] },
    { id: 'vendor-portal', label: 'Vendor Portal', icon: Briefcase, roles: ['vendor'] },
  ];

  const filteredMenuItems = menuItems.filter(item => 
    userRole && item.roles.includes(userRole)
  );

  return (
    <div className="w-64 bg-card border-r border-border flex flex-col">
      <div className="p-6 border-b border-border">
        <img src={logo} alt="A2Z Construction" className="h-12 w-auto" />
      </div>
      
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-2">
          {filteredMenuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.id}
                variant={activeTab === item.id ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveTab(item.id)}
              >
                <Icon className="mr-2 h-4 w-4" />
                {item.label}
              </Button>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
};

export default DashboardSidebar;
