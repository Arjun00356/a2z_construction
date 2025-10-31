import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare } from 'lucide-react';

const ClientPortalTab = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">Client Portal</h2>
        <p className="text-muted-foreground">View project updates and communicate with the team</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <MessageSquare className="mr-2 h-5 w-5" />
            Client Communication
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Project milestones, payment tracking, and ticketing system coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientPortalTab;
