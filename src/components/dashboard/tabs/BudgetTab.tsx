import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign } from 'lucide-react';

interface BudgetTabProps {
  userRole: string | null;
}

const BudgetTab = ({ userRole }: BudgetTabProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">Budget & Cost Tracking</h2>
        <p className="text-muted-foreground">Monitor project finances and expenses</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <DollarSign className="mr-2 h-5 w-5" />
            Financial Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Expense logging, budget tracking, and financial reports coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default BudgetTab;
