import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, getBudgetProgressClass } from "@/lib/utils";
import { Home, Utensils, Car, Film, Zap, Tag } from "lucide-react";

interface BudgetProgressItem {
  id: number;
  categoryId: number;
  categoryName: string;
  categoryIcon: string;
  categoryColor: string;
  budgetAmount: string;
  spent: string;
  percentage: string;
}

export default function BudgetProgress() {
  const { data, isLoading } = useQuery<BudgetProgressItem[]>({
    queryKey: ["/api/analytics/budget-progress"],
  });
  
  const getIconForCategory = (icon: string) => {
    switch (icon) {
      case "home": return <Home className="h-4 w-4" />;
      case "utensils": return <Utensils className="h-4 w-4" />;
      case "car": return <Car className="h-4 w-4" />;
      case "film": return <Film className="h-4 w-4" />;
      case "bolt": return <Zap className="h-4 w-4" />;
      default: return <Tag className="h-4 w-4" />;
    }
  };

  return (
    <Card className="border border-neutral-200">
      <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-neutral-200">
        <CardTitle className="text-lg font-semibold text-neutral-800">Budget Progress</CardTitle>
        <Button variant="link" size="sm" asChild>
          <a href="/budgets" className="text-primary text-sm font-medium">Manage</a>
        </Button>
      </CardHeader>
      
      <CardContent className="p-6 space-y-6">
        {isLoading ? (
          <>
            {[...Array(5)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between items-center mb-2">
                  <Skeleton className="h-4 w-[120px]" />
                  <Skeleton className="h-4 w-[80px]" />
                </div>
                <Skeleton className="h-2.5 w-full rounded-full" />
                <Skeleton className="h-3 w-[60px] ml-auto" />
              </div>
            ))}
          </>
        ) : (
          <>
            {data && data.length > 0 ? (
              data.map((budget) => {
                const percentage = parseFloat(budget.percentage);
                
                return (
                  <div key={budget.id}>
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center">
                        <span className="mr-2" style={{ color: budget.categoryColor }}>
                          {getIconForCategory(budget.categoryIcon)}
                        </span>
                        <p className="text-sm font-medium text-neutral-800">{budget.categoryName}</p>
                      </div>
                      <div className="text-sm text-neutral-500">
                        {formatCurrency(budget.spent)} / {formatCurrency(budget.budgetAmount)}
                      </div>
                    </div>
                    <Progress 
                      value={percentage > 100 ? 100 : percentage} 
                      className="h-2.5 bg-neutral-200"
                      indicatorClassName={getBudgetProgressClass(percentage)}
                    />
                    <p className={`text-xs text-right mt-1 ${percentage > 100 ? 'text-danger' : 'text-neutral-500'}`}>
                      {budget.percentage}% used
                    </p>
                  </div>
                );
              })
            ) : (
              <div className="text-center text-neutral-500">
                No budgets found. Create a budget to track your spending.
              </div>
            )}
          </>
        )}
      </CardContent>
      
      <CardFooter className="p-6 border-t border-neutral-200 bg-neutral-50">
        <Button className="w-full" asChild>
          <a href="/budgets">
            Add New Budget
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
}
