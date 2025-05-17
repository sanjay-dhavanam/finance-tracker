import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Bell, Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import TransactionForm from "@/components/transactions/TransactionForm";

export default function Header() {
  const [transactionModalOpen, setTransactionModalOpen] = useState(false);

  return (
    <>
      <header className="bg-white border-b border-neutral-200 shadow-sm">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex-1 px-2 flex justify-center sm:justify-start">
              <div className="max-w-lg w-full">
                <div className="relative text-neutral-400 focus-within:text-neutral-600">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5" />
                  </div>
                  <Input 
                    className="pl-10"
                    placeholder="Search transactions, budgets..." 
                    type="search"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex items-center">
              <Button 
                variant="ghost" 
                size="icon" 
                className="p-1 rounded-full text-neutral-500 hover:text-neutral-700"
              >
                <span className="sr-only">View notifications</span>
                <Bell className="h-6 w-6" />
              </Button>
              
              <Button 
                variant="ghost" 
                size="icon" 
                className="ml-3 p-1 rounded-full text-neutral-500 hover:text-neutral-700"
                onClick={() => setTransactionModalOpen(true)}
              >
                <span className="sr-only">Add transaction</span>
                <Plus className="h-6 w-6" />
              </Button>
            </div>
          </div>
        </div>
      </header>

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
