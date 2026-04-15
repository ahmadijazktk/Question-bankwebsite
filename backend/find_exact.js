
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const QuestionSchema = new mongoose.Schema({}, { strict: false });
const Question = mongoose.model('Question', QuestionSchema);

async function findExactStrings() {
    await mongoose.connect(process.env.MONGO_URI);

    const qs = await Question.find({});

    for (let q of qs) {
        if (!q.options) continue;
        for (let o of q.options) {
            if (o.explanation) {
                if (o.explanation.includes('Strongly recommend AGAINST') || o.explanation.includes("STRONGLY REC'D AGAINST")) {
                    console.log(`\nID: ${q._id}`);
                    console.log(`Match: ${o.explanation}`);
                }
            }
        }
    }

    await mongoose.disconnect();
}
findExactStrings();
