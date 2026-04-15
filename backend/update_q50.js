
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

    const qId = '69a363b1e212ad97bfa96f38';
    const q = await Question.findById(qId);
    if (!q) { console.log("Not found"); await mongoose.disconnect(); return; }

    const BOLD = (text) => `<strong style='color:#000;font-weight:900;'>${text}</strong>`;

    // 1. Update Question Text
    q.text = "A 40 year old male with PMH of SLE and lupus nephritis is currently on HCQ, MMF, lisinopril and belimumab. A previous renal biopsy showed Class IV lupus nephritis. He continues to have fluctuating levels of proteinuria, otherwise he is doing well with no symptomatic complaints. His last follow up was 6 months ago and would like to keep his follow up schedule the same because he says he has been doing well. What is your next best step in managing his condition, per ACR?";

    // 2. Update Options
    // Find the correct option. Based on the previous inspection, it was Opt 0 (since it had the explanation "In people with LN who have not achieved...").
    // Let's find it by isCorrect: true.

    const correctOptionText = "Increase follow ups to every 3 months, particularly for proteinuria checking (STRONG RECOMMENDATION)";
    const newExplanation = `"In people with LN who have not achieved complete renal response, we ${BOLD('STRONGLY RECOMMEND')} quantifying proteinuria at least every 3 months ."<br /><br />***in patients who have sustained complete renal response, it is ${BOLD('STRONGLY RECOMMENDED')} to check proteinuria every 3-6 months for monitoring.`;

    let correctFound = false;
    q.options.forEach(o => {
        if (o.isCorrect) {
            o.text = correctOptionText;
            o.explanation = newExplanation;
            correctFound = true;
        }
    });

    if (!correctFound) {
        console.log("Warning: No option marked as correct found.");
    }

    q.markModified('options');
    await q.save();

    console.log("Q50 updated successfully.");
    await mongoose.disconnect();
}
run();
