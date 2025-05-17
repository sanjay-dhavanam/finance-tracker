const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');

// Analytics routes
router.get('/summary', analyticsController.getSummary);
router.get('/expenses-by-category', analyticsController.getExpensesByCategory);
router.get('/budget-progress', analyticsController.getBudgetProgress);
router.get('/monthly-spending', analyticsController.getMonthlySpending);

module.exports = router;