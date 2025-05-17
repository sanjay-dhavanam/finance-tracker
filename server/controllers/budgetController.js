const Budget = require('../models/Budget');

// Get all budgets
exports.getBudgets = async (req, res) => {
  try {
    const budgets = await Budget.find()
      .populate('categoryId');
    res.json(budgets);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching budgets', error: error.message });
  }
};

// Get budget by ID
exports.getBudgetById = async (req, res) => {
  try {
    const budget = await Budget.findById(req.params.id)
      .populate('categoryId');
      
    if (!budget) {
      return res.status(404).json({ message: 'Budget not found' });
    }
    
    res.json(budget);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching budget', error: error.message });
  }
};

// Get budget by category
exports.getBudgetByCategory = async (req, res) => {
  try {
    const budget = await Budget.findOne({ categoryId: req.params.categoryId })
      .populate('categoryId');
    
    if (!budget) {
      return res.status(404).json({ message: 'Budget not found for this category' });
    }
    
    res.json(budget);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching budget', error: error.message });
  }
};

// Create new budget
exports.createBudget = async (req, res) => {
  try {
    // Check if a budget already exists for this category
    const existingBudget = await Budget.findOne({ categoryId: req.body.categoryId });
    
    if (existingBudget) {
      return res.status(409).json({ message: 'A budget already exists for this category' });
    }
    
    const budget = new Budget(req.body);
    const savedBudget = await budget.save();
    
    // Populate category info for the response
    const populatedBudget = await Budget.findById(savedBudget._id)
      .populate('categoryId');
    
    res.status(201).json(populatedBudget);
  } catch (error) {
    res.status(500).json({ message: 'Error creating budget', error: error.message });
  }
};

// Update budget
exports.updateBudget = async (req, res) => {
  try {
    const updatedBudget = await Budget.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('categoryId');
    
    if (!updatedBudget) {
      return res.status(404).json({ message: 'Budget not found' });
    }
    
    res.json(updatedBudget);
  } catch (error) {
    res.status(500).json({ message: 'Error updating budget', error: error.message });
  }
};

// Delete budget
exports.deleteBudget = async (req, res) => {
  try {
    const budget = await Budget.findByIdAndDelete(req.params.id);
    
    if (!budget) {
      return res.status(404).json({ message: 'Budget not found' });
    }
    
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ message: 'Error deleting budget', error: error.message });
  }
};