
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
        console.log("Connecting (2min timeout)...");
        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 120000,
            connectTimeoutMS: 120000
        });

        const qId = '69e141bb92ef514155fdbd9c';
        const q = await Question.findById(qId);

        if (q) {
            console.log("Applying final visual match for Question 7...");
            q.options.forEach(o => {
                if (o.isCorrect) {
                    o.text = `***${BOLD('STRONGLY RECOMMEND')}*** ELNT ( Euro-Lupus Nephritis Trial ) low-dose CYC over daily oral CYC`;
                    o.explanation = `***${BOLD('CONDITIONALLY RECOMMEND')}*** ELNT low-dose CYC over high-dose monthly pulse IV regimen`;
                }
            });

            q.markModified('options');
            await q.save();
            console.log("Success.");
        }
    } catch (err) { console.error(err); }
    finally { await mongoose.disconnect(); }
}
run();
