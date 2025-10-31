import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText } from 'lucide-react';

interface DocumentsTabProps {
  userRole: string | null;
}

const DocumentsTab = ({ userRole }: DocumentsTabProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">Document Management</h2>
        <p className="text-muted-foreground">Upload and manage project documents</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="mr-2 h-5 w-5" />
            Documents
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Document storage, version control, and sharing features coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default DocumentsTab;
