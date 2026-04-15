
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const QuestionSchema = new mongoose.Schema({
    text: String
}, { strict: false });
const Question = mongoose.models.Question || mongoose.model('Question', QuestionSchema);

async function run() {
    await mongoose.connect(process.env.MONGO_URI);

    const qs = await Question.find({ isFreeTrialQuestion: { $ne: true } })
        .sort({ createdAt: -1 })
        .skip(65)
        .limit(2);

    qs.forEach((q, i) => {
        console.log(`\n\nQ${66 + i} ID: ${q._id}`);
        // Log in chunks to avoid terminal truncation
        let t = q.text || "";
        for (let i = 0; i < t.length; i += 100) {
            console.log(t.substring(i, i + 100));
        }
    });

    await mongoose.disconnect();
}
run();
