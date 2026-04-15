
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const QuestionSchema = new mongoose.Schema({}, { strict: false });
const Question = mongoose.model('Question', QuestionSchema);

async function findPerfectClones() {
    await mongoose.connect(process.env.MONGO_URI);
    const qs = await Question.find({});

    const sigMap = new Map();
    qs.forEach(q => {
        // Build a deep signature
        const optionsSig = (q.options || []).map(o => `${o.text}|${o.isCorrect}|${o.explanation}`).sort().join('||');
        const sig = `${q.text}|${q.image}|${q.image2}|${optionsSig}|${q.summary}`;
        if (!sigMap.has(sig)) sigMap.set(sig, []);
        sigMap.get(sig).push(q);
    });

    let sets = 0;
    for (const [sig, list] of sigMap.entries()) {
        if (list.length > 1) {
            sets++;
            console.log(`\nClone Set ${sets} (Size ${list.length}):`);
            console.log(`Text: ${list[0].text?.substring(0, 100)}`);
            list.forEach((q, i) => {
                console.log(`  ${i + 1}: ID: ${q._id} | Created: ${q.createdAt}`);
            });
        }
    }
    await mongoose.disconnect();
}
findPerfectClones();
