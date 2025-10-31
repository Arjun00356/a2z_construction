import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield } from 'lucide-react';

interface SafetyTabProps {
  userRole: string | null;
}

const SafetyTab = ({ userRole }: SafetyTabProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">Site & Safety Management</h2>
        <p className="text-muted-foreground">Track safety compliance and incidents</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="mr-2 h-5 w-5" />
            Safety
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Safety checklists, incident reporting, and compliance tracking coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SafetyTab;
