
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const QuestionSchema = new mongoose.Schema({}, { strict: false });
const Question = mongoose.model('Question', QuestionSchema);

async function checkRec() {
    await mongoose.connect(process.env.MONGO_URI);
    const qs = await Question.find({}).sort({ createdAt: -1 }).limit(10);
    qs.forEach((q, i) => {
        console.log(`\n--- Item ${i + 1} ---`);
        console.log(`ID: ${q._id}`);
        console.log(`Text: ${q.text}`);
        console.log(`Image 1: ${q.image}`);
        console.log(`Image 2: ${q.image2}`);
        console.log(`Summary: ${q.summary}`);
    });
    await mongoose.disconnect();
}
checkRec();
