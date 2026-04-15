
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const QuestionSchema = new mongoose.Schema({
    text: String,
    options: [{
        text: String,
        isCorrect: Boolean,
        explanation: String
    }]
}, { strict: false });
const Question = mongoose.models.Question || mongoose.model('Question', QuestionSchema);

async function run() {
    await mongoose.connect(process.env.MONGO_URI);

    // 1. Inspect Question 72 (position 71)
    const qs = await Question.find({ isFreeTrialQuestion: { $ne: true } })
        .sort({ createdAt: -1 })
        .skip(71)
        .limit(1);

    if (qs.length) {
        console.log(`\n--- Question 72 (ID: ${qs[0]._id}) ---`);
        console.log(`Text: ${qs[0].text.substring(0, 100)}...`);
        qs[0].options.forEach((o, i) => {
            console.log(`Opt ${i} (${o.isCorrect ? 'Correct' : 'Wrong'}): ${o.explanation || 'No explanation'}`);
        });
    }

    // 2. Global cleanup
    const allQs = await Question.find({});
    let totalUpdated = 0;
    const target = /According to the RheumZoom dataset\.?\s*/gi;

    for (const q of allQs) {
        let changed = false;
        if (q.options) {
            q.options.forEach(opt => {
                if (opt.explanation && target.test(opt.explanation)) {
                    opt.explanation = opt.explanation.replace(target, "").trim();
                    // If explanation is now blank, set a default "Correct." or similar if it was the correct one
                    // or just leave it blank if that's what's preferred.
                    // Given the user said "remove it", I'll just trim it.
                    if (opt.explanation === "" && opt.isCorrect) {
                        opt.explanation = "Correct Answer.";
                    }
                    changed = true;
                }
            });
        }

        if (changed) {
            q.markModified('options');
            await q.save();
            totalUpdated++;
        }
    }

    console.log(`\n\nFINISHED. Removed phrase from ${totalUpdated} total questions.`);

    await mongoose.disconnect();
}
run();
