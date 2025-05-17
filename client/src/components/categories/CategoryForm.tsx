import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { insertCategorySchema } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { generateRandomColor } from "@/lib/utils";
import { 
  Home, 
  Utensils, 
  Car, 
  Film, 
  ShoppingCart, 
  Zap, 
  Tag, 
  Wallet, 
  PiggyBank, 
  Gift, 
  CreditCard, 
  Globe, 
  Heart, 
  Book, 
  Briefcase 
} from "lucide-react";

interface CategoryFormProps {
  onSuccess?: () => void;
  defaultValues?: z.infer<typeof formSchema>;
  categoryId?: number;
}

// Available icons for categories
const availableIcons = [
  { name: "home", icon: <Home size={20} />, label: "Home" },
  { name: "utensils", icon: <Utensils size={20} />, label: "Food" },
  { name: "car", icon: <Car size={20} />, label: "Transport" },
  { name: "film", icon: <Film size={20} />, label: "Entertainment" },
  { name: "shopping-cart", icon: <ShoppingCart size={20} />, label: "Shopping" },
  { name: "bolt", icon: <Zap size={20} />, label: "Utilities" },
  { name: "tag", icon: <Tag size={20} />, label: "Other" },
  { name: "wallet", icon: <Wallet size={20} />, label: "Wallet" },
  { name: "piggy-bank", icon: <PiggyBank size={20} />, label: "Savings" },
  { name: "gift", icon: <Gift size={20} />, label: "Gifts" },
  { name: "credit-card", icon: <CreditCard size={20} />, label: "Credit" },
  { name: "globe", icon: <Globe size={20} />, label: "Travel" },
  { name: "heart", icon: <Heart size={20} />, label: "Health" },
  { name: "book", icon: <Book size={20} />, label: "Education" },
  { name: "briefcase", icon: <Briefcase size={20} />, label: "Work" },
];

// Extend the category schema with validation rules
const formSchema = insertCategorySchema.extend({
  name: z.string().min(2, "Name must be at least 2 characters").max(30, "Name must be at most 30 characters"),
  icon: z.string().min(1, "Please select an icon"),
  color: z.string().min(1, "Please select a color"),
  isDefault: z.number().optional(),
});

export default function CategoryForm({ onSuccess, defaultValues, categoryId }: CategoryFormProps) {
  const { toast } = useToast();
  const isEditing = !!categoryId;
  const [selectedColor, setSelectedColor] = useState(defaultValues?.color || generateRandomColor());
  
  // Initialize form with default values
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues || {
      name: "",
      icon: "tag",
      color: selectedColor,
      isDefault: 0,
    },
  });
  
  const randomizeColor = () => {
    const newColor = generateRandomColor();
    setSelectedColor(newColor);
    form.setValue("color", newColor);
  };
  
  // Create category mutation
  const createMutation = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      const res = await apiRequest('POST', '/api/categories', values);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Category created",
        description: "Your category has been created successfully",
      });
      
      // Reset form
      form.reset();
      
      // Invalidate queries to refetch data
      queryClient.invalidateQueries({ queryKey: ['/api/categories'] });
      
      // Call onSuccess callback
      if (onSuccess) onSuccess();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create category. Please try again.",
        variant: "destructive",
      });
    },
  });
  
  // Update category mutation
  const updateMutation = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      const res = await apiRequest('PUT', `/api/categories/${categoryId}`, values);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Category updated",
        description: "Your category has been updated successfully",
      });
      
      // Invalidate queries to refetch data
      queryClient.invalidateQueries({ queryKey: ['/api/categories'] });
      
      // Call onSuccess callback
      if (onSuccess) onSuccess();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update category. Please try again.",
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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Groceries, Rent, Entertainment" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="icon"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Icon</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="grid grid-cols-5 gap-2"
                >
                  {availableIcons.map((iconItem) => (
                    <FormItem key={iconItem.name} className="flex flex-col items-center space-y-2 space-x-0">
                      <FormControl>
                        <RadioGroupItem
                          value={iconItem.name}
                          id={`icon-${iconItem.name}`}
                          className="sr-only"
                        />
                      </FormControl>
                      <label
                        htmlFor={`icon-${iconItem.name}`}
                        className={`
                          flex flex-col items-center justify-center rounded-md border-2 border-muted p-2 w-full
                          hover:border-primary cursor-pointer
                          ${field.value === iconItem.name ? 'border-primary bg-primary/10' : ''}
                        `}
                      >
                        <div style={{ color: field.value === iconItem.name ? form.getValues().color : 'currentColor' }}>
                          {iconItem.icon}
                        </div>
                        <span className="text-xs mt-1">{iconItem.label}</span>
                      </label>
                    </FormItem>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="color"
          render={({ field }) => (
            <FormItem>
              <div className="flex justify-between items-center">
                <FormLabel>Color</FormLabel>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  onClick={randomizeColor}
                  className="text-xs h-7 px-2"
                >
                  Randomize
                </Button>
              </div>
              <FormControl>
                <div className="flex items-center gap-4">
                  <Input 
                    type="color" 
                    {...field} 
                    className="w-16 h-10 p-1 cursor-pointer"
                    onChange={(e) => {
                      field.onChange(e);
                      setSelectedColor(e.target.value);
                    }}
                  />
                  <div className="flex-1">
                    <div 
                      className="h-10 rounded-md border border-input w-full" 
                      style={{ backgroundColor: selectedColor }}
                    />
                  </div>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
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
