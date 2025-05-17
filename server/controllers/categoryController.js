const Category = require('../models/Category');
const Transaction = require('../models/Transaction');
const Budget = require('../models/Budget');

// Get all categories
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching categories', error: error.message });
  }
};

// Get category by ID
exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
      
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching category', error: error.message });
  }
};

// Create new category
exports.createCategory = async (req, res) => {
  try {
    const category = new Category(req.body);
    const savedCategory = await category.save();
    res.status(201).json(savedCategory);
  } catch (error) {
    res.status(500).json({ message: 'Error creating category', error: error.message });
  }
};

// Update category
exports.updateCategory = async (req, res) => {
  try {
    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!updatedCategory) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    res.json(updatedCategory);
  } catch (error) {
    res.status(500).json({ message: 'Error updating category', error: error.message });
  }
};

// Delete category
exports.deleteCategory = async (req, res) => {
  try {
    // Get the category to check if it's a default category
    const category = await Category.findById(req.params.id);
    
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    // Check if the category is a default category
    if (category.isDefault === 1) {
      return res.status(403).json({ message: 'Default categories cannot be deleted' });
    }
    
    // Check if the category is used in any transactions
    const transactionsUsingCategory = await Transaction.findOne({ categoryId: req.params.id });
    if (transactionsUsingCategory) {
      return res.status(400).json({ message: 'Category is in use by transactions and cannot be deleted' });
    }
    
    // Check if the category is used in any budgets
    const budgetsUsingCategory = await Budget.findOne({ categoryId: req.params.id });
    if (budgetsUsingCategory) {
      return res.status(400).json({ message: 'Category is in use by budgets and cannot be deleted' });
    }
    
    // Delete the category if it's not in use
    await Category.findByIdAndDelete(req.params.id);
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ message: 'Error deleting category', error: error.message });
  }
};