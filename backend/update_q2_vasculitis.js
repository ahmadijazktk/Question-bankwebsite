
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const QuestionSchema = new mongoose.Schema({ options: Array }, { strict: false });
const Question = mongoose.models.Question || mongoose.model('Question', QuestionSchema);

const BOLD = (text) => `<strong style='color:#000;font-weight:900;'>${text}</strong>`;

async function run() {
    try {
        console.log("Searching for Q2 via position...");
        await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 60000 });

        // Q2 at index 1
        const qs = await Question.find({ isFreeTrialQuestion: { $ne: true } })
            .sort({ createdAt: -1 })
            .skip(1)
            .limit(1);

        if (qs.length) {
            const q = qs[0];
            console.log(`Found Q2: ${q._id} | Text: ${q.text.substring(0, 50)}`);

            const newExpl = `According to ACR For vasculitis attributed to active SLE: <br />\u2026We ${BOLD('CONDITIONALLY RECOMMEND')} initial therapy with pulse/high-dose glucocorticoid taper and conventional (IV CYC, MPAA, AZA) or biologic (anti-CD 20 therapy, belimumab, anifrolumab) immunosuppressive therapy over glucocorticoid monotherapy alone; <br />\u2026We ${BOLD('CONDITIONALLY RECOMMEND')} IV CYC or anti-CD20 therapy as initial therapy over other immunosuppressive therapies.`;

            q.options.forEach(o => {
                if (o.isCorrect) {
                    o.explanation = newExpl;
                }
            });
            q.markModified('options');
            await q.save();
            console.log("Update successful.");
        } else {
            console.log("Q2 not found at index 1.");
        }
        await mongoose.disconnect();
    } catch (err) {
        console.error("ERROR:", err.message);
    }
}
run();
