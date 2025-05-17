const Transaction = require('../models/Transaction');
const Budget = require('../models/Budget');
const Category = require('../models/Category');

// Get financial summary
exports.getSummary = async (req, res) => {
  try {
    const transactions = await Transaction.find();
    
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
    
    // Find the savings category
    const savingsCategory = await Category.findOne({ name: 'Savings' });
    
    // Calculate savings
    let savings = 0;
    if (savingsCategory) {
      savings = transactions
        .filter(t => t.categoryId.toString() === savingsCategory._id.toString() && t.type === "expense")
        .reduce((sum, t) => sum + Number(t.amount), 0);
    }
    
    res.json({
      balance: balance.toFixed(2),
      income: income.toFixed(2),
      expenses: expenses.toFixed(2),
      savings: savings.toFixed(2)
    });
  } catch (error) {
    res.status(500).json({ message: 'Error generating summary', error: error.message });
  }
};

// Get expenses by category
exports.getExpensesByCategory = async (req, res) => {
  try {
    const transactions = await Transaction.find();
    const categories = await Category.find();
    
    // Get expenses by category
    const expensesByCategory = categories.map(category => {
      const categoryExpenses = transactions
        .filter(t => t.categoryId.toString() === category._id.toString() && t.type === "expense")
        .reduce((sum, t) => sum + Number(t.amount), 0);
      
      return {
        id: category._id,
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
    res.status(500).json({ message: 'Error generating expenses by category', error: error.message });
  }
};

// Get budget progress
exports.getBudgetProgress = async (req, res) => {
  try {
    const transactions = await Transaction.find();
    const budgets = await Budget.find().populate('categoryId');
    
    const budgetProgress = budgets.map(budget => {
      const spent = transactions
        .filter(t => t.categoryId.toString() === budget.categoryId._id.toString() && t.type === "expense")
        .reduce((sum, t) => sum + Number(t.amount), 0);
      
      const percentage = (spent / Number(budget.amount)) * 100;
      
      return {
        id: budget._id,
        categoryId: budget.categoryId._id,
        categoryName: budget.categoryId.name,
        categoryIcon: budget.categoryId.icon,
        categoryColor: budget.categoryId.color,
        budgetAmount: Number(budget.amount).toFixed(2),
        spent: spent.toFixed(2),
        percentage: percentage.toFixed(1)
      };
    });
    
    res.json(budgetProgress);
  } catch (error) {
    res.status(500).json({ message: 'Error generating budget progress', error: error.message });
  }
};

// Get monthly spending
exports.getMonthlySpending = async (req, res) => {
  try {
    const transactions = await Transaction.find();
    
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
    res.status(500).json({ message: 'Error generating monthly spending', error: error.message });
  }
};