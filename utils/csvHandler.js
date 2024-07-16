// utils/csvHandler.js

const createCsvWriter = require('csv-writer').createObjectCsvWriter;

const csvWriter = createCsvWriter({
    path: './data/user.csv',
    header: [
        { id: 'name', title: 'USERNAME' },
        { id: 'username', title: 'USERNAME' },
        { id: 'email', title: 'EMAIL' },
        { id: 'contact', title: 'CONTACT' },
        { id: 'createdAt', title: 'CREATED_AT' }
    ],
    append: true // Ensure that new records are appended to the existing file
});

const writeToCSV = async (user) => {
    try {
        await csvWriter.writeRecords([user]);
        console.log('User data written to CSV file successfully.');
    } catch (err) {
        console.error('Error writing to CSV:', err);
        throw new Error('Failed to write data to CSV.');
    }
};

const readFromCSV = async () => {
    // Implement logic to read data from CSV if needed
    try {
        // Read CSV logic goes here
        console.log('Reading data from CSV file.');
        return [];
    } catch (err) {
        console.error('Error reading from CSV:', err);
        throw new Error('Failed to read data from CSV.');
    }
};

module.exports = { writeToCSV, readFromCSV };
