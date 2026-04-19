
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const QuestionSchema = new mongoose.Schema({ text: String, options: Array }, { strict: false });
const Question = mongoose.models.Question || mongoose.model('Question', QuestionSchema);

const BOLD = (text) => `<strong style='color:#000;font-weight:900;'>${text}</strong>`;

async function restore() {
    try {
        await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 30000 });
        const allQs = await Question.find({});
        let updateCount = 0;

        for (const q of allQs) {
            let changed = false;
            const text = q.text || "";

            // Q53 & Q54: renal biopsy threshold
            if (text.includes("tricky question") && (text.includes("0.5g") || text.includes("proteinuria"))) {
                const newExpl = `This is another tricky question just to help you memorize. It is similar to another question with only some numbers changed. Essentially if routine screening shows >0.5g proteinuria, order renal biopsy (***according to ACR, ${BOLD('CONDITIONALLY RECOMMENDED')}).<br /><br />"In people with SLE who have proteinuria >0.5 g/g and/or impaired kidney function not otherwise explained , we ${BOLD('CONDITIONALLY RECOMMEND')} performing a kidney biopsy.`;
                q.options.forEach(o => { if (o.isCorrect) o.explanation = newExpl; });
                changed = true;
            }

            // Q73: GCA biopsy
            if (text.includes("suspected GCA") && text.includes("biopsy")) {
                const newExpl = `For patients with suspected GCA, we ${BOLD('CONDITIONALLY RECOMMEND')} obtaining a temporal artery biopsy specimen within 2 weeks of starting oral GCs over waiting longer than 2 weeks for a biopsy.`;
                q.options.forEach(o => { if (o.isCorrect) o.explanation = newExpl; });
                changed = true;
            }

            // Q63-65: ILD / strongly recommend against
            if (q.options) {
                q.options.forEach(o => {
                    if (o.explanation && /strongly recommend against/i.test(o.explanation)) {
                        o.explanation = o.explanation.replace(/strongly recommend against/gi, BOLD('STRONGLY RECOMMEND AGAINST'));
                        changed = true;
                    }
                });
            }

            // Additional check for STRONGLY vs CONDITIONALLY throughout the DB
            q.options.forEach(o => {
                if (o.explanation) {
                    const original = o.explanation;
                    o.explanation = o.explanation.replace(/CONDITIONALLY RECOMMEND/g, BOLD('CONDITIONALLY RECOMMEND'))
                        .replace(/STRONGLY RECOMMEND /g, BOLD('STRONGLY RECOMMEND '))
                        .replace(/STRONGLY RECOMMENDED/g, BOLD('STRONGLY RECOMMENDED'));
                    if (o.explanation !== original) changed = true;
                }
            });

            if (changed) {
                q.markModified('options');
                await q.save();
                updateCount++;
            }
        }
        console.log(`Final Sweep complete. Updated ${updateCount} questions.`);
        await mongoose.disconnect();
    } catch (err) { console.error(err); }
}
restore();
