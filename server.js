const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const otpGenerator = require('otp-generator');
const nodemailer = require('nodemailer');
const User = require('./models/User');

const app = express();
app.use(express.json());
mongoose.connect('mongodb://localhost:27017/user-auth', { useNewUrlParser: true, useUnifiedTopology: true });

// Configure multer for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});
const upload = multer({ storage });

// Registration Route
app.post('/api/register', upload.single('image'), async (req, res) => {
  const { name, email, password, companyName, age, dob } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({
    name,
    email,
    password: hashedPassword,
    companyName,
    age,
    dob,
    profileImage: req.file.path,
  });

  await newUser.save();
  res.send({ success: true });
});

// Login Route
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && await bcrypt.compare(password, user.password)) {
    const otp = otpGenerator.generate(6, { digits: true });
    user.otp = otp;
    user.otpExpiry = Date.now() + 600000; // OTP expires in 10 minutes
    await user.save();

    // Send OTP to user email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: 'your-email@gmail.com', pass: 'your-email-password' },
    });

    await transporter.sendMail({
      from: 'your-email@gmail.com',
      to: email,
      subject: 'Your OTP Code',
      text: `Your OTP is: ${otp}`,
    });

    res.send({ success: true });
  } else {
    res.status(401).send({ success: false, message: 'Invalid credentials' });
  }
});

// OTP Verification Route
app.post('/api/verify-otp', async (req, res) => {
  const { otp } = req.body;
  const user = await User.findOne({ otp });
  if (user && Date.now() < user.otpExpiry) {
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();
    res.send({ success: true });
  } else {
    res.status(400).send({ success: false, message: 'Invalid or expired OTP' });
  }
});

// Delete Account Route
app.delete('/api/delete-account', async (req, res) => {
  const user = await User.findByIdAndDelete(req.user.id);
  if (user) {
    res.send({ success: true });
  } else {
    res.status(400).send({ success: false, message: 'User not found' });
  }
});

// Start server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
