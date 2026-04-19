
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
    await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 60000 });

    const qId = '69e141bb92ef514155fdbd95';
    const q = await Question.findById(qId);

    if (q) {
        console.log("Updating Question 7...");
        q.options.forEach(o => {
            if (o.isCorrect) {
                // Hardcoded fix for these specific lines
                o.explanation = o.explanation.replace(/\*\*\*CONDITIONALLY<br \/><br \/>\*\*\* recommend/g, `***${BOLD('CONDITIONALLY')} recommend ***`);
                o.explanation = o.explanation.replace(/CONDITIONALLY\s+recommend\s+/gi, `${BOLD('CONDITIONALLY')} recommend `);

                // Fix the ELNT definition part
                o.explanation = o.explanation.replace("ELNT low-dose CYC over daily oral CYC", "ELNT ( Euro-Lupus Nephritis Trial ) low-dose CYC over daily oral CYC");

                // Ensure bold STRONGLY as well
                o.explanation = o.explanation.replace("STRONGLY recommends", `${BOLD('STRONGLY')} recommends`);
            }
        });
        q.markModified('options');
        await q.save();
        console.log("Done.");
    }
    await mongoose.disconnect();
}
run();
