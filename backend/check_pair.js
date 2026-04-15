
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const QuestionSchema = new mongoose.Schema({}, { strict: false });
const Question = mongoose.models.Question || mongoose.model('Question', QuestionSchema);

async function checkPair() {
    await mongoose.connect(process.env.MONGO_URI);
    const q1 = await Question.findById('69a362f1e212ad97bfa96a9c');
    const q2 = await Question.findById('69a362f4e212ad97bfa96ac4');

    console.log('Q1:', JSON.stringify({
        text: q1.text,
        summary: q1.summary,
        image: q1.image,
        image2: q1.image2,
        options: q1.options.map(o => o.explanation)
    }, null, 2));

    console.log('Q2:', JSON.stringify({
        text: q2.text,
        summary: q2.summary,
        image: q2.image,
        image2: q2.image2,
        options: q2.options.map(o => o.explanation)
    }, null, 2));

    await mongoose.disconnect();
}
checkPair();
