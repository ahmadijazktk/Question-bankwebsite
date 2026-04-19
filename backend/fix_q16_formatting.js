
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

    const qId = '69e141bb92ef514155fdbd93';
    const q = await Question.findById(qId);

    if (q) {
        console.log("Updating Question 16 (Formatting)...");

        const newExpl = `This is another tricky question just to help you memorize.<br /><br />` +
            `It is similar to another question with only some numbers changed.<br /><br />` +
            `Essentially if routine screening shows >0.5g proteinuria, order renal biopsy (<br /><br />` +
            `***according to ACR, "conditionally rec'd***).<br /><br />` +
            ` "In people with SLE who have proteinuria >0.5 g/g and/or impaired kidney function not otherwise explained , we ${BOLD('CONDITIONALLY RECOMMEND')} performing a kidney biopsy.`;

        q.options.forEach(o => {
            if (o.isCorrect) {
                o.explanation = newExpl;
            }
        });
        q.markModified('options');
        await q.save();
        console.log("Done.");
    } else {
        console.log("Question not found.");
    }

    await mongoose.disconnect();
}
run();
