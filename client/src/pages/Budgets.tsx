import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import BudgetList from "@/components/budgets/BudgetList";
import BudgetForm from "@/components/budgets/BudgetForm";

export default function Budgets() {
  const [budgetModalOpen, setBudgetModalOpen] = useState(false);
  
  const { data: budgets, isLoading } = useQuery({
    queryKey: ["/api/budgets"],
  });

  return (
    <>
      <Helmet>
        <title>Budgets | Finance Manager</title>
        <meta name="description" content="Set and manage your budget limits by category, track spending against your budget targets" />
      </Helmet>
      
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-neutral-800">Budgets</h1>
          <p className="text-neutral-500 mt-1">Set spending limits for each category</p>
        </div>
        
        <Button onClick={() => setBudgetModalOpen(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" /> Add Budget
        </Button>
      </div>
      
      <BudgetList 
        budgets={budgets} 
        isLoading={isLoading} 
      />
      
      <Dialog open={budgetModalOpen} onOpenChange={setBudgetModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Budget</DialogTitle>
          </DialogHeader>
          <BudgetForm onSuccess={() => setBudgetModalOpen(false)} />
        </DialogContent>
      </Dialog>
    </>
  );
}
