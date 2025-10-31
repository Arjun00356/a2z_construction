import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3 } from 'lucide-react';

const AnalyticsTab = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">Analytics & Reporting</h2>
        <p className="text-muted-foreground">Project insights and performance metrics</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="mr-2 h-5 w-5" />
            Reports
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Progress reports, financial summaries, and productivity analytics coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsTab;
