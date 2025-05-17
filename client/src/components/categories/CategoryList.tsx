import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  Edit, 
  Trash2, 
  MoreVertical,
  Home,
  Utensils,
  Car,
  Film,
  ShoppingCart,
  Zap,
  Tag,
  Wallet,
  PiggyBank,
  Gift,
  CreditCard,
  Globe,
  Heart,
  Book,
  Briefcase,
  AlertTriangle
} from "lucide-react";
import CategoryForm from "./CategoryForm";

interface CategoryListProps {
  categories?: any[];
  isLoading: boolean;
}

export default function CategoryList({ categories: propCategories, isLoading }: CategoryListProps) {
  const { toast } = useToast();
  const [editingCategory, setEditingCategory] = useState<any | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingCategoryId, setDeletingCategoryId] = useState<number | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  
  // Only fetch categories if not provided through props
  const { data: fetchedCategories, isLoading: fetchLoading } = useQuery({
    queryKey: ["/api/categories"],
    enabled: !propCategories
  });
  
  // Determine whether to use prop categories or fetched categories
  const allCategories = propCategories || fetchedCategories || [];
  const loading = isLoading || fetchLoading;
  
  // Get icon component by name
  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case "home": return <Home size={20} />;
      case "utensils": return <Utensils size={20} />;
      case "car": return <Car size={20} />;
      case "film": return <Film size={20} />;
      case "shopping-cart": return <ShoppingCart size={20} />;
      case "bolt": return <Zap size={20} />;
      case "tag": return <Tag size={20} />;
      case "wallet": return <Wallet size={20} />;
      case "piggy-bank": return <PiggyBank size={20} />;
      case "gift": return <Gift size={20} />;
      case "credit-card": return <CreditCard size={20} />;
      case "globe": return <Globe size={20} />;
      case "heart": return <Heart size={20} />;
      case "book": return <Book size={20} />;
      case "briefcase": return <Briefcase size={20} />;
      default: return <Tag size={20} />;
    }
  };
  
  // Delete category mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      setDeleteError(null);
      const res = await apiRequest('DELETE', `/api/categories/${id}`);
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to delete category");
      }
      
      return res;
    },
    onSuccess: () => {
      toast({
        title: "Category deleted",
        description: "Your category has been deleted successfully",
      });
      
      // Close delete dialog
      setDeleteDialogOpen(false);
      setDeletingCategoryId(null);
      
      // Invalidate queries to refetch data
      queryClient.invalidateQueries({ queryKey: ['/api/categories'] });
    },
    onError: (error: any) => {
      setDeleteError(error.message || "This category is in use and cannot be deleted");
    },
  });
  
  // Handle category edit
  const handleEditCategory = (category: any) => {
    setEditingCategory(category);
  };
  
  // Handle category delete
  const handleDeleteCategory = (id: number, isDefault: number) => {
    if (isDefault === 1) {
      toast({
        title: "Cannot delete default category",
        description: "Default categories cannot be deleted",
        variant: "destructive",
      });
      return;
    }
    
    setDeletingCategoryId(id);
    setDeleteDialogOpen(true);
    setDeleteError(null);
  };
  
  // Handle confirm delete
  const confirmDelete = () => {
    if (deletingCategoryId) {
      deleteMutation.mutate(deletingCategoryId);
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Categories</CardTitle>
          <CardDescription>Manage transaction categories to better organize your finances</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-24 w-full rounded-md" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {allCategories.map((category) => (
                <div 
                  key={category.id} 
                  className="flex items-center justify-between p-4 rounded-lg border"
                  style={{ 
                    borderColor: category.color,
                    backgroundColor: `${category.color}10`
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center" 
                      style={{ backgroundColor: `${category.color}30`, color: category.color }}
                    >
                      {getIconComponent(category.icon)}
                    </div>
                    <div>
                      <h3 className="font-medium">{category.name}</h3>
                      {category.isDefault === 1 && (
                        <span className="text-xs text-muted-foreground">Default</span>
                      )}
                    </div>
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEditCategory(category)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleDeleteCategory(category.id, category.isDefault)}
                        className="text-destructive focus:text-destructive"
                        disabled={category.isDefault === 1}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))}
            </div>
          )}
          
          {!loading && allCategories.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No custom categories found. Create a new category to get started.
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Edit Category Dialog */}
      <Dialog 
        open={editingCategory !== null} 
        onOpenChange={(open) => !open && setEditingCategory(null)}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
          </DialogHeader>
          {editingCategory && (
            <CategoryForm 
              onSuccess={() => setEditingCategory(null)} 
              defaultValues={{
                name: editingCategory.name,
                icon: editingCategory.icon,
                color: editingCategory.color,
                isDefault: editingCategory.isDefault,
              }}
              categoryId={editingCategory.id}
            />
          )}
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Category</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this category? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          {deleteError && (
            <div className="bg-destructive/10 p-3 rounded-md flex items-center gap-2 text-sm">
              <AlertTriangle className="h-4 w-4 text-destructive" />
              <p className="text-destructive">{deleteError}</p>
            </div>
          )}
          
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
