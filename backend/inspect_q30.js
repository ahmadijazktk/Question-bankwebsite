
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

    // Get the actual Q30 from the UI - sorted by createdAt desc, non-trial, position 29 (0-indexed)
    const qs = await Question.find({ isFreeTrialQuestion: { $ne: true } })
        .sort({ createdAt: -1 })
        .skip(29)
        .limit(1);

    if (!qs.length) { console.log("Not found"); await mongoose.disconnect(); return; }
    const q = qs[0];
    console.log(`Q30 ID: ${q._id}`);
    console.log(`Text: ${q.text}`);
    q.options.forEach((o, i) => {
        console.log(`\n--- Option ${i}: ${o.text} ---`);
        console.log(o.explanation);
    });

    await mongoose.disconnect();
}
run();
