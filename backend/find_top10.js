
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const QuestionSchema = new mongoose.Schema({}, { strict: false });
const Question = mongoose.model('Question', QuestionSchema);

async function findRecentQuestions() {
    await mongoose.connect(process.env.MONGO_URI);
    // Find all questions created recently (since March 3)
    const qs = await Question.find({}).sort({ createdAt: -1 }).limit(10);
    console.log(`Checking Top 10 recent questions:`);
    qs.forEach((q, i) => {
        console.log(`\nQuestion ${i + 1}:`);
        console.log(`ID: ${q._id}`);
        console.log(`Text: ${q.text?.substring(0, 50)}`);
        console.log(`Image: ${q.image}`);
        console.log(`Created: ${q.createdAt}`);
    });

    await mongoose.disconnect();
}
findRecentQuestions();
