
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envPath = path.join(__dirname, '.env');
console.log(`Loading .env from: ${envPath}`);

if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
} else {
    console.error("❌ .env file not found!");
}

const questionSchema = new mongoose.Schema({
    text: String,
    isFreeTrialQuestion: Boolean,
    category: String
});

const Question = mongoose.models.Question || mongoose.model('Question', questionSchema);

async function check() {
    try {
        if (!process.env.MONGO_URI) {
            console.error("❌ MONGO_URI missing from .env!");
            return;
        }
        console.log(`📡 Connecting to: ${process.env.MONGO_URI.split('@')[1]}`);
        await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log("✅ Connected to MongoDB");

        const count = await Question.countDocuments();
        const trialCount = await Question.countDocuments({ isFreeTrialQuestion: true });
        console.log(`Total questions in DB: ${count}`);
        console.log(`Trial questions in DB: ${trialCount}`);

        if (trialCount > 0) {
            const firstTrial = await Question.findOne({ isFreeTrialQuestion: true });
            console.log(`First trial question found: ${firstTrial.text.substring(0, 50)}...`);
            console.log(`Category: ${firstTrial.category}`);
        } else {
            console.log("⚠️ No trial questions found! Re-seeding required.");
        }

    } catch (err) {
        console.error("❌ MongoDB operation failed:", err);
    } finally {
        await mongoose.connection.close();
        console.log("👋 Disconnected.");
    }
}

check();
