
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const QuestionSchema = new mongoose.Schema({}, { strict: false });
const Question = mongoose.model('Question', QuestionSchema);

async function checkTrial() {
    await mongoose.connect(process.env.MONGO_URI);
    const qs = await Question.find({ isFreeTrialQuestion: true }).sort({ freeTrialOrder: 1 });
    qs.forEach(q => {
        console.log(`Order: ${q.freeTrialOrder} | ID: ${q._id} | Text: ${q.text.substring(0, 100).replace(/\n/g, ' ')}`);
    });
    await mongoose.disconnect();
}
checkTrial();
