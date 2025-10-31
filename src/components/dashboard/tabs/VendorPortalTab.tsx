import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Briefcase } from 'lucide-react';

const VendorPortalTab = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">Vendor Portal</h2>
        <p className="text-muted-foreground">Submit quotes and track payments</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Briefcase className="mr-2 h-5 w-5" />
            Vendor Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Bidding system, payment tracking, and order history coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default VendorPortalTab;
