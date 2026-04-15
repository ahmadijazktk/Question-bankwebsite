
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const QuestionSchema = new mongoose.Schema({}, { strict: false });
const Question = mongoose.model('Question', QuestionSchema);

async function dump() {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        console.log('--- TRIAL QUESTIONS (Sorted by order) ---');
        const trialQs = await Question.find({ isFreeTrialQuestion: true }).sort({ freeTrialOrder: 1 }).limit(50);
        trialQs.forEach(q => {
            console.log(`Order: ${q.freeTrialOrder} | ID: ${q._id} | Img: ${q.image} | Text: ${q.text?.substring(0, 50)}`);
        });

        console.log('\n--- REGULAR QUESTIONS (Newest first) ---');
        const regQs = await Question.find({ isFreeTrialQuestion: { $ne: true } }).sort({ createdAt: -1 }).limit(50);
        regQs.forEach((q, i) => {
            console.log(`${i + 1}: ID: ${q._id} | Img: ${q.image} | Text: ${q.text?.substring(0, 50)}`);
        });

    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.disconnect();
    }
}
dump();
