import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { 
  LayoutDashboard, 
  FolderKanban, 
  CheckSquare, 
  FileText, 
  DollarSign, 
  Truck, 
  Package, 
  Ticket, 
  CreditCard, 
  ShieldAlert, 
  AlertTriangle, 
  Flag,
  LogOut,
  Users,
  Menu,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import logo from "@/assets/a2z-logo.png";
import { ProjectsSection } from "@/components/dashboard/ProjectsSection";
import { TasksSection } from "@/components/dashboard/TasksSection";
import { StatsOverview } from "@/components/dashboard/StatsOverview";
import { DocumentsSection } from "@/components/dashboard/DocumentsSection";
import { BudgetSection } from "@/components/dashboard/BudgetSection";
import { EquipmentSection } from "@/components/dashboard/EquipmentSection";
import { MaterialsSection } from "@/components/dashboard/MaterialsSection";
import { TicketsSection } from "@/components/dashboard/TicketsSection";
import { PaymentsSection } from "@/components/dashboard/PaymentsSection";
import { SafetySection } from "@/components/dashboard/SafetySection";
import { IncidentsSection } from "@/components/dashboard/IncidentsSection";
import { MilestonesSection } from "@/components/dashboard/MilestonesSection";
import { TeamSection } from "@/components/dashboard/TeamSection";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, signOut, loading } = useAuth();
  const [activeSection, setActiveSection] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="h-16 w-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-lg text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  const menuItems = [
    { id: "overview", title: "Dashboard Overview", icon: LayoutDashboard },
    { id: "projects", title: "Projects", icon: FolderKanban },
    { id: "tasks", title: "Tasks", icon: CheckSquare },
    { id: "documents", title: "Documents", icon: FileText },
    { id: "budget", title: "Budget & Expenses", icon: DollarSign },
    { id: "equipment", title: "Equipment", icon: Truck },
    { id: "materials", title: "Materials", icon: Package },
    { id: "tickets", title: "Support Tickets", icon: Ticket },
    { id: "payments", title: "Payments", icon: CreditCard },
    { id: "safety", title: "Safety Compliance", icon: ShieldAlert },
    { id: "incidents", title: "Incidents", icon: AlertTriangle },
    { id: "milestones", title: "Milestones", icon: Flag },
    { id: "team", title: "Team Directory", icon: Users },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case "projects":
        return <ProjectsSection />;
      case "tasks":
        return <TasksSection />;
      case "documents":
        return <DocumentsSection />;
      case "budget":
        return <BudgetSection />;
      case "equipment":
        return <EquipmentSection />;
      case "materials":
        return <MaterialsSection />;
      case "tickets":
        return <TicketsSection />;
      case "payments":
        return <PaymentsSection />;
      case "safety":
        return <SafetySection />;
      case "incidents":
        return <IncidentsSection />;
      case "milestones":
        return <MilestonesSection />;
      case "team":
        return <TeamSection />;
      case "overview":
      default:
        return (
          <div className="space-y-8">
            <div className="space-y-2">
              <h2 className="text-4xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent animate-fade-in">
                Welcome to A2Z Construction
              </h2>
              <p className="text-muted-foreground text-lg">
                Your centralised construction management platform for Indian projects
              </p>
            </div>
            
            <StatsOverview />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {menuItems.filter(item => item.id !== "overview").map((item, index) => {
                const Icon = item.icon;
                return (
                  <Card
                    key={item.id}
                    className="group relative overflow-hidden bg-[var(--gradient-card)] border-border/50 hover:border-primary/50 transition-[var(--transition-smooth)] cursor-pointer"
                    onClick={() => setActiveSection(item.id)}
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <div className="absolute inset-0 bg-[var(--gradient-glow)] opacity-0 group-hover:opacity-100 transition-opacity" />
                    <CardContent className="p-6 relative z-10">
                      <div className="flex items-center gap-4">
                        <div className="p-3 rounded-lg bg-gradient-to-br from-primary to-secondary shadow-[var(--shadow-neon)] group-hover:scale-110 transition-transform">
                          <Icon className="h-6 w-6 text-background" />
                        </div>
                        <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                          {item.title}
                        </h3>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Animated Background */}
      <div className="fixed inset-0 bg-[var(--gradient-glow)] pointer-events-none" />
      
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-foreground hover:text-primary"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <X /> : <Menu />}
            </Button>
            <img src={logo} alt="A2Z Construction" className="h-12 w-auto" />
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                A2Z Construction India
              </h1>
              <p className="text-sm text-muted-foreground">Management Dashboard</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/")}
              className="border-primary/50 hover:bg-primary/10"
            >
              Public Site
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSignOut}
              className="border-destructive/50 hover:bg-destructive/10"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`
          fixed lg:sticky top-[73px] left-0 h-[calc(100vh-73px)] 
          w-64 bg-card/50 backdrop-blur-xl border-r border-border/50 
          transition-transform duration-300 z-40
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <nav className="p-4 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveSection(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 rounded-lg
                    transition-[var(--transition-smooth)] group
                    ${isActive 
                      ? 'bg-gradient-to-r from-primary to-secondary text-background shadow-[var(--shadow-neon)]' 
                      : 'text-foreground hover:bg-muted'
                    }
                  `}
                >
                  <Icon className={`h-5 w-5 ${isActive ? '' : 'group-hover:text-primary'}`} />
                  <span className="font-medium">{item.title}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-8 relative z-10">
          <div className="max-w-7xl mx-auto animate-fade-in">
            {renderContent()}
          </div>
        </main>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Dashboard;
