
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
        await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 60000 });

        console.log("Global fix for ELNT and CYC lines...");
        const qs = await Question.find({ "options.explanation": /ELNT|CONDITIONALLY/i });

        let updateCount = 0;
        for (const q of qs) {
            let changed = false;
            q.options.forEach(o => {
                if (o.explanation) {
                    let expl = o.explanation;

                    // Fix the specific broken lines seen in screenshot
                    if (expl.includes("CONDITIONALLY")) {
                        const original = expl;
                        expl = expl.replace(/\*\*\*CONDITIONALLY\s*<br \/><br \/>\s*\*\*\* recommend/gi, `***${BOLD('CONDITIONALLY')} recommend ***`);
                        expl = expl.replace(/\*\*\*CONDITIONALLY\s+recommend\s+\*\*\*/gi, `***${BOLD('CONDITIONALLY')} recommend ***`);
                        if (expl !== original) changed = true;
                    }

                    if (expl.includes("ELNT") && !expl.includes("Euro-Lupus")) {
                        expl = expl.replace("ELNT low-dose CYC", "ELNT ( Euro-Lupus Nephritis Trial ) low-dose CYC");
                        changed = true;
                    }

                    if (expl.includes("STRONGLY*** recommends")) {
                        expl = expl.replace("STRONGLY*** recommends", `${BOLD('STRONGLY')}*** recommends`);
                        changed = true;
                    }

                    o.explanation = expl;
                }
            });

            if (changed) {
                q.markModified('options');
                await q.save();
                updateCount++;
            }
        }
        console.log(`Updated ${updateCount} questions globally.`);
        await mongoose.disconnect();
    } catch (err) { console.error(err); }
}
run();
