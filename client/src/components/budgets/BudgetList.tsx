import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription,
  CardFooter 
} from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency, formatDate, getBudgetProgressClass } from "@/lib/utils";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Budget } from "@shared/schema";
import { 
  MoreVertical, 
  Edit, 
  Trash2,
  Home,
  Utensils,
  Car,
  Film,
  Zap,
  Tag
} from "lucide-react";
import BudgetForm from "./BudgetForm";

interface BudgetListProps {
  budgets?: Budget[];
  isLoading: boolean;
}

export default function BudgetList({ budgets: propBudgets, isLoading }: BudgetListProps) {
  const { toast } = useToast();
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingBudgetId, setDeletingBudgetId] = useState<number | null>(null);
  
  // Only fetch budgets if not provided through props
  const { data: fetchedBudgets, isLoading: fetchLoading } = useQuery({
    queryKey: ["/api/budgets"],
    enabled: !propBudgets
  });
  
  // Fetch categories for budget display
  const { data: categories } = useQuery({
    queryKey: ["/api/categories"],
  });
  
  // Fetch transactions to calculate budget progress
  const { data: transactions } = useQuery({
    queryKey: ["/api/transactions"],
  });
  
  // Determine whether to use prop budgets or fetched budgets
  const allBudgets = propBudgets || fetchedBudgets || [];
  const loading = isLoading || fetchLoading;
  
  // Get category name by ID
  const getCategoryName = (categoryId: number) => {
    if (!categories) return "Unknown";
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : "Unknown";
  };
  
  // Get category color by ID
  const getCategoryColor = (categoryId: number) => {
    if (!categories) return "#9aa0a6";
    const category = categories.find(c => c.id === categoryId);
    return category ? category.color : "#9aa0a6";
  };
  
  // Get category icon by ID
  const getCategoryIcon = (categoryId: number) => {
    if (!categories) return <Tag className="h-5 w-5" />;
    
    const category = categories.find(c => c.id === categoryId);
    if (!category) return <Tag className="h-5 w-5" />;
    
    switch (category.icon) {
      case "home": return <Home className="h-5 w-5" />;
      case "utensils": return <Utensils className="h-5 w-5" />;
      case "car": return <Car className="h-5 w-5" />;
      case "film": return <Film className="h-5 w-5" />;
      case "bolt": return <Zap className="h-5 w-5" />;
      default: return <Tag className="h-5 w-5" />;
    }
  };
  
  // Calculate budget progress
  const calculateBudgetProgress = (budget: Budget) => {
    if (!transactions) return { spent: 0, percentage: 0 };
    
    const categoryTransactions = transactions.filter(
      t => t.categoryId === budget.categoryId && t.type === "expense"
    );
    
    const spent = categoryTransactions.reduce(
      (sum, t) => sum + Number(t.amount), 0
    );
    
    const percentage = (spent / Number(budget.amount)) * 100;
    
    return {
      spent,
      percentage,
    };
  };
  
  // Delete budget mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest('DELETE', `/api/budgets/${id}`);
      return res;
    },
    onSuccess: () => {
      toast({
        title: "Budget deleted",
        description: "Your budget has been deleted successfully",
      });
      
      // Close delete dialog
      setDeleteDialogOpen(false);
      setDeletingBudgetId(null);
      
      // Invalidate queries to refetch data
      queryClient.invalidateQueries({ queryKey: ['/api/budgets'] });
      queryClient.invalidateQueries({ queryKey: ['/api/analytics/budget-progress'] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete budget. Please try again.",
        variant: "destructive",
      });
    },
  });
  
  // Handle budget edit
  const handleEditBudget = (budget: Budget) => {
    setEditingBudget(budget);
  };
  
  // Handle budget delete
  const handleDeleteBudget = (id: number) => {
    setDeletingBudgetId(id);
    setDeleteDialogOpen(true);
  };
  
  // Handle confirm delete
  const confirmDelete = () => {
    if (deletingBudgetId) {
      deleteMutation.mutate(deletingBudgetId);
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Budget List</CardTitle>
          <CardDescription>Manage your spending limits for each category</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between items-center mb-2">
                    <Skeleton className="h-5 w-[200px]" />
                    <Skeleton className="h-5 w-[100px]" />
                  </div>
                  <Skeleton className="h-2.5 w-full rounded-full" />
                  <Skeleton className="h-4 w-[80px] ml-auto" />
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Category</TableHead>
                    <TableHead>Period</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead className="w-[80px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allBudgets.length > 0 ? (
                    allBudgets.map((budget) => {
                      const { spent, percentage } = calculateBudgetProgress(budget);
                      
                      return (
                        <TableRow key={budget.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="rounded-full p-1.5" style={{
                                backgroundColor: `${getCategoryColor(budget.categoryId)}20`,
                                color: getCategoryColor(budget.categoryId)
                              }}>
                                {getCategoryIcon(budget.categoryId)}
                              </div>
                              <span className="font-medium">{getCategoryName(budget.categoryId)}</span>
                            </div>
                          </TableCell>
                          <TableCell className="capitalize">{budget.period}</TableCell>
                          <TableCell>{formatDate(budget.startDate)}</TableCell>
                          <TableCell>{formatCurrency(budget.amount)}</TableCell>
                          <TableCell>
                            <div className="w-full max-w-[200px]">
                              <div className="flex justify-between text-xs mb-1">
                                <span>{formatCurrency(spent)}</span>
                                <span>{Math.floor(percentage)}%</span>
                              </div>
                              <Progress 
                                value={percentage > 100 ? 100 : percentage} 
                                className="h-2.5 bg-neutral-200"
                                indicatorClassName={getBudgetProgressClass(percentage)}
                              />
                            </div>
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreVertical className="h-4 w-4" />
                                  <span className="sr-only">Open menu</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleEditBudget(budget)}>
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={() => handleDeleteBudget(budget.id)}
                                  className="text-destructive focus:text-destructive"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        No budgets found. Create a new budget to get started.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Edit Budget Dialog */}
      <Dialog 
        open={editingBudget !== null} 
        onOpenChange={(open) => !open && setEditingBudget(null)}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Budget</DialogTitle>
          </DialogHeader>
          {editingBudget && (
            <BudgetForm 
              onSuccess={() => setEditingBudget(null)} 
              defaultValues={{
                categoryId: editingBudget.categoryId,
                amount: editingBudget.amount.toString(),
                period: editingBudget.period as "monthly" | "quarterly" | "yearly",
                startDate: new Date(editingBudget.startDate),
                endDate: editingBudget.endDate ? new Date(editingBudget.endDate) : undefined,
              }}
              budgetId={editingBudget.id}
            />
          )}
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Budget</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this budget? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
