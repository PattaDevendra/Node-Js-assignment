const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, required: true, unique: true },
  password: String,
  companyName: String,
  age: Number,
  dob: Date,
  profileImage: String,
  otp: String,
  otpExpiry: Date,
});

module.exports = mongoose.model('User', UserSchema);
