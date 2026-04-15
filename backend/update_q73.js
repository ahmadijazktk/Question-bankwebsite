
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

    const qId = '69a363aee212ad97bfa96f0a';
    const q = await Question.findById(qId);
    if (!q) { console.log("Not found"); await mongoose.disconnect(); return; }

    const BOLD = (text) => `<strong style='color:#000;font-weight:900;'>${text}</strong>`;

    const newExplanation = `For patients with suspected GCA, we ${BOLD('CONDITIONALLY RECOMMEND')} obtaining a temporal artery biopsy specimen within 2 weeks of starting oral GCs over waiting longer than 2 weeks for a biopsy.`;

    q.options.forEach(o => {
        if (o.isCorrect) {
            o.explanation = newExplanation;
        }
    });

    q.markModified('options');
    await q.save();

    console.log("Q73 updated successfully.");
    await mongoose.disconnect();
}
run();
