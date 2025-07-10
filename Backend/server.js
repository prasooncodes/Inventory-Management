require('dotenv').config();
const mongoose = require("mongoose");

async function main() {
    try {
        const uri = process.env.MONGODB_URI;
        
        // MongoDB Atlas connection options
        const options = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            retryWrites: true,
            w: 'majority',
            serverSelectionTimeoutMS: 30000, // Timeout after 30s
            socketTimeoutMS: 45000, // Close sockets after 45s
        };

        await mongoose.connect(uri, options);
        console.log("Successfully connected to MongoDB Atlas");

    } catch (err) {
        console.error("MongoDB connection error:", err);
        throw err; // Propagate error to server.js
    }
}

// Add connection event handlers
mongoose.connection.on('connected', () => {
    console.log('MongoDB connected successfully');
});

mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('MongoDB disconnected');
});

// Handle application termination
process.on('SIGINT', async () => {
    try {
        await mongoose.connection.close();
        console.log('MongoDB connection closed through app termination');
        process.exit(0);
    } catch (err) {
        console.error('Error closing MongoDB connection:', err);
        process.exit(1);
    }
});

module.exports = { main };