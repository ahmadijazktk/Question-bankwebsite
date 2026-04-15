
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const QuestionSchema = new mongoose.Schema({}, { strict: false });
const Question = mongoose.model('Question', QuestionSchema);

async function findQ53() {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to DB");

    // Attempt 1: Just search 'strongly recommend' in options text or explanation
    const qs = await Question.find({
        $or: [
            { "options.text": /strongly recommend/i },
            { "options.explanation": /strongly recommend/i },
            { text: /strongly recommend/i }
        ]
    });

    console.log(`Found ${qs.length} questions matching 'strongly recommend'.`);

    qs.forEach((q, i) => {
        console.log(`\n--- Match ${i + 1} ---`);
        console.log(`ID: ${q._id}`);
        console.log(`Text: ${q.text.substring(0, 100)}...`);
        q.options?.forEach((o, j) => {
            if (o.text?.toLowerCase().includes('strongly recommend') || o.explanation?.toLowerCase().includes('strongly recommend')) {
                console.log(`Option ${j + 1} text: ${o.text?.substring(0, 100)}`);
                console.log(`Option ${j + 1} expl: ${o.explanation?.substring(0, 100)}`);
            }
        });
    });

    await mongoose.disconnect();
}
findQ53();
