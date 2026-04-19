
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
    let connected = false;
    let attempts = 0;
    while (!connected && attempts < 10) {
        try {
            attempts++;
            console.log(`Connection attempt ${attempts}...`);
            await mongoose.connect(process.env.MONGO_URI, {
                serverSelectionTimeoutMS: 30000,
                connectTimeoutMS: 30000
            });
            connected = true;
            console.log("Connected!");
        } catch (err) {
            console.log("Failed attempt:", err.message);
            if (attempts >= 10) throw err;
            await new Promise(r => setTimeout(r, 2000));
        }
    }

    const qId = '69e141bb92ef514155fdbd9c';
    const q = await Question.findById(qId);

    if (q) {
        console.log("Updating Question 7...");
        q.options.forEach(o => {
            if (o.isCorrect) {
                o.text = `***${BOLD('STRONGLY RECOMMEND')}*** ELNT ( Euro-Lupus Nephritis Trial ) low-dose CYC over daily oral CYC`;
                o.explanation = `***${BOLD('CONDITIONALLY RECOMMEND')}*** ELNT low-dose CYC over high-dose monthly pulse IV regimen`;
            }
        });
        q.markModified('options');
        await q.save();
        console.log("Done.");
    }
    await mongoose.disconnect();
}
run().catch(e => console.error(e));
