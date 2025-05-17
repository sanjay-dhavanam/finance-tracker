const express = require('express');
const router = express.Router();
const budgetController = require('../controllers/budgetController');
const auth = require('../middleware/auth');

// Budget routes - all protected with auth middleware
router.get('/', auth, budgetController.getBudgets);
router.get('/:id', auth, budgetController.getBudgetById);
router.get('/category/:categoryId', auth, budgetController.getBudgetByCategory);
router.post('/', auth, budgetController.createBudget);
router.put('/:id', auth, budgetController.updateBudget);
router.delete('/:id', auth, budgetController.deleteBudget);

module.exports = router;