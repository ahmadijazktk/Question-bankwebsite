
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const QuestionSchema = new mongoose.Schema({}, { strict: false });
const Question = mongoose.models.Question || mongoose.model('Question', QuestionSchema);

async function run() {
    await mongoose.connect(process.env.MONGO_URI);

    // Q66 = pos 65, Q67 = pos 66 (0-indexed)
    const qs = await Question.find({ isFreeTrialQuestion: { $ne: true } })
        .sort({ createdAt: -1 })
        .skip(65)
        .limit(2);

    if (qs.length < 2) {
        console.log(`Found only ${qs.length} questions.`);
    }

    qs.forEach((q, idx) => {
        const actualPos = 66 + idx;
        console.log(`\n--- Question ${actualPos} (ID: ${q._id}) ---`);
        console.log(`Text: ${q.text}`);
    });

    await mongoose.disconnect();
}
run();
