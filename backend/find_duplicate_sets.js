
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

    const map = new Map();

    questions.forEach(q => {
        // Use text and images as the key
        const key = `${q.text}|${q.image}|${q.image2}`;
        if (!map.has(key)) {
            map.set(key, []);
        }
        map.get(key).push(q);
    });

    let duplicateCount = 0;
    for (const [key, qs] of map.entries()) {
        if (qs.length > 1) {
            duplicateCount++;
            console.log(`\nDuplicate Set ${duplicateCount}:`);
            console.log(`Key: ${key.substring(0, 100)}...`);
            qs.forEach((q, i) => {
                console.log(`  ${i + 1}: ID: ${q._id} | Created: ${q.createdAt}`);
            });
        }
    }

    console.log(`\nFound ${duplicateCount} sets of duplicates.`);

    await mongoose.disconnect();
}

findDuplicates();
