
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const QuestionSchema = new mongoose.Schema({}, { strict: false });
const Question = mongoose.model('Question', QuestionSchema);

async function findIdenticalWhat() {
    await mongoose.connect(process.env.MONGO_URI);
    const qs = await Question.find({ text: 'What do you do?' });
    console.log(`Checking ${qs.length} 'What do you do?' questions.`);

    const map = new Map();
    qs.forEach(q => {
        // Use explanation and images as signature
        const signature = `${q.options[0]?.explanation}|${q.summary}`;
        if (!map.has(signature)) {
            map.set(signature, []);
        }
        map.get(signature).push(q);
    });

    for (const [sig, list] of map.entries()) {
        if (list.length > 1) {
            console.log(`\nDuplicate Set (Size ${list.length}):`);
            console.log(`Signature: ${sig.substring(0, 100)}`);
            list.forEach((q, i) => {
                console.log(`  ${i + 1}: ID: ${q._id} | Image: ${q.image} | Created: ${q.createdAt}`);
            });
        }
    }
    await mongoose.disconnect();
}
findIdenticalWhat();
