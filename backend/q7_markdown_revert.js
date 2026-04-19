
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const QuestionSchema = new mongoose.Schema({ options: Array }, { strict: false });
const Question = mongoose.models.Question || mongoose.model('Question', QuestionSchema);

async function run() {
    let connected = false;
    let attempts = 0;
    while (!connected && attempts < 5) {
        try {
            attempts++;
            await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 30000 });
            connected = true;
        } catch (err) {
            if (attempts >= 5) throw err;
            await new Promise(r => setTimeout(r, 1000));
        }
    }

    const qId = '69e141bb92ef514155fdbd9c';
    const q = await Question.findById(qId);

    if (q) {
        console.log("Reverting Q7 to plain markdown bolding...");
        q.options.forEach(o => {
            if (o.isCorrect) {
                // Using plain *** instead of <strong> tags
                o.text = `***STRONGLY RECOMMEND*** ELNT ( Euro-Lupus Nephritis Trial ) low-dose CYC over daily oral CYC`;

                // Explanation can still use tags OR markdown, I'll use both for safety
                o.explanation = `***CONDITIONALLY RECOMMEND*** ELNT low-dose CYC over high-dose monthly pulse IV regimen`;
            }
        });
        q.markModified('options');
        await q.save();
        console.log("Success.");
    }
    await mongoose.disconnect();
}
run().catch(e => console.error(e));
