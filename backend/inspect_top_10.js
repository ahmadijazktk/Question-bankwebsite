
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
        await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 20000 });
        const qs = await Question.find({ isFreeTrialQuestion: { $ne: true } }).sort({ createdAt: -1 }).limit(10);

        qs.forEach((q, i) => {
            process.stdout.write(`${i + 1}: ${q._id} | TEXT: ${q.text.substring(0, 80)}\n`);
        });
        await mongoose.disconnect();
    } catch (err) {
        process.stderr.write(err.message);
    }
}
check();
