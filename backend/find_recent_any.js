
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const QuestionSchema = new mongoose.Schema({}, { strict: false });
const Question = mongoose.model('Question', QuestionSchema);

async function findRecent() {
    await mongoose.connect(process.env.MONGO_URI);
    const qs = await Question.find({ text: /.*/ }).sort({ createdAt: -1 }).limit(10);
    qs.forEach((q, i) => {
        console.log(`Recent ${i + 1}: ID: ${q._id} | Text: ${q.text?.substring(0, 30)} | Image: ${q.image} | Image2: ${q.image2}`);
    });
    await mongoose.disconnect();
}
findRecent();
