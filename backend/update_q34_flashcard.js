
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

    // Update question text to show placeholders
    q.text = "To minimize retinal toxicity, we conditionally recommend a long-term average daily HCQ dose goal of {{.....}} over a dose goal of {{.....}}";

    // Update explanation (revealed answer) to show the values
    // Using the user's requested formatting
    const newExplanation = "To minimize retinal toxicity, we conditionally recommend a long-term average daily HCQ dose goal of {{c1:: ≤5 mg/kg}} over a dose goal of {{c1:: >5 mg/kg}}";

    q.options.forEach(o => {
        if (o.isCorrect) {
            o.explanation = newExplanation;
        }
    });

    q.markModified('options');
    await q.save();

    console.log("Q34 updated successfully.");
    await mongoose.disconnect();
}
run();
