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
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency, formatDate } from "@/lib/utils";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Transaction } from "@shared/schema";
import { 
  DollarSign, 
  ShoppingCart, 
  MoreVertical, 
  Edit, 
  Trash2, 
  ChevronLeft, 
  ChevronRight,
  Search,
  Tag
} from "lucide-react";
import TransactionForm from "./TransactionForm";

interface TransactionListProps {
  transactions?: Transaction[];
  isLoading: boolean;
}

export default function TransactionList({ transactions: propTransactions, isLoading }: TransactionListProps) {
  const { toast } = useToast();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingTransactionId, setDeletingTransactionId] = useState<number | null>(null);
  
  const itemsPerPage = 10;
  
  // Only fetch transactions if not provided through props
  const { data: fetchedTransactions, isLoading: fetchLoading } = useQuery({
    queryKey: ["/api/transactions"],
    enabled: !propTransactions
  });
  
  const { data: categories } = useQuery({
    queryKey: ["/api/categories"],
  });
  
  // Determine whether to use prop transactions or fetched transactions
  const allTransactions = propTransactions || fetchedTransactions || [];
  const loading = isLoading || fetchLoading;
  
  // Filter transactions by search term
  const filteredTransactions = allTransactions.filter(transaction => 
    transaction.description.toLowerCase().includes(search.toLowerCase())
  );
  
  // Calculate pagination
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const paginatedTransactions = filteredTransactions.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );
  
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
  
  // Delete transaction mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest('DELETE', `/api/transactions/${id}`);
      return res;
    },
    onSuccess: () => {
      toast({
        title: "Transaction deleted",
        description: "Your transaction has been deleted successfully",
      });
      
      // Close delete dialog
      setDeleteDialogOpen(false);
      setDeletingTransactionId(null);
      
      // Invalidate queries to refetch data
      queryClient.invalidateQueries({ queryKey: ['/api/transactions'] });
      queryClient.invalidateQueries({ queryKey: ['/api/analytics/summary'] });
      queryClient.invalidateQueries({ queryKey: ['/api/analytics/expenses-by-category'] });
      queryClient.invalidateQueries({ queryKey: ['/api/analytics/budget-progress'] });
      queryClient.invalidateQueries({ queryKey: ['/api/analytics/monthly-spending'] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete transaction. Please try again.",
        variant: "destructive",
      });
    },
  });
  
  // Handle transaction edit
  const handleEditTransaction = (transaction: Transaction) => {
    setEditingTransaction(transaction);
  };
  
  // Handle transaction delete
  const handleDeleteTransaction = (id: number) => {
    setDeletingTransactionId(id);
    setDeleteDialogOpen(true);
  };
  
  // Handle confirm delete
  const confirmDelete = () => {
    if (deletingTransactionId) {
      deleteMutation.mutate(deletingTransactionId);
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle>All Transactions</CardTitle>
              <CardDescription>View and manage your income and expenses</CardDescription>
            </div>
            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search transactions..."
                className="pl-8 w-full sm:w-[250px]"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4 py-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-3 w-[200px]" />
                  </div>
                  <Skeleton className="h-8 w-24" />
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Description</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead className="w-[80px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedTransactions.length > 0 ? (
                    paginatedTransactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className={`h-8 w-8 rounded-full ${transaction.type === 'income' ? 'bg-success bg-opacity-10' : 'bg-primary-light bg-opacity-10'} flex items-center justify-center`}>
                              {transaction.type === 'income' ? 
                                <DollarSign className="h-4 w-4 text-success" /> :
                                <ShoppingCart className="h-4 w-4 text-primary" />
                              }
                            </div>
                            <div>
                              <div className="font-medium">{transaction.description}</div>
                              {transaction.notes && (
                                <div className="text-xs text-muted-foreground truncate max-w-[250px]">{transaction.notes}</div>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="px-2 py-1 text-xs rounded-full bg-opacity-10" style={{ 
                            backgroundColor: `${getCategoryColor(transaction.categoryId)}20`, 
                            color: getCategoryColor(transaction.categoryId) 
                          }}>
                            {getCategoryName(transaction.categoryId)}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatDate(transaction.date)}</TableCell>
                        <TableCell className={`text-right font-medium ${transaction.type === 'income' ? 'text-success' : 'text-danger'}`}>
                          {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
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
                              <DropdownMenuItem onClick={() => handleEditTransaction(transaction)}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleDeleteTransaction(transaction.id)}
                                className="text-destructive focus:text-destructive"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        {search
                          ? "No transactions matching your search criteria"
                          : "No transactions found. Add a new transaction to get started."}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
        
        {filteredTransactions.length > itemsPerPage && (
          <CardFooter className="flex items-center justify-between border-t p-4">
            <div className="text-sm text-muted-foreground">
              Showing <span className="font-medium">{Math.min((page - 1) * itemsPerPage + 1, filteredTransactions.length)}</span> to{" "}
              <span className="font-medium">{Math.min(page * itemsPerPage, filteredTransactions.length)}</span> of{" "}
              <span className="font-medium">{filteredTransactions.length}</span> transactions
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Previous page</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(page + 1)}
                disabled={page === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
                <span className="sr-only">Next page</span>
              </Button>
            </div>
          </CardFooter>
        )}
      </Card>
      
      {/* Edit Transaction Dialog */}
      <Dialog 
        open={editingTransaction !== null} 
        onOpenChange={(open) => !open && setEditingTransaction(null)}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Transaction</DialogTitle>
          </DialogHeader>
          {editingTransaction && (
            <TransactionForm 
              onSuccess={() => setEditingTransaction(null)} 
              defaultValues={{
                description: editingTransaction.description,
                amount: editingTransaction.amount.toString(),
                date: new Date(editingTransaction.date),
                categoryId: editingTransaction.categoryId,
                type: editingTransaction.type as "income" | "expense",
                notes: editingTransaction.notes || "",
              }}
              transactionId={editingTransaction.id}
            />
          )}
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Transaction</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this transaction? This action cannot be undone.
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
