
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
            console.log("Applying final visual fix for Question 7...");
            q.options.forEach(o => {
                if (o.isCorrect) {
                    // Final layout based on user request
                    const sRec = `***${BOLD('STRONGLY RECOMMEND')}*** ELNT ( Euro-Lupus Nephritis Trial ) low-dose CYC over daily oral CYC`;
                    const cRec = `***${BOLD('CONDITIONALLY RECOMMEND')}*** ELNT low-dose CYC over high-dose monthly pulse IV regimen`;

                    // Constructing the full explanation with spacing
                    o.explanation = `${sRec}<br /><br /><br /><br />${cRec}`;
                }
            });

            q.markModified('options');
            await q.save();
            console.log("Success.");
        }
        await mongoose.disconnect();
    } catch (err) { console.error(err); }
}
run();
