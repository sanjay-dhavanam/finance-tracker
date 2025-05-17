const express = require('express');
const router = express.Router();
const budgetController = require('../controllers/budgetController');

// Budget routes
router.get('/', budgetController.getBudgets);
router.get('/:id', budgetController.getBudgetById);
router.get('/category/:categoryId', budgetController.getBudgetByCategory);
router.post('/', budgetController.createBudget);
router.put('/:id', budgetController.updateBudget);
router.delete('/:id', budgetController.deleteBudget);

module.exports = router;