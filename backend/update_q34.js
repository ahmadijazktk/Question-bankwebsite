
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const QuestionSchema = new mongoose.Schema({}, { strict: false });
const Question = mongoose.model('Question', QuestionSchema);

async function updateQ34() {
    await mongoose.connect(process.env.MONGO_URI);

    const qid = '69a363b2e212ad97bfa96f54';
    const q = await Question.findById(qid);

    if (q && q.options && Array.isArray(q.options)) {
        // Find the correct option
        let correctOpt = q.options.find(o => o.isCorrect === true);
        if (correctOpt) {
            correctOpt.explanation = `"In people with SLE with stable controlled SLE on prednisone >5 mg/day: ...We <strong>STRONGLY RECOMMEND</strong> tapering the prednisone to a dose of ≤5 mg daily (and ideally to zero) within 6 months."\n<br/>\n"In people with SLE: …We <strong>STRONGLY RECOMMEND</strong> routine treatment with HCQ unless contraindicated."\n<br/>\nThese are from the 2025 ACR Guideline for the Treatment of Systemic Lupus Erythematosus (SLE)`;

            await Question.updateOne({ _id: qid }, { $set: { options: q.options } });
            console.log("Successfully updated question!");
        } else {
            console.log("Could not find correct option");
        }
    } else {
        console.log("Question not found or missing options");
    }

    await mongoose.disconnect();
}
updateQ34();
