import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Transaction } from "@shared/schema";
import { CreditCard, ShoppingCart, DollarSign, Home, Utensils, Car, Film, Zap, Tag } from "lucide-react";

export default function RecentTransactions() {
  const { data: transactions, isLoading } = useQuery<Transaction[]>({
    queryKey: ["/api/transactions"],
  });
  
  const { data: categories } = useQuery({
    queryKey: ["/api/categories"],
  });
  
  // Get the 5 most recent transactions
  const recentTransactions = transactions
    ? transactions.slice(0, 5)
    : [];
    
  const getCategoryName = (categoryId: number) => {
    if (!categories) return "Unknown";
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : "Unknown";
  };
  
  const getCategoryColor = (categoryId: number) => {
    if (!categories) return "#9aa0a6";
    const category = categories.find(c => c.id === categoryId);
    return category ? category.color : "#9aa0a6";
  };
  
  const getIconForCategory = (categoryId: number) => {
    if (!categories) return <Tag className="h-4 w-4" />;
    
    const category = categories.find(c => c.id === categoryId);
    if (!category) return <Tag className="h-4 w-4" />;
    
    switch (category.icon) {
      case "wallet": return <DollarSign className="h-4 w-4" />;
      case "home": return <Home className="h-4 w-4" />;
      case "utensils": return <Utensils className="h-4 w-4" />;
      case "car": return <Car className="h-4 w-4" />;
      case "film": return <Film className="h-4 w-4" />;
      case "bolt": return <Zap className="h-4 w-4" />;
      case "tag": return <Tag className="h-4 w-4" />;
      case "piggy-bank": return <DollarSign className="h-4 w-4" />;
      default: return <Tag className="h-4 w-4" />;
    }
  };

  return (
    <Card className="border border-neutral-200">
      <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-neutral-200">
        <CardTitle className="text-lg font-semibold text-neutral-800">Recent Transactions</CardTitle>
        <Button variant="link" size="sm" asChild>
          <a href="/transactions" className="text-primary text-sm font-medium">View All</a>
        </Button>
      </CardHeader>
      
      <div className="overflow-x-auto">
        {isLoading ? (
          <div className="p-6 space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[200px]" />
                  <Skeleton className="h-3 w-[150px]" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <table className="min-w-full divide-y divide-neutral-200">
            <thead className="bg-neutral-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Description</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Category</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Date</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">Amount</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-neutral-200">
              {recentTransactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className={`h-8 w-8 rounded-full ${transaction.type === 'income' ? 'bg-success bg-opacity-10' : 'bg-primary-light bg-opacity-10'} flex items-center justify-center mr-3`}>
                        {transaction.type === 'income' ? 
                          <DollarSign className="h-4 w-4 text-success" /> :
                          <ShoppingCart className="h-4 w-4 text-primary" />
                        }
                      </div>
                      <div className="text-sm font-medium text-neutral-800">{transaction.description}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge variant="outline" className="px-2 py-1 text-xs rounded-full bg-opacity-10" style={{ 
                      backgroundColor: `${getCategoryColor(transaction.categoryId)}20`, 
                      color: getCategoryColor(transaction.categoryId) 
                    }}>
                      <span className="flex items-center gap-1">
                        {getIconForCategory(transaction.categoryId)}
                        {getCategoryName(transaction.categoryId)}
                      </span>
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                    {formatDate(transaction.date)}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium text-right ${transaction.type === 'income' ? 'text-success' : 'text-danger'}`}>
                    {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      
      {!isLoading && recentTransactions.length === 0 && (
        <div className="p-6 text-center">
          <p className="text-neutral-500">No transactions found. Add a new transaction to get started.</p>
        </div>
      )}
    </Card>
  );
}
