
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const QuestionSchema = new mongoose.Schema({}, { strict: false });
const Question = mongoose.model('Question', QuestionSchema);

async function findStrongly() {
    await mongoose.connect(process.env.MONGO_URI);
    const qs = await Question.find({});

    // We'll search in explanation and text for "STRONGLY recommend" exactly, or just case-insensitive
    const matches = qs.filter(q => {
        return (q.text && q.text.includes('STRONGLY recommend')) ||
            (q.options && q.options.some(o => o.explanation && o.explanation.includes('STRONGLY recommend')));
    });

    console.log(`Found ${matches.length} questions containing 'STRONGLY recommend'`);
    matches.forEach((q, i) => {
        console.log(`\n--- Match ${i + 1} ---`);
        console.log(`ID: ${q._id}`);
        console.log(`Question Text: ${q.text?.substring(0, 100).replace(/\n/g, ' ')}...`);
        q.options?.forEach((o, j) => {
            if (o.explanation?.includes('STRONGLY recommend')) {
                console.log(`Opt ${j + 1} Expl Context: ${o.explanation.replace(/\n/g, ' ')}`);
            }
        });
    });

    await mongoose.disconnect();
}
findStrongly();
