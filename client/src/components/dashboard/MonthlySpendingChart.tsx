import { useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Chart, registerables } from "chart.js";
import { formatCurrency } from "@/lib/utils";

// Register Chart.js components
Chart.register(...registerables);

interface MonthlyData {
  label: string;
  income: string;
  expenses: string;
}

export default function MonthlySpendingChart() {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);
  
  const { data, isLoading } = useQuery<MonthlyData[]>({
    queryKey: ["/api/analytics/monthly-spending"],
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
      type: "bar",
      data: {
        labels: data.map(d => d.label),
        datasets: [
          {
            label: "Income",
            backgroundColor: "#34a853",
            data: data.map(d => Number(d.income))
          },
          {
            label: "Expenses",
            backgroundColor: "#ea4335",
            data: data.map(d => Number(d.expenses))
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "top",
          },
          tooltip: {
            mode: "index",
            intersect: false,
            callbacks: {
              label: function(context) {
                const label = context.dataset.label || "";
                const value = context.raw as number;
                return `${label}: ${formatCurrency(value)}`;
              }
            }
          }
        },
        scales: {
          x: {
            grid: {
              display: false,
            },
          },
          y: {
            beginAtZero: true,
            grid: {
              borderDash: [2, 4],
            },
            ticks: {
              callback: function(value) {
                return formatCurrency(value as number, "USD").replace('.00', '');
              }
            }
          }
        }
      }
    });
    
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data, isLoading]);

  return (
    <Card className="border border-neutral-200">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-semibold text-neutral-800">Monthly Spending</CardTitle>
        <div className="flex space-x-2">
          <Button size="sm" variant="default" className="px-3 py-1 text-xs font-medium bg-primary bg-opacity-10 text-primary">Monthly</Button>
          <Button size="sm" variant="ghost" className="px-3 py-1 text-xs font-medium text-neutral-600 hover:bg-neutral-100">Quarterly</Button>
          <Button size="sm" variant="ghost" className="px-3 py-1 text-xs font-medium text-neutral-600 hover:bg-neutral-100">Yearly</Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="chart-container flex items-center justify-center">
            <Skeleton className="h-[250px] w-full" />
          </div>
        ) : (
          <div className="chart-container">
            <canvas ref={chartRef} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
