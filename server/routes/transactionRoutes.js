const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');

// Transaction routes
router.get('/', transactionController.getTransactions);
router.get('/:id', transactionController.getTransactionById);
router.get('/category/:categoryId', transactionController.getTransactionsByCategory);
router.post('/', transactionController.createTransaction);
router.put('/:id', transactionController.updateTransaction);
router.delete('/:id', transactionController.deleteTransaction);

module.exports = router;