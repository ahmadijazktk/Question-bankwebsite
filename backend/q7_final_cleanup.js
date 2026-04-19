
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
            console.log("Cleaning up Q7 HTML tags...");
            q.options.forEach(o => {
                if (o.isCorrect) {
                    // Simplified format without extra tags if unnecessary, but keeping the requested style
                    o.text = `***${BOLD('STRONGLY RECOMMEND')}*** ELNT ( Euro-Lupus Nephritis Trial ) low-dose CYC over daily oral CYC`;
                    o.explanation = `***${BOLD('CONDITIONALLY RECOMMEND')}*** ELNT low-dose CYC over high-dose monthly pulse IV regimen`;
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
