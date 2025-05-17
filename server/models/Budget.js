const mongoose = require('mongoose');

const BudgetSchema = new mongoose.Schema({
  amount: {
    type: String,
    required: true
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  period: {
    type: String,
    required: true,
    enum: ['weekly', 'monthly', 'yearly']
  },
  startDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  endDate: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Budget', BudgetSchema);