
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

        const qId = '69e141bb92ef514155fdbd95';
        const q = await Question.findById(qId);

        if (q) {
            console.log("Updating Question 7...");
            let changed = false;

            q.options.forEach(o => {
                if (o.isCorrect) {
                    let expl = o.explanation;

                    // 1. One line for conditionally recommend
                    // Find the messy conditionally part and replace it
                    const target1 = /\*\*\*CONDITIONALLY<br \/><br \/>\*\*\* recommend ELNT low-dose CYC over high-dose monthly pulse IV regimen/gi;
                    const target1_v2 = /\*\*\*CONDITIONALLY\s*recommend\s*\*\*\*\s*ELNT low-dose CYC over high-dose monthly pulse IV regimen/gi;

                    expl = expl.replace(/\*\*\*CONDITIONALLY<br \/><br \/>\*\*\*/g, "***CONDITIONALLY***")
                        .replace(/\*\*\*CONDITIONALLY\s+recommend\s+\*\*\*/g, "***CONDITIONALLY recommend***");

                    // Manual replacement based on user string
                    if (expl.includes("ELNT low-dose CYC over high-dose monthly pulse IV regimen")) {
                        expl = expl.replace(/.*?ELNT low-dose CYC over high-dose monthly pulse IV regimen/,
                            `***${BOLD('CONDITIONALLY')} recommend *** ELNT low-dose CYC over high-dose monthly pulse IV regimen`);
                    }

                    // 2. STRONGLY part
                    if (expl.includes("***STRONGLY*** recommends ELNT low-dose CYC over daily oral CYC")) {
                        expl = expl.replace("***STRONGLY*** recommends ELNT low-dose CYC over daily oral CYC",
                            `***${BOLD('STRONGLY')}*** recommends ELNT ( Euro-Lupus Nephritis Trial ) low-dose CYC over daily oral CYC`);
                    }

                    if (o.explanation !== expl) {
                        o.explanation = expl;
                        changed = true;
                    }
                }
            });

            if (changed) {
                q.markModified('options');
                await q.save();
                console.log("Save complete.");
            } else {
                console.log("No changes detected in explanation.");
                // Let's force it anyway just in case regex failed
                const qForce = await Question.findById(qId);
                qForce.options.forEach(o => {
                    if (o.isCorrect) {
                        o.explanation = o.explanation.replace(/CONDITIONALLY<br \/><br \/>/g, "CONDITIONALLY ");
                        o.explanation = o.explanation.replace("ELNT low-dose CYC", "ELNT ( Euro-Lupus Nephritis Trial ) low-dose CYC");
                    }
                });
                qForce.markModified('options');
                await qForce.save();
                console.log("Forced update applied.");
            }
        }
        await mongoose.disconnect();
    } catch (err) { console.error(err); }
}
run();
