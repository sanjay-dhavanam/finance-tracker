const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const auth = require('../middleware/auth');

// Analytics routes - all protected with auth middleware
router.get('/summary', auth, analyticsController.getSummary);
router.get('/expenses-by-category', auth, analyticsController.getExpensesByCategory);
router.get('/budget-progress', auth, analyticsController.getBudgetProgress);
router.get('/monthly-spending', auth, analyticsController.getMonthlySpending);

module.exports = router;