
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
}

const optionSchema = new mongoose.Schema({
    text: String,
    explanation: String,
    isCorrect: Boolean
}, { _id: false });

const questionSchema = new mongoose.Schema({
    text: String,
    category: String,
    options: [optionSchema],
    isFreeTrialQuestion: Boolean
}, { timestamps: true });

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    role: String
});

const Question = mongoose.models.Question || mongoose.model('Question', questionSchema);
const User = mongoose.models.User || mongoose.model('User', userSchema);

async function check() {
    try {
        const mongoURI = process.env.MONGO_URI;
        if (!mongoURI) {
            console.error("❌ MONGO_URI missing from .env!");
            return;
        }

        console.log(`📡 Connecting to: ${mongoURI.split('@')[1] || mongoURI}`);

        await mongoose.connect(mongoURI, {
            serverSelectionTimeoutMS: 15000,
            socketTimeoutMS: 45000
        });
        console.log("✅ Connected to MongoDB");

        // Questions Stats
        const count = await Question.countDocuments();
        const trialCount = await Question.countDocuments({ isFreeTrialQuestion: true });

        const categories = await Question.aggregate([
            { $group: { _id: '$category', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);

        // Users Stats
        const userCount = await User.countDocuments();
        const adminUsers = await User.find({ role: 'admin' }).select('name email');

        console.log('\n=================================');
        console.log('       WEBSITE STATE REPORT       ');
        console.log('=================================');

        console.log('\n--- 📝 Question Bank Summary ---');
        console.log(`Total questions:   ${count}`);
        console.log(`Trial questions:   ${trialCount}`);

        console.log('\n--- 📂 Categories Breakdown ---');
        if (categories.length === 0) {
            console.log('No categorized questions found.');
        } else {
            categories.forEach(cat => {
                console.log(`• ${cat._id || 'Uncategorized'}: ${cat.count}`);
            });
        }

        console.log('\n--- 👥 User Base ---');
        console.log(`Total registered users: ${userCount}`);
        console.log(`Admins (${adminUsers.length}):`);
        adminUsers.forEach(admin => {
            console.log(`  - ${admin.name} (${admin.email})`);
        });

        console.log('\n--- ⚙️ Infrastructure ---');
        console.log(`DB Name: ${mongoose.connection.name}`);
        console.log(`Host:    ${mongoose.connection.host}`);
        console.log(`Frontend URL: ${process.env.FRONTEND_URL || 'Not specified'}`);

        console.log('\n=================================');

    } catch (err) {
        console.error("\n❌ CONNECTION ERROR:", err.message);
        console.log("\nPossible causes:");
        console.log("1. Your IP address is not whitelisted in MongoDB Atlas.");
        console.log("2. Your internet connection is blocking the database port.");
        console.log("3. The MONGO_URI in .env is incorrect or expired.");
    } finally {
        if (mongoose.connection.readyState !== 0) {
            await mongoose.connection.close();
            console.log("\n👋 Disconnected.");
        }
    }
}

check();
