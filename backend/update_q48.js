
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

    const q = await Question.findById('69a363b1e212ad97bfa96f3c');
    if (!q) { console.log("Not found"); await mongoose.disconnect(); return; }

    const BOLD = (text) => `<strong style='color:#000;font-weight:900;'>${text}</strong>`;

    const newExplanation =
        `consisting of pulse intravenous glucocorticoids 250-1000 mg methylprednisolone daily x 1-3 days, followed by oral glucocorticoid \u22640.5 mg/kg/day (maximum dose 40 mg/day) with taper and MPAA (ie. MMF) plus CNI.<br /><br />` +
        `***if Class V with <1 g/g , we ${BOLD('CONDITIONALLY RECOMMEND')} treatment with glucocorticoids and/or immunosuppressant therapy (MPAA, AZA, or CNI).`;

    // update correct option
    q.options.forEach(o => {
        if (o.isCorrect) {
            o.explanation = newExplanation;
        }
    });

    q.markModified('options');
    await q.save();

    console.log("Q48 updated successfully.");
    await mongoose.disconnect();
}
run();
