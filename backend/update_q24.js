
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const QuestionSchema = new mongoose.Schema({
    options: [{
        text: String,
        isCorrect: Boolean,
        explanation: String
    }]
}, { strict: false });
const Question = mongoose.models.Question || mongoose.model('Question', QuestionSchema);

async function run() {
    await mongoose.connect(process.env.MONGO_URI);

    const qId = '69a363b3e212ad97bfa96f6c';
    const q = await Question.findById(qId);
    if (!q) { console.log("Not found"); await mongoose.disconnect(); return; }

    const BOLD = (text) => `<strong style='color:#000;font-weight:900;'>${text}</strong>`;

    const newExplanation =
        `Seizure : For seizures attributed to active SLE: \u2026We ${BOLD('CONDITIONALLY RECOMMEND')} anti-seizure medication plus glucocorticoid, CYC, MPAA, AZA, and/or anti-CD20 over anti-seizure medication alone.<br /><br />` +
        `Essentially anti-seizure med plus steroids, CYC, MMF, AZA or RTX.`;

    q.options.forEach(o => {
        if (o.isCorrect) {
            o.explanation = newExplanation;
        }
    });

    q.markModified('options');
    await q.save();

    console.log("Q24 updated successfully.");
    await mongoose.disconnect();
}
run();
