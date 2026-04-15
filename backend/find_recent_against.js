
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const QuestionSchema = new mongoose.Schema({}, { strict: false });
const Question = mongoose.model('Question', QuestionSchema);

async function findRecentAgainst() {
    await mongoose.connect(process.env.MONGO_URI);

    const qs = await Question.find({ "options.explanation": /AGAINST/i }).sort({ createdAt: -1 }).limit(20);

    console.log(`Found ${qs.length} recent AGAINST questions`);
    qs.forEach((q, i) => {
        console.log(`\nMatch ${i + 1}:`);
        console.log(`ID: ${q._id}`);
        console.log(`Text: ${q.text.substring(0, 50)}`);
        q.options.forEach(o => {
            if (o.explanation && o.explanation.toUpperCase().includes('AGAINST')) {
                console.log(`Expl: ${o.explanation}`);
            }
        });
    });

    await mongoose.disconnect();
}
findRecentAgainst();
