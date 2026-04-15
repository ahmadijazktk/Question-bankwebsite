
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const QuestionSchema = new mongoose.Schema({}, { strict: false });
const Question = mongoose.models.Question || mongoose.model('Question', QuestionSchema);

const DARK_BOLD = (text) => `<strong style='color:#000;font-weight:900;'>${text}</strong>`;

async function run() {
    await mongoose.connect(process.env.MONGO_URI);

    // Q63, Q64, Q65 IDs from inspection or search
    const ids = ['69a363afe212ad97bfa96f1e', '69a363afe212ad97bfa96f1c', '69a363afe212ad97bfa96f1a'];
    const qs = await Question.find({ _id: { $in: ids } });

    for (const q of qs) {
        let changed = false;

        // Question 63 and 64: bold STRONGLY RECOMMEND AGAINST
        if (q._id.toString() === '69a363afe212ad97bfa96f1e' || q._id.toString() === '69a363afe212ad97bfa96f1c') {
            q.options.forEach(o => {
                if (o.explanation && /strongly recommend against/i.test(o.explanation)) {
                    o.explanation = o.explanation.replace(/strongly recommend against/gi, DARK_BOLD('STRONGLY RECOMMEND AGAINST'));
                    changed = true;
                }
            });
        }

        // Question 65: Update answer text
        if (q._id.toString() === '69a363afe212ad97bfa96f1a') {
            const newExpl =
                `"For people with SSc-ILD and MCTD-ILD, we ${DARK_BOLD('CONDITIONALLY RECOMMEND')} tocilizumab as a first-line ILD treatment option."<br /><br />` +
                `"For people with SSc-ILD, we ${DARK_BOLD('CONDITIONALLY RECOMMEND')} nintedanib as a first-line ILD treatment option."`;

            q.options.forEach(o => {
                if (o.isCorrect) {
                    o.explanation = newExpl;
                    changed = true;
                }
            });
        }

        if (changed) {
            q.markModified('options');
            await q.save();
            console.log(`Updated Question ID: ${q._id}`);
        }
    }

    await mongoose.disconnect();
}
run();
