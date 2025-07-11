const User = require('../models/users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); // Make sure this is imported
require('dotenv').config(); // Load environment variables

exports.register = async (req, res) => {
    try {
        const { firstName, lastName, email, password, phoneNumber } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const user = new User({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            phoneNumber
        });

        await user.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error registering user', error: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({ 
                message: 'Email and password are required' 
            });
        }

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ 
                message: 'Invalid credentials' 
            });
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ 
                message: 'Invalid credentials' 
            });
        }

        // Ensure JWT_SECRET is set
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            return res.status(500).json({ message: 'JWT secret not configured in environment variables' });
        }

        // Generate token
        const token = jwt.sign(
            { userId: user._id, email: user.email },
            jwtSecret,
            { expiresIn: '24h' }
        );

        // Send response without sensitive fields
        res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                phoneNumber: user.phoneNumber
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ 
            message: 'Internal server error',
            error: error.message 
        });
    }
};
