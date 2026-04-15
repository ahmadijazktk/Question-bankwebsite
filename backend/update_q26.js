
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

    const q = await Question.findById('69a363b3e212ad97bfa96f68');
    if (!q) { console.log("Not found"); await mongoose.disconnect(); return; }

    const BOLD = (text) => `<strong style='color:#000;font-weight:900;'>${text}</strong>`;

    const newExplanation =
        `Why?<br /><br />` +
        `This is SLE associated transverse myelitis. According to ACR "For active lupus myelitis : \u2026We ${BOLD('CONDITIONALLY RECOMMEND')} initial therapy with pulse/high-dose glucocorticoid and IV CYC over pulse/high-dose glucocorticoid combined with other (non-CYC) immunosuppressive agents."<br /><br />` +
        `***remember this is according to ACR guidelines. I personally may have chosen IV steroids + RTX and have done so in the past with good results. But the above is ${BOLD("CONDITIONALLY REC'D")} by ACR 2025 guidelines.***`;

    // update correct option
    q.options.forEach(o => {
        if (o.isCorrect) {
            o.explanation = newExplanation;
        }
    });

    q.markModified('options');
    await q.save();

    console.log("Q26 updated successfully.");
    console.log("New explanation preview:\n" + newExplanation);

    await mongoose.disconnect();
}
run();
