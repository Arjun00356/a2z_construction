import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckSquare } from 'lucide-react';

interface TasksTabProps {
  userRole: string | null;
}

const TasksTab = ({ userRole }: TasksTabProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">Tasks & Kanban Board</h2>
        <p className="text-muted-foreground">Manage project tasks and workflow</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CheckSquare className="mr-2 h-5 w-5" />
            Task Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Gantt charts, Kanban boards, and task assignment coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default TasksTab;
