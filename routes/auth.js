// routes/auth.js

const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { sendVerificationEmail } = require('../utils/emailservice');
const { writeToCSV } = require('../utils/csvHandler');

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRATION = '1h';

// POST /register
router.post('/register', async (req, res) => {
  const { name, username, email, password, contact } = req.body;

  try {
    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    const confirmationToken = crypto.randomBytes(32).toString('hex');

    user = new User({
      name,
      username,
      email,
      password,
      contact,
      isVerified: false,
      confirmationToken,
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    await writeToCSV({ name,username, email, contact, createdAt: new Date().toISOString() });

    await sendVerificationEmail(user.email, confirmationToken);

    res.status(200).json({ msg: 'Registration successful. Please check your email for verification.' });
  } catch (err) {
    console.error('Error during registration:', err);
    res.status(500).send('Server error');
  }
});


// GET /verify-email
router.get('/verify-email', async (req, res) => {
  const { token } = req.query;

  try {
    console.log('Received token:', token);

    // Find the user with the matching confirmation token
    const user = await User.findOne({ confirmationToken: token });

    if (!user) {
      console.log('Invalid token');
      return res.status(400).json({ msg: 'Invalid token' });
    }

    console.log('User found:', user.email);

    // Update the user's verified status
    user.isVerified = true;
    user.confirmationToken = null; // Clear the token

    // Save the updated user object to the database
    const updatedUser = await user.save();
    
    console.log('User verified:', updatedUser);

    // Respond with a success message or redirect to a login page
    res.send('Email successfully verified');
  } catch (error) {
    console.error('Error verifying email:', error.message);
    res.status(500).send('Server error');
  }
});




// POST /login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    console.log('Login attempt for email:', email);
    
    const user = await User.findOne({ email });

    if (!user) {
      console.log('User not found for email:', email);
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    if (!user.isVerified) {
      console.log('User email not verified:', email);
      return res.status(400).json({ msg: 'Please verify your email before logging in' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      console.log('Invalid password for email:', email);
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const payload = {
      user: {
        id: user.id,
        email: user.email,
      },
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRATION });

    console.log('Login successful for email:', email);
    res.json({ token });
  } catch (err) {
    console.error('Login failed:', err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
