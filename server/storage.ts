import { 
  users, type User, type InsertUser,
  transactions, type Transaction, type InsertTransaction,
  budgets, type Budget, type InsertBudget,
  categories, type Category, type InsertCategory 
} from "@shared/schema";

// Define storage interface
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Transaction operations
  getTransactions(): Promise<Transaction[]>;
  getTransactionById(id: number): Promise<Transaction | undefined>;
  getTransactionsByCategory(categoryId: number): Promise<Transaction[]>;
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  updateTransaction(id: number, transaction: Partial<InsertTransaction>): Promise<Transaction | undefined>;
  deleteTransaction(id: number): Promise<boolean>;
  
  // Budget operations
  getBudgets(): Promise<Budget[]>;
  getBudgetById(id: number): Promise<Budget | undefined>;
  getBudgetByCategory(categoryId: number): Promise<Budget | undefined>;
  createBudget(budget: InsertBudget): Promise<Budget>;
  updateBudget(id: number, budget: Partial<InsertBudget>): Promise<Budget | undefined>;
  deleteBudget(id: number): Promise<boolean>;
  
  // Category operations
  getCategories(): Promise<Category[]>;
  getCategoryById(id: number): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(id: number, category: Partial<InsertCategory>): Promise<Category | undefined>;
  deleteCategory(id: number): Promise<boolean>;
}

// In-memory storage implementation
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private transactions: Map<number, Transaction>;
  private budgets: Map<number, Budget>;
  private categories: Map<number, Category>;
  
  currentUserId: number;
  currentTransactionId: number;
  currentBudgetId: number;
  currentCategoryId: number;

  constructor() {
    this.users = new Map();
    this.transactions = new Map();
    this.budgets = new Map();
    this.categories = new Map();
    
    this.currentUserId = 1;
    this.currentTransactionId = 1;
    this.currentBudgetId = 1;
    this.currentCategoryId = 1;
    
    // Initialize with default categories
    this.initializeDefaultCategories();
    // Initialize with sample data
    this.initializeSampleData();
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Transaction operations
  async getTransactions(): Promise<Transaction[]> {
    return Array.from(this.transactions.values()).sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }

  async getTransactionById(id: number): Promise<Transaction | undefined> {
    return this.transactions.get(id);
  }

  async getTransactionsByCategory(categoryId: number): Promise<Transaction[]> {
    return Array.from(this.transactions.values())
      .filter(transaction => transaction.categoryId === categoryId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  async createTransaction(insertTransaction: InsertTransaction): Promise<Transaction> {
    const id = this.currentTransactionId++;
    const transaction: Transaction = { ...insertTransaction, id };
    this.transactions.set(id, transaction);
    return transaction;
  }

  async updateTransaction(id: number, updateData: Partial<InsertTransaction>): Promise<Transaction | undefined> {
    const transaction = this.transactions.get(id);
    if (!transaction) return undefined;
    
    const updatedTransaction = { ...transaction, ...updateData };
    this.transactions.set(id, updatedTransaction);
    return updatedTransaction;
  }

  async deleteTransaction(id: number): Promise<boolean> {
    return this.transactions.delete(id);
  }

  // Budget operations
  async getBudgets(): Promise<Budget[]> {
    return Array.from(this.budgets.values());
  }

  async getBudgetById(id: number): Promise<Budget | undefined> {
    return this.budgets.get(id);
  }

  async getBudgetByCategory(categoryId: number): Promise<Budget | undefined> {
    return Array.from(this.budgets.values()).find(
      budget => budget.categoryId === categoryId
    );
  }

  async createBudget(insertBudget: InsertBudget): Promise<Budget> {
    const id = this.currentBudgetId++;
    const budget: Budget = { ...insertBudget, id };
    this.budgets.set(id, budget);
    return budget;
  }

  async updateBudget(id: number, updateData: Partial<InsertBudget>): Promise<Budget | undefined> {
    const budget = this.budgets.get(id);
    if (!budget) return undefined;
    
    const updatedBudget = { ...budget, ...updateData };
    this.budgets.set(id, updatedBudget);
    return updatedBudget;
  }

  async deleteBudget(id: number): Promise<boolean> {
    return this.budgets.delete(id);
  }

  // Category operations
  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }

  async getCategoryById(id: number): Promise<Category | undefined> {
    return this.categories.get(id);
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const id = this.currentCategoryId++;
    const category: Category = { ...insertCategory, id };
    this.categories.set(id, category);
    return category;
  }

  async updateCategory(id: number, updateData: Partial<InsertCategory>): Promise<Category | undefined> {
    const category = this.categories.get(id);
    if (!category) return undefined;
    
    const updatedCategory = { ...category, ...updateData };
    this.categories.set(id, updatedCategory);
    return updatedCategory;
  }

  async deleteCategory(id: number): Promise<boolean> {
    // Check if category is in use by transactions or budgets
    const transactionsUsingCategory = Array.from(this.transactions.values())
      .some(transaction => transaction.categoryId === id);
      
    const budgetsUsingCategory = Array.from(this.budgets.values())
      .some(budget => budget.categoryId === id);
      
    if (transactionsUsingCategory || budgetsUsingCategory) {
      return false;
    }
    
    return this.categories.delete(id);
  }

  // Initialize with default categories
  private initializeDefaultCategories() {
    const defaultCategories: InsertCategory[] = [
      { name: "Income", icon: "wallet", color: "#4caf50", isDefault: 1 },
      { name: "Housing", icon: "home", color: "#1a73e8", isDefault: 1 },
      { name: "Food & Dining", icon: "utensils", color: "#34a853", isDefault: 1 },
      { name: "Transportation", icon: "car", color: "#fbbc04", isDefault: 1 },
      { name: "Entertainment", icon: "film", color: "#ea4335", isDefault: 1 },
      { name: "Utilities", icon: "bolt", color: "#9aa0a6", isDefault: 1 },
      { name: "Savings", icon: "piggy-bank", color: "#4285f4", isDefault: 1 },
      { name: "Others", icon: "tag", color: "#9aa0a6", isDefault: 1 }
    ];
    
    defaultCategories.forEach(category => {
      const id = this.currentCategoryId++;
      this.categories.set(id, { ...category, id });
    });
  }

  // Initialize with sample data
  private initializeSampleData() {
    // Create sample user
    this.createUser({
      username: "user",
      password: "password",
      currency: "USD"
    });
    
    // Current date and last month's date
    const currentDate = new Date();
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    
    // Create sample transactions
    [
      {
        description: "Salary Deposit",
        amount: "4530.75",
        date: currentDate,
        categoryId: 1, // Income
        type: "income",
        notes: "Monthly salary"
      },
      {
        description: "Rent Payment",
        amount: "950.00",
        date: currentDate,
        categoryId: 2, // Housing
        type: "expense",
        notes: "Monthly rent"
      },
      {
        description: "Grocery Shopping",
        amount: "85.20",
        date: currentDate,
        categoryId: 3, // Food & Dining
        type: "expense",
        notes: "Weekly groceries"
      },
      {
        description: "Electric Bill",
        amount: "75.40",
        date: currentDate,
        categoryId: 6, // Utilities
        type: "expense",
        notes: "Monthly electricity"
      },
      {
        description: "Gas",
        amount: "45.75",
        date: currentDate,
        categoryId: 4, // Transportation
        type: "expense",
        notes: "Weekly fuel"
      },
      {
        description: "Movie Night",
        amount: "35.50",
        date: currentDate,
        categoryId: 5, // Entertainment
        type: "expense",
        notes: "Weekend movie"
      },
      {
        description: "Investment Deposit",
        amount: "250.00",
        date: currentDate,
        categoryId: 7, // Savings
        type: "expense",
        notes: "Monthly investment"
      }
    ].forEach(transaction => {
      this.createTransaction(transaction as InsertTransaction);
    });
    
    // Create sample budgets
    [
      {
        categoryId: 2, // Housing
        amount: "950.00",
        period: "monthly",
        startDate: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
        endDate: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)
      },
      {
        categoryId: 3, // Food & Dining
        amount: "800.00",
        period: "monthly",
        startDate: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
        endDate: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)
      },
      {
        categoryId: 4, // Transportation
        amount: "500.00",
        period: "monthly",
        startDate: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
        endDate: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)
      },
      {
        categoryId: 5, // Entertainment
        amount: "300.00",
        period: "monthly",
        startDate: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
        endDate: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)
      },
      {
        categoryId: 6, // Utilities
        amount: "200.00",
        period: "monthly",
        startDate: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
        endDate: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)
      }
    ].forEach(budget => {
      this.createBudget(budget as InsertBudget);
    });
  }
}

export const storage = new MemStorage();
