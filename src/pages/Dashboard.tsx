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
  Settings
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import logo from "@/assets/a2z-logo.png";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, signOut, loading } = useAuth();
  const [activeSection, setActiveSection] = useState("overview");

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  const features = [
    {
      id: "projects",
      title: "Projects",
      description: "Manage construction projects",
      icon: FolderKanban,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      id: "tasks",
      title: "Tasks",
      description: "Track and assign tasks",
      icon: CheckSquare,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      id: "documents",
      title: "Documents",
      description: "Store blueprints, contracts & permits",
      icon: FileText,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      id: "budget",
      title: "Budget & Expenses",
      description: "Monitor project costs",
      icon: DollarSign,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
    },
    {
      id: "equipment",
      title: "Equipment",
      description: "Manage machinery and tools",
      icon: Truck,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      id: "materials",
      title: "Materials",
      description: "Track inventory and supplies",
      icon: Package,
      color: "text-teal-600",
      bgColor: "bg-teal-50",
    },
    {
      id: "tickets",
      title: "Support Tickets",
      description: "Client support and issues",
      icon: Ticket,
      color: "text-pink-600",
      bgColor: "bg-pink-50",
    },
    {
      id: "payments",
      title: "Payments",
      description: "Invoice and payment tracking",
      icon: CreditCard,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
    },
    {
      id: "safety",
      title: "Safety Checklists",
      description: "Site safety compliance",
      icon: ShieldAlert,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
    {
      id: "incidents",
      title: "Incidents",
      description: "Report and track incidents",
      icon: AlertTriangle,
      color: "text-amber-600",
      bgColor: "bg-amber-50",
    },
    {
      id: "milestones",
      title: "Milestones",
      description: "Project milestones and deadlines",
      icon: Flag,
      color: "text-cyan-600",
      bgColor: "bg-cyan-50",
    },
    {
      id: "team",
      title: "Team Members",
      description: "Manage project teams and roles",
      icon: Users,
      color: "text-violet-600",
      bgColor: "bg-violet-50",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src={logo} alt="A2Z Construction" className="h-12 w-auto" />
            <div>
              <h1 className="text-xl font-bold text-foreground">A2Z Construction</h1>
              <p className="text-sm text-muted-foreground">Management Dashboard</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/home")}
            >
              <Settings className="h-4 w-4 mr-2" />
              Public Site
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSignOut}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">Welcome back!</h2>
          <p className="text-muted-foreground">
            Access all your construction management tools from one place
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card
                key={feature.id}
                className="hover:shadow-lg transition-all cursor-pointer border-2 hover:border-primary"
                onClick={() => setActiveSection(feature.id)}
              >
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg ${feature.bgColor} flex items-center justify-center mb-3`}>
                    <Icon className={`h-6 w-6 ${feature.color}`} />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" size="sm" className="w-full">
                    Open {feature.title}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Stats */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Active Projects</CardDescription>
              <CardTitle className="text-3xl">0</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Pending Tasks</CardDescription>
              <CardTitle className="text-3xl">0</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Open Tickets</CardDescription>
              <CardTitle className="text-3xl">0</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Budget</CardDescription>
              <CardTitle className="text-3xl">$0</CardTitle>
            </CardHeader>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
