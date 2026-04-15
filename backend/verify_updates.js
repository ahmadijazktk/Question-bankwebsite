
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const QuestionSchema = new mongoose.Schema({}, { strict: false });
const Question = mongoose.model('Question', QuestionSchema);

async function verifyUpdates() {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("=== Verifying Question 34 ===");
    const q34 = await Question.findById('69a363b2e212ad97bfa96f54');
    if (q34) {
        console.log(`Text: ${q34.text.substring(0, 100)}...`);
        const correctOpt = q34.options?.find(o => o.isCorrect === true);
        console.log(`Explanation:\n${correctOpt?.explanation}\n`);
    }

    console.log("=== Verifying Question 38 ===");
    const q38s = await Question.find({ text: /failed two standard therapy courses/i });
    if (q38s.length > 0) {
        // Also the ones updated by ID
        for (let q of q38s) {
            console.log(`ID: ${q._id}`);
            console.log(`Text: ${q.text.substring(0, 100)}...`);
            const correctOpt = q.options?.find(o => o.isCorrect === true);
            console.log(`Explanation:\n${correctOpt?.explanation}\n`);
        }
    }
    const q38s_alt = await Question.find({ "options.explanation": /MMF, belimumab, and CNI/i });
    if (q38s_alt.length > 0) {
        for (let q of q38s_alt) {
            if (!q38s.some(existQ => existQ._id.toString() === q._id.toString())) {
                console.log(`ID: ${q._id}`);
                console.log(`Text: ${q.text.substring(0, 100)}...`);
                const correctOpt = q.options?.find(o => o.isCorrect === true);
                console.log(`Explanation:\n${correctOpt?.explanation}\n`);
            }
        }
    }

    console.log("=== Verifying Question 53 ('STRONGLY') ===");
    const q53 = await Question.findById('69a363b0e212ad97bfa96f2c');
    if (q53) {
        console.log(`Text: ${q53.text.substring(0, 100)}...`);
        const correctOpt = q53.options?.find(o => o.isCorrect === true);
        console.log(`Explanation:\n${correctOpt?.explanation}\n`);
    }

    await mongoose.disconnect();
}
verifyUpdates();
