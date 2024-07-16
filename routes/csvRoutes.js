// routes/csvRoutes.js

const express = require('express');
const router = express.Router();
const { writeToCSV, readFromCSV } = require('../utils/csvHandler');

// POST /writeUser (Endpoint to write data to CSV)
router.post('/writeUser', async (req, res) => {
    const { username, email, contact } = req.body;

    // Validate user input (example)
    if (!username || !email || !contact) {
        return res.status(400).send('Invalid input data.');
    }

    try {
        // Write to CSV
        await writeToCSV({ username, email, contact, createdAt: new Date().toISOString() });
        res.status(200).send('Data written to CSV successfully.');
    } catch (error) {
        console.error('Error writing to CSV:', error);
        res.status(500).send('Failed to write data to CSV.');
    }
});

// GET /readUsers (Endpoint to read data from CSV)
router.get('/readUsers', async (req, res) => {
    try {
        // Read from CSV
        const csvData = await readFromCSV();
        res.status(200).json(csvData);
    } catch (error) {
        console.error('Error reading from CSV:', error);
        res.status(500).send('Failed to fetch data from CSV.');
    }
});

module.exports = router;
