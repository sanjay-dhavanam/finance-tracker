import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import CategoryList from "@/components/categories/CategoryList";
import CategoryForm from "@/components/categories/CategoryForm";

export default function Categories() {
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  
  const { data: categories, isLoading } = useQuery({
    queryKey: ["/api/categories"],
  });

  return (
    <>
      <Helmet>
        <title>Categories | Finance Manager</title>
        <meta name="description" content="Manage transaction categories to better organize your financial data" />
      </Helmet>
      
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-neutral-800">Categories</h1>
          <p className="text-neutral-500 mt-1">Organize your transactions by category</p>
        </div>
        
        <Button onClick={() => setCategoryModalOpen(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" /> Add Category
        </Button>
      </div>
      
      <CategoryList 
        categories={categories} 
        isLoading={isLoading} 
      />
      
      <Dialog open={categoryModalOpen} onOpenChange={setCategoryModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Category</DialogTitle>
          </DialogHeader>
          <CategoryForm onSuccess={() => setCategoryModalOpen(false)} />
        </DialogContent>
      </Dialog>
    </>
  );
}
