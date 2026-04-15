
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

    // Q50 = position 49 (0-indexed)
    const qs = await Question.find({ isFreeTrialQuestion: { $ne: true } })
        .sort({ createdAt: -1 })
        .skip(49)
        .limit(1);

    if (!qs.length) {
        console.log("Not found");
    } else {
        const q = qs[0];
        console.log(`ID: ${q._id}`);
        console.log(`Text: ${q.text.substring(0, 100)}...`);
        q.options.forEach((o, i) => {
            console.log(`\n--- Opt ${i} (isCorrect: ${o.isCorrect}) ---`);
            console.log(`Text: ${o.text}`);
            console.log(`Explanation: ${o.explanation}`);
        });
    }

    await mongoose.disconnect();
}
run();
