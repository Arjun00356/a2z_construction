import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users } from 'lucide-react';

interface ResourcesTabProps {
  userRole: string | null;
}

const ResourcesTab = ({ userRole }: ResourcesTabProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">Resource Management</h2>
        <p className="text-muted-foreground">Manage equipment, materials, and labor</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="mr-2 h-5 w-5" />
            Resources
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Equipment allocation, materials inventory, and labor scheduling coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResourcesTab;
