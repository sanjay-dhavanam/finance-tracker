import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import FinancialSummary from "@/components/dashboard/FinancialSummary";
import MonthlySpendingChart from "@/components/dashboard/MonthlySpendingChart";
import ExpenseCategoriesChart from "@/components/dashboard/ExpenseCategoriesChart";
import RecentTransactions from "@/components/dashboard/RecentTransactions";
import BudgetProgress from "@/components/dashboard/BudgetProgress";

export default function Dashboard() {
  const { data: financialSummary, isLoading: summaryLoading } = useQuery({
    queryKey: ["/api/analytics/summary"],
  });

  return (
    <>
      <Helmet>
        <title>Dashboard | Finance Manager</title>
        <meta name="description" content="View your financial overview, track expenses, and monitor your budget progress" />
      </Helmet>
      
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-neutral-800">Financial Dashboard</h1>
        <p className="text-neutral-500 mt-1">Track, analyze, and manage your finances in one place</p>
      </div>
      
      {/* Financial Summary */}
      <FinancialSummary 
        data={financialSummary}
        isLoading={summaryLoading}
      />
      
      {/* Expense Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Monthly Spending Chart */}
        <div className="lg:col-span-2">
          <MonthlySpendingChart />
        </div>
        
        {/* Expense Categories Chart */}
        <div>
          <ExpenseCategoriesChart />
        </div>
      </div>
      
      {/* Recent Transactions & Budget Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Transactions */}
        <div className="lg:col-span-2">
          <RecentTransactions />
        </div>
        
        {/* Budget Progress */}
        <div>
          <BudgetProgress />
        </div>
      </div>
    </>
  );
}
