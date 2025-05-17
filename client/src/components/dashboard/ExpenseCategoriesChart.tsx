import { useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Chart, registerables } from "chart.js";
import { formatCurrency } from "@/lib/utils";

// Register Chart.js components
Chart.register(...registerables);

interface CategoryExpense {
  id: number;
  name: string;
  color: string;
  icon: string;
  amount: string;
}

interface ExpenseCategoriesChartProps {
  showLegend?: boolean;
  height?: number;
}

export default function ExpenseCategoriesChart({ showLegend = false, height = 250 }: ExpenseCategoriesChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);
  
  const { data, isLoading } = useQuery<CategoryExpense[]>({
    queryKey: ["/api/analytics/expenses-by-category"],
  });
  
  useEffect(() => {
    if (isLoading || !data || !chartRef.current) return;
    
    // Destroy previous chart if it exists
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }
    
    const ctx = chartRef.current.getContext("2d");
    if (!ctx) return;
    
    chartInstance.current = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: data.map(d => d.name),
        datasets: [{
          data: data.map(d => Number(d.amount)),
          backgroundColor: data.map(d => d.color),
          borderColor: "#ffffff",
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "70%",
        plugins: {
          legend: {
            display: showLegend,
            position: "right"
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const label = context.label || "";
                const value = context.raw as number;
                const total = context.dataset.data.reduce((acc, data) => acc + (data as number), 0);
                const percentage = ((value / total) * 100).toFixed(1);
                return `${label}: ${formatCurrency(value)} (${percentage}%)`;
              }
            }
          }
        },
      }
    });
    
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data, isLoading, showLegend]);
  
  const containerStyle = {
    height: `${height}px`,
  };

  return (
    <Card className="border border-neutral-200">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-semibold text-neutral-800">Expense Categories</CardTitle>
        <Button variant="link" size="sm" asChild>
          <a href="/reports" className="text-primary text-sm font-medium">View All</a>
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="chart-container flex items-center justify-center" style={containerStyle}>
            <Skeleton className="h-[200px] w-[200px] rounded-full" />
          </div>
        ) : (
          <>
            <div className="chart-container mb-4" style={containerStyle}>
              <canvas ref={chartRef} />
            </div>
            
            {!showLegend && data && (
              <div className="space-y-3 mt-2">
                {data.map((category, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="h-3 w-3 rounded-full mr-2" style={{ backgroundColor: category.color }}></span>
                      <span className="text-sm text-neutral-600">{category.name}</span>
                    </div>
                    <div className="text-sm font-medium">{formatCurrency(category.amount)}</div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
