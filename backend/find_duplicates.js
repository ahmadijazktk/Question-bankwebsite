
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const QuestionSchema = new mongoose.Schema({}, { strict: false });
const Question = mongoose.model('Question', QuestionSchema);

async function findDuplicates() {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    const questions = await Question.find({});
    console.log(`Total questions: ${questions.length}`);

    const textMap = new Map();
    const duplicates = [];

    questions.forEach(q => {
        const key = `${q.text}|${q.image}|${q.image2}`;
        if (textMap.has(key)) {
            duplicates.push({
                original: textMap.get(key),
                duplicate: q
            });
        } else {
            textMap.set(key, q);
        }
    });

    console.log(`Found ${duplicates.length} duplicate pairs.`);

    duplicates.forEach((pair, i) => {
        console.log(`\nDuplicate ${i + 1}:`);
        console.log(`Original: ${pair.original._id} | Text: ${pair.original.text?.substring(0, 50)}...`);
        console.log(`Duplicate: ${pair.duplicate._id} | Text: ${pair.duplicate.text?.substring(0, 50)}...`);
    });

    await mongoose.disconnect();
}

findDuplicates();
