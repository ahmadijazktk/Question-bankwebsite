
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

    // Q26 = position 25 (0-indexed), sorted by createdAt desc, non-trial
    const qs = await Question.find({ isFreeTrialQuestion: { $ne: true } })
        .sort({ createdAt: -1 })
        .skip(25)
        .limit(1);

    if (!qs.length) {
        console.log("Not found");
    } else {
        const q = qs[0];
        console.log(`ID: ${q._id}`);
        console.log(`Text: ${q.text}`);
        q.options.forEach((o, i) => {
            if (o.isCorrect) {
                console.log(`\n--- Correct Opt ${i}: ${o.text} ---`);
                console.log(`Explanation: ${o.explanation}`);
            }
        });
    }

    await mongoose.disconnect();
}
run();
