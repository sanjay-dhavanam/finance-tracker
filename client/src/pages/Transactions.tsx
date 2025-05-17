import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import TransactionList from "@/components/transactions/TransactionList";
import TransactionForm from "@/components/transactions/TransactionForm";

export default function Transactions() {
  const [transactionModalOpen, setTransactionModalOpen] = useState(false);
  
  const { data: transactions, isLoading } = useQuery({
    queryKey: ["/api/transactions"],
  });

  return (
    <>
      <Helmet>
        <title>Transactions | Finance Manager</title>
        <meta name="description" content="Manage your financial transactions, add new expenses and income entries" />
      </Helmet>
      
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-neutral-800">Transactions</h1>
          <p className="text-neutral-500 mt-1">Manage your income and expenses</p>
        </div>
        
        <Button onClick={() => setTransactionModalOpen(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" /> Add Transaction
        </Button>
      </div>
      
      <TransactionList 
        transactions={transactions} 
        isLoading={isLoading} 
      />
      
      <Dialog open={transactionModalOpen} onOpenChange={setTransactionModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Transaction</DialogTitle>
          </DialogHeader>
          <TransactionForm onSuccess={() => setTransactionModalOpen(false)} />
        </DialogContent>
      </Dialog>
    </>
  );
}
