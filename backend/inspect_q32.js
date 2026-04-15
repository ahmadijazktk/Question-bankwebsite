
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const QuestionSchema = new mongoose.Schema({}, { strict: false });
const Question = mongoose.models.Question || mongoose.model('Question', QuestionSchema);

async function run() {
    await mongoose.connect(process.env.MONGO_URI);

    // Q32 = position 31 (0-indexed), sorted by createdAt desc, non-trial
    const qs = await Question.find({ isFreeTrialQuestion: { $ne: true } })
        .sort({ createdAt: -1 })
        .skip(31)
        .limit(1);

    if (!qs.length) { console.log("Not found"); await mongoose.disconnect(); return; }
    const q = qs[0];
    console.log(`ID: ${q._id}`);
    console.log(`Text: ${q.text}`);
    q.options.forEach((o, i) => {
        console.log(`\n--- Opt ${i}: ${o.text} ---`);
        console.log(`Explanation: ${o.explanation}`);
        if (o.isCorrect) console.log("--- THIS IS THE CORRECT ANSWER ---");
    });

    await mongoose.disconnect();
}
run();
