
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const QuestionSchema = new mongoose.Schema({}, { strict: false });
const Question = mongoose.model('Question', QuestionSchema);

async function find61_62() {
    await mongoose.connect(process.env.MONGO_URI);

    // Most lists are sorted by createdAt ascending
    const qs = await Question.find({}).sort({ createdAt: 1 });

    [60, 61, 62].forEach(i => {
        const q = qs[i];
        if (q) {
            console.log(`\nQUESTION ${i + 1}:`);
            console.log(`ID: ${q._id}`);
            console.log(`Text: ${q.text.substring(0, 100)}`);
            q.options.forEach(o => console.log(`Expl: ${o.explanation}`));
        }
    });

    await mongoose.disconnect();
}
find61_62();
