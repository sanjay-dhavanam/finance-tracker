import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format currency
export function formatCurrency(value: number | string, currency: string = "INR"): string {
  const numValue = typeof value === "string" ? parseFloat(value) : value;
  
  // Use Indian locale and format for INR by default
  const locale = currency === "INR" ? "en-IN" : "en-US";
  
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
  }).format(numValue);
}

// Format date
export function formatDate(date: Date | string): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(dateObj);
}

// Format percentage
export function formatPercentage(value: number | string): string {
  const numValue = typeof value === "string" ? parseFloat(value) : value;
  
  return `${numValue.toFixed(1)}%`;
}

// Get icon color class based on transaction type
export function getTransactionTypeClass(type: string): string {
  return type === "income" 
    ? "bg-success bg-opacity-10 text-success" 
    : "bg-danger bg-opacity-10 text-danger";
}

// Get color class for budget progress
export function getBudgetProgressClass(percentage: number): string {
  if (percentage >= 100) {
    return "bg-destructive";
  } else if (percentage >= 80) {
    return "bg-warning";
  } else {
    return "bg-success";
  }
}

// Generate chart colors
export function generateChartColors(count: number): string[] {
  const baseColors = [
    "hsl(var(--chart-1))",
    "hsl(var(--chart-2))",
    "hsl(var(--chart-3))",
    "hsl(var(--chart-4))",
    "hsl(var(--chart-5))",
  ];
  
  // If we need more colors than we have in our base array, repeat them with different opacities
  if (count <= baseColors.length) {
    return baseColors.slice(0, count);
  }
  
  const colors = [...baseColors];
  
  while (colors.length < count) {
    const index = colors.length % baseColors.length;
    const opacity = 0.7 - (Math.floor(colors.length / baseColors.length) * 0.1);
    colors.push(`${baseColors[index]}${Math.floor(opacity * 100)}%`);
  }
  
  return colors;
}

// Generate a random color
export function generateRandomColor(): string {
  const hue = Math.floor(Math.random() * 360);
  const saturation = 70 + Math.floor(Math.random() * 20); // 70-90%
  const lightness = 45 + Math.floor(Math.random() * 10); // 45-55%
  
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}
