const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  currency: {
    type: String,
    default: "USD"
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', UserSchema);