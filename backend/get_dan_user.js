import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './src/models/User.js';

dotenv.config();

console.log('Connecting to MongoDB...');
mongoose.connect(process.env.MONGO_URI)
    .then(async () => {
        console.log('Connected to DB');
        const user = await User.findOne({ email: { $regex: /dan.gonzalez/i } });
        console.log('User object:', user);
        await mongoose.disconnect();
        process.exit(0);
    })
    .catch((err) => {
        console.error('Connection error:', err);
        process.exit(1);
    });
