
import fs from 'fs';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const QuestionSchema = new mongoose.Schema({
    text: String,
    isFreeTrialQuestion: Boolean,
    freeTrialOrder: Number
}, { strict: false });
const Question = mongoose.model('Question', QuestionSchema);

async function check() {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    const dbTrial = await Question.find({ isFreeTrialQuestion: true });
    dbTrial.sort((a, b) => (a.freeTrialOrder || 0) - (b.freeTrialOrder || 0));

    console.log(`Trial questions in DB: ${dbTrial.length}`);
    dbTrial.forEach((q, i) => {
        console.log(`${i + 1}: Order ${q.freeTrialOrder} | ${q._id} | ${q.text.substring(0, 50).replace(/\n/g, ' ')}...`);
    });

    await mongoose.disconnect();
}

check();
