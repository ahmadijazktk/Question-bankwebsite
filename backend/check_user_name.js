import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './src/models/User.js';

dotenv.config();

console.log('Connecting to MongoDB...', process.env.MONGODB_URI);
mongoose.connect(process.env.MONGODB_URI)
    .then(async () => {
        console.log('Connected.');
        const user = await User.findOne({ email: 'Dan.gonzalezmd@gmail.com' });
        console.log('User found:', user);
        mongoose.disconnect();
    })
    .catch((err) => {
        console.error('Error:', err);
    });
