
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const QuestionSchema = new mongoose.Schema({
    createdAt: Date,
    text: String,
    image: String,
    image2: String
}, { strict: false });
const Question = mongoose.models.Question || mongoose.model('Question', QuestionSchema);

async function check() {
    await mongoose.connect(process.env.MONGO_URI);
    const qs = await Question.find().sort({ createdAt: -1 }).limit(50);
    console.log(`Retrieved ${qs.length} questions.`);
    qs.forEach((q, i) => {
        console.log(`${i + 1}. ID: ${q._id} | Text: ${q.text?.substring(0, 30)} | Image: ${q.image}`);
    });
    await mongoose.disconnect();
}

check();
