import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { FolderKanban, CheckSquare, Ticket, DollarSign } from "lucide-react";

export const StatsOverview = () => {
  const [stats, setStats] = useState({
    projects: 0,
    tasks: 0,
    tickets: 0,
    budget: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [projectsRes, tasksRes, ticketsRes, budgetRes] = await Promise.all([
        supabase.from('projects').select('*', { count: 'exact', head: true }),
        supabase.from('tasks').select('*', { count: 'exact', head: true }),
        supabase.from('tickets').select('*', { count: 'exact', head: true }),
        supabase.from('projects').select('budget'),
      ]);

      const totalBudget = budgetRes.data?.reduce((sum, p) => sum + (Number(p.budget) || 0), 0) || 0;

      setStats({
        projects: projectsRes.count || 0,
        tasks: tasksRes.count || 0,
        tickets: ticketsRes.count || 0,
        budget: totalBudget,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const statCards = [
    {
      title: "Active Projects",
      value: stats.projects,
      icon: FolderKanban,
      gradient: "from-primary to-accent",
    },
    {
      title: "Pending Tasks",
      value: stats.tasks,
      icon: CheckSquare,
      gradient: "from-secondary to-primary",
    },
    {
      title: "Open Tickets",
      value: stats.tickets,
      icon: Ticket,
      gradient: "from-accent to-secondary",
    },
    {
      title: "Total Budget",
      value: `₹${stats.budget.toLocaleString('en-IN')}`,
      icon: DollarSign,
      gradient: "from-primary to-secondary",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card
            key={stat.title}
            className="relative overflow-hidden bg-[var(--gradient-card)] border-border/50 hover:border-primary/50 transition-[var(--transition-smooth)] group"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="absolute inset-0 bg-[var(--gradient-glow)] opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardContent className="p-6 relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg bg-gradient-to-br ${stat.gradient} shadow-[var(--shadow-neon)]`}>
                  <Icon className="h-6 w-6 text-background" />
                </div>
              </div>
              <CardDescription className="text-muted-foreground">{stat.title}</CardDescription>
              <CardTitle className="text-4xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent mt-2">
                {stat.value}
              </CardTitle>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
