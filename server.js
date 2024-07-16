// backend/server.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(express.json()); // Body parser middleware

// CORS configuration
const corsOptions = {
    origin: 'https://thepropertiesbuilders.in', // Allow your frontend domain
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Enable cookies and authorization headers
};

app.use(cors(corsOptions)); // Enable CORS with options

// Routes
const csvRoutes = require('./routes/csvRoutes');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');

app.use('/api/csv', csvRoutes); // Assuming csvRoutes is correctly defined
app.use('/api/auth', authRoutes); // Assuming authRoutes is correctly defined
app.use('/api/user', userRoutes); // Assuming userRoutes is correctly defined

// Route for handling contact form submission
app.post('/api/contact', (req, res) => {
    // Handle contact form submission logic here
    console.log('Received contact form submission:', req.body);
    // Logic to save contact form data to MongoDB or send email here
    res.send('Contact form submitted successfully.');
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log('MongoDB connected');
})
.catch(err => {
    console.error('MongoDB connection error:', err);
});

// Start server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
