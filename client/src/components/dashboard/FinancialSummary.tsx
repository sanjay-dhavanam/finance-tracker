import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { ArrowUp, ArrowDown, Scale, PiggyBank, TrendingUp } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface FinancialSummaryData {
  balance: string;
  income: string;
  expenses: string;
  savings: string;
}

interface FinancialSummaryProps {
  data?: FinancialSummaryData;
  isLoading: boolean;
}

export default function FinancialSummary({ data, isLoading }: FinancialSummaryProps) {
  const summaryItems = [
    {
      title: "Balance",
      value: data?.balance || "0.00",
      icon: <Scale className="h-5 w-5 text-primary" />,
      iconBg: "bg-primary-light bg-opacity-10",
      trend: "+2.5%",
      trendColor: "text-success"
    },
    {
      title: "Income",
      value: data?.income || "0.00",
      icon: <ArrowUp className="h-5 w-5 text-success" />,
      iconBg: "bg-success bg-opacity-10",
      trend: "+4.2%",
      trendColor: "text-success"
    },
    {
      title: "Expenses",
      value: data?.expenses || "0.00",
      icon: <ArrowDown className="h-5 w-5 text-danger" />,
      iconBg: "bg-danger bg-opacity-10",
      trend: "-1.8%",
      trendColor: "text-danger"
    },
    {
      title: "Savings",
      value: data?.savings || "0.00",
      icon: <PiggyBank className="h-5 w-5 text-warning" />,
      iconBg: "bg-warning bg-opacity-10",
      trend: "+3.6%",
      trendColor: "text-success"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {summaryItems.map((item, index) => (
        <Card key={index} className="border border-neutral-200">
          <CardContent className="p-5">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-neutral-500">{item.title}</p>
                {isLoading ? (
                  <Skeleton className="h-8 w-24 mt-1" />
                ) : (
                  <h3 className="text-2xl font-bold text-neutral-800 mt-1">
                    {formatCurrency(item.value)}
                  </h3>
                )}
              </div>
              <span className={`rounded-full ${item.iconBg} p-2`}>
                {item.icon}
              </span>
            </div>
            <div className="mt-4 flex items-center">
              <span className={`flex items-center text-sm ${item.trendColor}`}>
                <TrendingUp className="h-4 w-4 mr-1" />
                {item.trend}
              </span>
              <span className="text-xs text-neutral-500 ml-2">from last month</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
