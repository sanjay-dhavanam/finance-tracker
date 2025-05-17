import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { insertBudgetSchema } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface BudgetFormProps {
  onSuccess?: () => void;
  defaultValues?: z.infer<typeof formSchema>;
  budgetId?: number;
}

// Extend the budget schema with validation rules
const formSchema = insertBudgetSchema.extend({
  categoryId: z.union([z.string(), z.number()]).transform(val => typeof val === "string" ? parseInt(val) : val),
  amount: z.string().refine(val => !isNaN(Number(val)) && Number(val) > 0, "Amount must be a positive number"),
  period: z.enum(["monthly", "quarterly", "yearly"]),
  startDate: z.union([z.string(), z.date()]).transform(val => val instanceof Date ? val : new Date(val)),
  endDate: z.union([z.string(), z.date(), z.null()]).optional().transform(val => {
    if (!val) return undefined;
    return val instanceof Date ? val : new Date(val);
  }),
});

export default function BudgetForm({ onSuccess, defaultValues, budgetId }: BudgetFormProps) {
  const { toast } = useToast();
  const isEditing = !!budgetId;
  
  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ["/api/categories"],
  });
  
  // Initialize form with default values
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues || {
      categoryId: 1,
      amount: "",
      period: "monthly",
      startDate: new Date(),
      endDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
    },
  });
  
  // Create budget mutation
  const createMutation = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      // Use the data directly to fix date format issues
      const formattedValues = {
        ...values,
        categoryId: typeof values.categoryId === 'string' ? parseInt(values.categoryId) : values.categoryId,
        startDate: values.startDate instanceof Date ? values.startDate.toISOString() : new Date(values.startDate).toISOString(),
        endDate: values.endDate instanceof Date ? values.endDate.toISOString() : new Date(values.endDate).toISOString()
      };
      const res = await apiRequest('POST', '/api/budgets', formattedValues);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Budget created",
        description: "Your budget has been created successfully",
      });
      
      // Reset form
      form.reset();
      
      // Invalidate queries to refetch data
      queryClient.invalidateQueries({ queryKey: ['/api/budgets'] });
      queryClient.invalidateQueries({ queryKey: ['/api/analytics/budget-progress'] });
      
      // Call onSuccess callback
      if (onSuccess) onSuccess();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create budget. Please try again.",
        variant: "destructive",
      });
    },
  });
  
  // Update budget mutation
  const updateMutation = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      // Use dates directly to prevent format issues
      const formattedValues = {
        ...values,
        categoryId: typeof values.categoryId === 'string' ? parseInt(values.categoryId) : values.categoryId
      };
      const res = await apiRequest('PUT', `/api/budgets/${budgetId}`, formattedValues);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Budget updated",
        description: "Your budget has been updated successfully",
      });
      
      // Invalidate queries to refetch data
      queryClient.invalidateQueries({ queryKey: ['/api/budgets'] });
      queryClient.invalidateQueries({ queryKey: ['/api/analytics/budget-progress'] });
      
      // Call onSuccess callback
      if (onSuccess) onSuccess();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update budget. Please try again.",
        variant: "destructive",
      });
    },
  });
  
  // Form submission handler
  function onSubmit(values: z.infer<typeof formSchema>) {
    if (isEditing) {
      updateMutation.mutate(values);
    } else {
      createMutation.mutate(values);
    }
  }
  
  // Filter out categories that already have budgets
  const { data: existingBudgets } = useQuery({
    queryKey: ["/api/budgets"],
  });
  
  const getAvailableCategories = () => {
    if (!categories || !existingBudgets) return categories;
    
    // For editing, we want to show the current category plus available ones
    if (isEditing) {
      return categories.filter(category => 
        category.id === form.getValues().categoryId || 
        !existingBudgets.some(budget => budget.categoryId === category.id)
      );
    }
    
    // For new budgets, filter out categories that already have budgets
    return categories.filter(category => 
      !existingBudgets.some(budget => budget.categoryId === category.id)
    );
  };

  const availableCategories = getAvailableCategories();

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="categoryId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={
                  field.value !== undefined && field.value !== "" 
                    ? field.value.toString() 
                    : undefined
                }
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categoriesLoading ? (
                    <SelectItem value="loading" disabled>Loading categories...</SelectItem>
                  ) : availableCategories && availableCategories.length > 0 ? (
                    availableCategories.map((category) => (
                      <SelectItem 
                        key={category.id} 
                        value={category.id.toString()}
                      >
                        {category.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="none" disabled>No available categories</SelectItem>
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Budget Amount</FormLabel>
              <FormControl>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-neutral-500 sm:text-sm">₹</span>
                  </div>
                  <Input className="pl-7" placeholder="0.00" {...field} />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="period"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Period</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a period" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start Date</FormLabel>
                <FormControl>
                  <Input 
                    type="date" 
                    value={field.value instanceof Date 
                      ? field.value.toISOString().slice(0, 10)
                      : field.value
                    }
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>End Date</FormLabel>
                <FormControl>
                  <Input 
                    type="date" 
                    value={field.value instanceof Date 
                      ? field.value.toISOString().slice(0, 10)
                      : field.value || ""
                    }
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="flex justify-end gap-4 pt-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onSuccess}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={createMutation.isPending || updateMutation.isPending}
          >
            {createMutation.isPending || updateMutation.isPending 
              ? 'Saving...' 
              : isEditing ? 'Update' : 'Save'
            }
          </Button>
        </div>
      </form>
    </Form>
  );
}
