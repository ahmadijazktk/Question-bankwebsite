
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

    // Q63 = pos 62, Q64 = pos 63, Q65 = pos 64 (0-indexed)
    const qs = await Question.find({ isFreeTrialQuestion: { $ne: true } })
        .sort({ createdAt: -1 })
        .skip(62)
        .limit(3);

    if (qs.length < 3) {
        console.log(`Found only ${qs.length} questions.`);
    }

    qs.forEach((q, idx) => {
        const actualPos = 63 + idx;
        console.log(`\n--- Question ${actualPos} (ID: ${q._id}) ---`);
        console.log(`Text: ${q.text.substring(0, 50)}...`);
        q.options.forEach((o, i) => {
            if (o.isCorrect) {
                console.log(`[Correct Opt ${i}] Explanation: ${o.explanation}`);
            }
        });
    });

    await mongoose.disconnect();
}
run();
