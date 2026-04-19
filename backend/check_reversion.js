
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const QuestionSchema = new mongoose.Schema({}, { strict: false });
const Question = mongoose.models.Question || mongoose.model('Question', QuestionSchema);

async function check() {
    await mongoose.connect(process.env.MONGO_URI);

    // Check points: Q32, Q28, Q26, Q38
    const checkIndices = [31, 27, 25, 37];

    for (const idx of checkIndices) {
        const q = await Question.find({ isFreeTrialQuestion: { $ne: true } })
            .sort({ createdAt: -1 })
            .skip(idx)
            .limit(1);

        if (q.length) {
            console.log(`\n--- Index ${idx} (Q${idx + 1}) ---`);
            console.log(`ID: ${q[0]._id}`);
            console.log(`Text: ${q[0].text.substring(0, 50)}...`);
            q[0].options.forEach((o, i) => {
                if (o.isCorrect) console.log(`Correct Expl: ${o.explanation}`);
            });
        }
    }

    await mongoose.disconnect();
}
check();
