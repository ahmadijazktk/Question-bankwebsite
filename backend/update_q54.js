
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

    const qId = '69a363b0e212ad97bfa96f30';
    const q = await Question.findById(qId);
    if (!q) { console.log("Not found"); await mongoose.disconnect(); return; }

    const BOLD = (text) => `<strong style='color:#000;font-weight:900;'>${text}</strong>`;

    const newExplanation =
        `I made this tricky just to help you memorize. If proteinuria was >0.5g, then answer is Yes. This is ${BOLD('CONDITIONAL RECOMMENDATION')}.<br /><br />` +
        `"In people with SLE who have proteinuria >0.5 g/g and/or impaired kidney function not otherwise explained , we ${BOLD('CONDITIONALLY RECOMMEND')} performing a kidney biopsy.`;

    // update correct option
    q.options.forEach(o => {
        if (o.isCorrect) {
            o.explanation = newExplanation;
        }
    });

    q.markModified('options');
    await q.save();

    console.log("Q54 updated successfully.");
    await mongoose.disconnect();
}
run();
