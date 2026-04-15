
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const QuestionSchema = new mongoose.Schema({}, { strict: false });
const Question = mongoose.model('Question', QuestionSchema);

async function findDupes() {
    await mongoose.connect(process.env.MONGO_URI);
    const questions = await Question.find({});
    console.log(`Checking ${questions.length} questions.`);

    const map = new Map();
    questions.forEach(q => {
        const key = `${q.text}|${q.image}`;
        if (!map.has(key)) map.set(key, []);
        map.get(key).push(q);
    });

    let sets = 0;
    for (const [key, list] of map.entries()) {
        if (list.length > 2) { // Looking for triplets or more maybe? "Question 1, 2, 3 are same"
            sets++;
            console.log(`\nDuplicate Set ${sets} (Size ${list.length}):`);
            console.log(`Key: ${key.substring(0, 100)}`);
            list.forEach((q, i) => {
                console.log(`  ${i + 1}: ID: ${q._id} | Created: ${q.createdAt}`);
            });
        }
    }

    // Also check for just pairs if any of them are at the start of trial
    if (sets === 0) {
        console.log("\nNo triplets found. Checking for pairs...");
        for (const [key, list] of map.entries()) {
            if (list.length > 1) {
                const isTrial = list.some(q => q.isFreeTrialQuestion);
                if (isTrial) {
                    console.log(`\nTrial Duplicate Set:`);
                    console.log(`Key: ${key.substring(0, 100)}`);
                    list.forEach((q, i) => {
                        console.log(`  ${i + 1}: ID: ${q._id} | Order: ${q.freeTrialOrder} | Created: ${q.createdAt}`);
                    });
                }
            }
        }
    }

    await mongoose.disconnect();
}
findDupes();
