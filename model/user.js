const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  idNumber: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  lotteryNumber: { type: String, required: true, unique: true }
});

module.exports = mongoose.model('User', userSchema);
