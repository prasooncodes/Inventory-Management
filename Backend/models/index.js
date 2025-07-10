require('dotenv').config();
const mongoose = require("mongoose");
const uri = process.env.MONGODB_URI;

async function main() {
    try {
        // Add connection options including increased timeout
        const options = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 15000, // Increase timeout to 15 seconds
            connectTimeoutMS: 15000
        };

        await mongoose.connect(uri, options);
        console.log("Database connection successful");
    } catch (err) {
        console.error("Database connection error:", err);
        process.exit(1); // Exit if cannot connect to database
    }
}

// Add connection error handlers
mongoose.connection.on('error', err => {
    console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('MongoDB disconnected');
});

module.exports = { main };