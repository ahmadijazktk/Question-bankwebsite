
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

        const qId = '69e141bb92ef514155fdbd9c';
        const q = await Question.findById(qId);

        if (q) {
            console.log("Updating Question (Real Q7): 69e141bb92ef514155fdbd9c");
            q.options.forEach(o => {
                if (o.isCorrect) {
                    // Current messy state from screenshot:
                    // ***STRONGLY*** recommends ELNT low-dose CYC over daily oral CYC
                    // ***CONDITIONALLY \n\n *** recommend ELNT low-dose CYC over high-dose monthly pulse IV regimen

                    let expl = o.explanation;

                    // Fix STRONGLY
                    expl = expl.replace("***STRONGLY*** recommends ELNT low-dose CYC over daily oral CYC",
                        `***${BOLD('STRONGLY')}*** recommends ELNT ( Euro-Lupus Nephritis Trial ) low-dose CYC over daily oral CYC`);

                    // Fix CONDITIONALLY (one line)
                    // It looks like it has triple asterisks and breaks
                    const condPattern = /\*\*\*CONDITIONALLY\s*<br \/><br \/>\s*\*\*\* recommend ELNT low-dose CYC over high-dose monthly pulse IV regimen/gi;
                    const condReplacement = `***${BOLD('CONDITIONALLY')} recommend *** ELNT low-dose CYC over high-dose monthly pulse IV regimen`;

                    // General cleanup if regex fails
                    expl = expl.replace(/\*\*\*CONDITIONALLY\s*<br \/><br \/>\s*\*\*\*/g, "***CONDITIONALLY***");
                    expl = expl.replace("***CONDITIONALLY*** recommend", `***${BOLD('CONDITIONALLY')} recommend ***`);

                    // Manual override just in case
                    if (!expl.includes("Euro-Lupus")) {
                        expl = expl.replace("ELNT low-dose CYC over daily oral CYC", "ELNT ( Euro-Lupus Nephritis Trial ) low-dose CYC over daily oral CYC");
                    }

                    o.explanation = expl;
                }
            });

            q.markModified('options');
            await q.save();
            console.log("Save complete for 69e141bb92ef514155fdbd9c.");
        }
        await mongoose.disconnect();
    } catch (err) { console.error(err); }
}
run();
