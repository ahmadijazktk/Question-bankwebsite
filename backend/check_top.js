
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const QuestionSchema = new mongoose.Schema({}, { strict: false });
const Question = mongoose.models.Question || mongoose.model('Question', QuestionSchema);

async function checkTopThree() {
    await mongoose.connect(process.env.MONGO_URI);

    // Non-trial questions, newest first
    const regQs = await Question.find({ isFreeTrialQuestion: { $ne: true } }).sort({ createdAt: -1 }).limit(10);

    regQs.forEach((q, i) => {
        console.log(`\n--- [REGULAR] POSITION ${i + 1} ---`);
        console.log(`ID: ${q._id}`);
        console.log(`Text: ${q.text}`);
        console.log(`Image: ${q.image}`);
        console.log(`Image2: ${q.image2}`);
        console.log(`Explanation: ${q.options[0]?.explanation}`);
        console.log(`Category: ${q.category}`);
    });

    // Trial questions
    const trialQs = await Question.find({ isFreeTrialQuestion: true }).sort({ freeTrialOrder: 1 }).limit(5);
    trialQs.forEach((q, i) => {
        console.log(`\n--- [TRIAL] ORDER ${q.freeTrialOrder} ---`);
        console.log(`ID: ${q._id}`);
        console.log(`Text: ${q.text}`);
        console.log(`Explanation: ${q.options[0]?.explanation}`);
    });

    await mongoose.disconnect();
}
checkTopThree();
