
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const QuestionSchema = new mongoose.Schema({
    isFreeTrialQuestion: Boolean,
    freeTrialOrder: Number
}, { strict: false });
const Question = mongoose.models.Question || mongoose.model('Question', QuestionSchema);

async function check() {
    await mongoose.connect(process.env.MONGO_URI);
    const qs = await Question.find({ isFreeTrialQuestion: true }).sort('freeTrialOrder');
    console.log(`Trial questions: ${qs.length}`);
    qs.forEach(q => {
        console.log(`Order: ${q.freeTrialOrder} | ID: ${q._id} | Text: ${q.text?.substring(0, 30)}`);
    });

    // Check if there are questions that ARE trial but NO order
    const noOrder = await Question.find({ isFreeTrialQuestion: true, freeTrialOrder: { $exists: false } });
    console.log(`Trial questions with no order: ${noOrder.length}`);
    noOrder.forEach(q => {
        console.log(`ID: ${q._id} | Text: ${q.text?.substring(0, 30)}`);
    });

    await mongoose.disconnect();
}

check();
