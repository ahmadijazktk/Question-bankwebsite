
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

    // Q54 = position 53 (0-indexed)
    const qs = await Question.find({ isFreeTrialQuestion: { $ne: true } })
        .sort({ createdAt: -1 })
        .skip(53)
        .limit(1);

    if (!qs.length) {
        console.log("Not found");
    } else {
        const q = qs[0];
        console.log(`ID: ${q._id}`);
        console.log(`Text: ${q.text.substring(0, 100)}...`);
        q.options.forEach((o, i) => {
            if (o.isCorrect) {
                console.log(`\n--- Correct Opt ${i} ---`);
                console.log(`Explanation: ${o.explanation}`);
            }
        });
    }

    await mongoose.disconnect();
}
run();
