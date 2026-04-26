
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

const Question = mongoose.models.Question || mongoose.model('Question', questionSchema);

async function check() {
    try {
        const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/studybloom';
        console.log(`📡 Connecting to: ${mongoURI.split('@')[1] || mongoURI}`);

        await mongoose.connect(mongoURI, {
            serverSelectionTimeoutMS: 5000
        });
        console.log("✅ Connected to MongoDB");

        const count = await Question.countDocuments();
        const trialCount = await Question.countDocuments({ isFreeTrialQuestion: true });

        const categories = await Question.aggregate([
            { $group: { _id: '$category', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);

        console.log('\n--- Database Stats ---');
        console.log(`Total questions: ${count}`);
        console.log(`Trial questions: ${trialCount}`);
        console.log('\n--- Categories ---');
        categories.forEach(cat => {
            console.log(`${cat._id || 'Uncategorized'}: ${cat.count}`);
        });

    } catch (err) {
        console.error("❌ Operation failed:", err.message);
    } finally {
        await mongoose.connection.close();
        console.log("\n👋 Disconnected.");
    }
}

check();
