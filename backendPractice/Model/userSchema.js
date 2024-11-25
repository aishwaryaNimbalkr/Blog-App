const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  userName: { type: String, required: true },
  userEmail: { type: String, required: true, unique: true },
  userPassword: { type: String, required: true },
  isAdmin: { type: Boolean, default: false }, // Default is false for regular users
});

const User = mongoose.model('User', userSchema);

module.exports = User;
