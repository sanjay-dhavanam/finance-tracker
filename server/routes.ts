import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertTransactionSchema, 
  insertBudgetSchema, 
  insertCategorySchema,
  insertUserSchema
} from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // Error handling middleware for Zod validation errors
  const validateRequest = (schema: any) => (req: Request, res: Response, next: Function) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        res.status(400).json({ message: validationError.message });
      } else {
        res.status(400).json({ message: "Invalid request data" });
      }
    }
  };

  // User routes
  app.post("/api/users", validateRequest(insertUserSchema), async (req, res) => {
    try {
      const existingUser = await storage.getUserByUsername(req.body.username);
      if (existingUser) {
        return res.status(409).json({ message: "Username already exists" });
      }
      
      const user = await storage.createUser(req.body);
      res.status(201).json(user);
    } catch (error) {
      res.status(500).json({ message: "Error creating user" });
    }
  });

  // Transaction routes
  app.get("/api/transactions", async (req, res) => {
    try {
      const transactions = await storage.getTransactions();
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ message: "Error fetching transactions" });
    }
  });

  app.get("/api/transactions/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const transaction = await storage.getTransactionById(id);
      
      if (!transaction) {
        return res.status(404).json({ message: "Transaction not found" });
      }
      
      res.json(transaction);
    } catch (error) {
      res.status(500).json({ message: "Error fetching transaction" });
    }
  });

  app.post("/api/transactions", validateRequest(insertTransactionSchema), async (req, res) => {
    try {
      const transaction = await storage.createTransaction(req.body);
      res.status(201).json(transaction);
    } catch (error) {
      res.status(500).json({ message: "Error creating transaction" });
    }
  });

  app.put("/api/transactions/:id", validateRequest(insertTransactionSchema.partial()), async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const transaction = await storage.updateTransaction(id, req.body);
      
      if (!transaction) {
        return res.status(404).json({ message: "Transaction not found" });
      }
      
      res.json(transaction);
    } catch (error) {
      res.status(500).json({ message: "Error updating transaction" });
    }
  });

  app.delete("/api/transactions/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteTransaction(id);
      
      if (!success) {
        return res.status(404).json({ message: "Transaction not found" });
      }
      
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Error deleting transaction" });
    }
  });

  // Budget routes
  app.get("/api/budgets", async (req, res) => {
    try {
      const budgets = await storage.getBudgets();
      res.json(budgets);
    } catch (error) {
      res.status(500).json({ message: "Error fetching budgets" });
    }
  });

  app.get("/api/budgets/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const budget = await storage.getBudgetById(id);
      
      if (!budget) {
        return res.status(404).json({ message: "Budget not found" });
      }
      
      res.json(budget);
    } catch (error) {
      res.status(500).json({ message: "Error fetching budget" });
    }
  });

  app.post("/api/budgets", validateRequest(insertBudgetSchema), async (req, res) => {
    try {
      // Check if a budget already exists for this category
      const existingBudget = await storage.getBudgetByCategory(req.body.categoryId);
      
      if (existingBudget) {
        return res.status(409).json({ message: "A budget already exists for this category" });
      }
      
      const budget = await storage.createBudget(req.body);
      res.status(201).json(budget);
    } catch (error) {
      res.status(500).json({ message: "Error creating budget" });
    }
  });

  app.put("/api/budgets/:id", validateRequest(insertBudgetSchema.partial()), async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const budget = await storage.updateBudget(id, req.body);
      
      if (!budget) {
        return res.status(404).json({ message: "Budget not found" });
      }
      
      res.json(budget);
    } catch (error) {
      res.status(500).json({ message: "Error updating budget" });
    }
  });

  app.delete("/api/budgets/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteBudget(id);
      
      if (!success) {
        return res.status(404).json({ message: "Budget not found" });
      }
      
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Error deleting budget" });
    }
  });

  // Category routes
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Error fetching categories" });
    }
  });

  app.get("/api/categories/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const category = await storage.getCategoryById(id);
      
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      
      res.json(category);
    } catch (error) {
      res.status(500).json({ message: "Error fetching category" });
    }
  });

  app.post("/api/categories", validateRequest(insertCategorySchema), async (req, res) => {
    try {
      const category = await storage.createCategory(req.body);
      res.status(201).json(category);
    } catch (error) {
      res.status(500).json({ message: "Error creating category" });
    }
  });

  app.put("/api/categories/:id", validateRequest(insertCategorySchema.partial()), async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const category = await storage.updateCategory(id, req.body);
      
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      
      res.json(category);
    } catch (error) {
      res.status(500).json({ message: "Error updating category" });
    }
  });

  app.delete("/api/categories/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      // Check if the category is a default category
      const category = await storage.getCategoryById(id);
      if (category && category.isDefault === 1) {
        return res.status(403).json({ message: "Default categories cannot be deleted" });
      }
      
      const success = await storage.deleteCategory(id);
      
      if (!success) {
        return res.status(400).json({ message: "Category is in use or doesn't exist" });
      }
      
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Error deleting category" });
    }
  });

  // Analytics routes
  app.get("/api/analytics/summary", async (req, res) => {
    try {
      const transactions = await storage.getTransactions();
      
      // Calculate total income
      const income = transactions
        .filter(t => t.type === "income")
        .reduce((sum, t) => sum + Number(t.amount), 0);
      
      // Calculate total expenses
      const expenses = transactions
        .filter(t => t.type === "expense")
        .reduce((sum, t) => sum + Number(t.amount), 0);
      
      // Calculate balance
      const balance = income - expenses;
      
      // Calculate savings (assuming savings is a category with id 7)
      const savings = transactions
        .filter(t => t.categoryId === 7 && t.type === "expense")
        .reduce((sum, t) => sum + Number(t.amount), 0);
      
      res.json({
        balance: balance.toFixed(2),
        income: income.toFixed(2),
        expenses: expenses.toFixed(2),
        savings: savings.toFixed(2)
      });
    } catch (error) {
      res.status(500).json({ message: "Error generating summary" });
    }
  });

  app.get("/api/analytics/expenses-by-category", async (req, res) => {
    try {
      const transactions = await storage.getTransactions();
      const categories = await storage.getCategories();
      
      // Get expenses by category
      const expensesByCategory = categories.map(category => {
        const categoryExpenses = transactions
          .filter(t => t.categoryId === category.id && t.type === "expense")
          .reduce((sum, t) => sum + Number(t.amount), 0);
        
        return {
          id: category.id,
          name: category.name,
          color: category.color,
          icon: category.icon,
          amount: categoryExpenses.toFixed(2)
        };
      });
      
      // Filter out categories with no expenses
      const filteredExpenses = expensesByCategory.filter(c => Number(c.amount) > 0);
      
      res.json(filteredExpenses);
    } catch (error) {
      res.status(500).json({ message: "Error generating expenses by category" });
    }
  });

  app.get("/api/analytics/budget-progress", async (req, res) => {
    try {
      const transactions = await storage.getTransactions();
      const budgets = await storage.getBudgets();
      const categories = await storage.getCategories();
      
      const budgetProgress = budgets.map(budget => {
        const category = categories.find(c => c.id === budget.categoryId);
        const spent = transactions
          .filter(t => t.categoryId === budget.categoryId && t.type === "expense")
          .reduce((sum, t) => sum + Number(t.amount), 0);
        
        const percentage = (spent / Number(budget.amount)) * 100;
        
        return {
          id: budget.id,
          categoryId: budget.categoryId,
          categoryName: category ? category.name : "Unknown",
          categoryIcon: category ? category.icon : "question-mark",
          categoryColor: category ? category.color : "#9aa0a6",
          budgetAmount: Number(budget.amount).toFixed(2),
          spent: spent.toFixed(2),
          percentage: percentage.toFixed(1)
        };
      });
      
      res.json(budgetProgress);
    } catch (error) {
      res.status(500).json({ message: "Error generating budget progress" });
    }
  });

  app.get("/api/analytics/monthly-spending", async (req, res) => {
    try {
      const transactions = await storage.getTransactions();
      
      // Get the last 6 months
      const months = [];
      const currentDate = new Date();
      
      for (let i = 5; i >= 0; i--) {
        const date = new Date();
        date.setMonth(currentDate.getMonth() - i);
        
        const month = date.toLocaleString('default', { month: 'short' });
        const year = date.getFullYear();
        
        months.push({
          label: month,
          year: year,
          month: date.getMonth()
        });
      }
      
      // Calculate income and expenses for each month
      const monthlyData = months.map(monthData => {
        const monthTransactions = transactions.filter(t => {
          const transactionDate = new Date(t.date);
          return transactionDate.getMonth() === monthData.month && 
                 transactionDate.getFullYear() === monthData.year;
        });
        
        const monthIncome = monthTransactions
          .filter(t => t.type === "income")
          .reduce((sum, t) => sum + Number(t.amount), 0);
          
        const monthExpenses = monthTransactions
          .filter(t => t.type === "expense")
          .reduce((sum, t) => sum + Number(t.amount), 0);
          
        return {
          label: monthData.label,
          income: monthIncome.toFixed(2),
          expenses: monthExpenses.toFixed(2)
        };
      });
      
      res.json(monthlyData);
    } catch (error) {
      res.status(500).json({ message: "Error generating monthly spending" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
