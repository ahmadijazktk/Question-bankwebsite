
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const QuestionSchema = new mongoose.Schema({}, { strict: false });
const Question = mongoose.model('Question', QuestionSchema);

async function findOrdered() {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("Fetching questions in some order...");
    const qs = await Question.find({}).sort({ _id: 1 });

    // Check indices around 60 (0-indexed 60 is question 61)
    for (let i = 59; i <= 63; i++) {
        const q = qs[i];
        if (q) {
            console.log(`\nIndex ${i} (Question ${i + 1}):`);
            console.log(`ID: ${q._id}`);
            console.log(`Text: ${q.text.substring(0, 100)}`);
            q.options.forEach(o => console.log(`Expl: ${o.explanation}`));
        }
    }

    await mongoose.disconnect();
}
findOrdered();
