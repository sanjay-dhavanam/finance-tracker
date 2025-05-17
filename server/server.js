const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');
const cors = require('cors');

// Import routes
const userRoutes = require('./routes/userRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const budgetRoutes = require('./routes/budgetRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/finance-manager')
  .then(() => {
    console.log('Connected to MongoDB');
    
    // Initialize default categories if none exist
    const Category = require('./models/Category');
    
    Category.countDocuments().then(count => {
      if (count === 0) {
        console.log('Creating default categories...');
        const defaultCategories = [
          { name: "Income", icon: "wallet", color: "#4caf50", isDefault: 1 },
          { name: "Housing", icon: "home", color: "#1a73e8", isDefault: 1 },
          { name: "Food & Dining", icon: "utensils", color: "#34a853", isDefault: 1 },
          { name: "Transportation", icon: "car", color: "#fbbc04", isDefault: 1 },
          { name: "Entertainment", icon: "film", color: "#ea4335", isDefault: 1 },
          { name: "Utilities", icon: "bolt", color: "#9aa0a6", isDefault: 1 },
          { name: "Savings", icon: "piggy-bank", color: "#4285f4", isDefault: 1 },
          { name: "Others", icon: "tag", color: "#9aa0a6", isDefault: 1 }
        ];
        
        Category.insertMany(defaultCategories)
          .then(() => console.log('Default categories created'))
          .catch(err => console.error('Error creating default categories:', err));
      }
    });
  })
  .catch(err => console.error('MongoDB connection error:', err));

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/budgets', budgetRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/analytics', analyticsRoutes);

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('client/build'));
  
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client', 'build', 'index.html'));
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

// Set port
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;