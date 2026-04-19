
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
    await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 60000 });
    const qs = await Question.find({ isFreeTrialQuestion: { $ne: true } }).sort({ createdAt: -1 }).limit(10);
    qs.forEach((q, i) => console.log(`${i + 1}: ${q._id} | ${q.text.substring(0, 50)}`));
    await mongoose.disconnect();
}
check();
