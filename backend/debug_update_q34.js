
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const QuestionSchema = new mongoose.Schema({
    text: String,
    options: [{
        text: String,
        isCorrect: Boolean,
        explanation: String
    }]
}, { strict: false });
const Question = mongoose.models.Question || mongoose.model('Question', QuestionSchema);

async function run() {
    await mongoose.connect(process.env.MONGO_URI);

    const qId = '69a363b2e212ad97bfa96f58';
    const q = await Question.findById(qId);
    if (!q) { console.log("Not found"); await mongoose.disconnect(); return; }

    console.log("Old Text:", q.text);

    q.text = "To minimize retinal toxicity, we conditionally recommend a long-term average daily HCQ dose goal of {{.....}} over a dose goal of {{.....}}";
    const newExplanation = "To minimize retinal toxicity, we conditionally recommend a long-term average daily HCQ dose goal of {{c1:: ≤5 mg/kg}} over a dose goal of {{c1:: >5 mg/kg}}";

    q.options[0].explanation = newExplanation;

    q.markModified('text');
    q.markModified('options');
    const res = await q.save();

    console.log("Save Result Text:", res.text);
    console.log("Q34 updated successfully.");
    await mongoose.disconnect();
}
run();
