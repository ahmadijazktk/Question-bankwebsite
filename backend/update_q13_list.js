
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

        const qId = '69e141bb92ef514155fdbd97';
        const q = await Question.findById(qId);

        if (q) {
            console.log("Updating Question 13...");
            const newExpl = `-MMF + belimumab<br />` +
                `...or<br />` +
                `-MMF + CNI (calcineurin inhibitor)<br />` +
                `...or<br />` +
                `-Low dose CYC (Euro-Lupus Nephritis Trial) + belimumab (MMF substituted for CYC after CYC course complete)<br /><br />` +
                `Any of the above choices are ${BOLD('CONDITIONALLY RECOMMENDED')}`;

            q.options.forEach(o => {
                if (o.isCorrect) {
                    o.explanation = newExpl;
                }
            });

            q.markModified('options');
            await q.save();
            console.log("Save complete.");
        }
        await mongoose.disconnect();
    } catch (err) { console.error(err); }
}
run();
