const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const auth = require('../middleware/auth');

// Transaction routes - all protected with auth middleware
router.get('/', auth, transactionController.getTransactions);
router.get('/:id', auth, transactionController.getTransactionById);
router.get('/category/:categoryId', auth, transactionController.getTransactionsByCategory);
router.post('/', auth, transactionController.createTransaction);
router.put('/:id', auth, transactionController.updateTransaction);
router.delete('/:id', auth, transactionController.deleteTransaction);

module.exports = router;