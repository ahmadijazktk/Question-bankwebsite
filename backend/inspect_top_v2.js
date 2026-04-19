
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const QuestionSchema = new mongoose.Schema({ text: String }, { strict: false });
const Question = mongoose.models.Question || mongoose.model('Question', QuestionSchema);

async function check() {
    try {
        await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 60000 });
        const qs = await Question.find({ isFreeTrialQuestion: { $ne: true } }).sort({ createdAt: -1 }).limit(10);

        for (let i = 0; i < qs.length; i++) {
            console.log(`${i + 1}: ${qs[i]._id} | TEXT: ${qs[i].text.substring(0, 100)}`);
        }
        await mongoose.disconnect();
    } catch (err) {
        console.error("CONN ERROR:", err.message);
    }
}
check();
