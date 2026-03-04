
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const QuestionSchema = new mongoose.Schema({
    text: String,
    image: String,
    image2: String
}, { strict: false });
const Question = mongoose.models.Question || mongoose.model('Question', QuestionSchema);

async function check() {
    await mongoose.connect(process.env.MONGO_URI);
    const q1 = await Question.findById('69a362f0e212ad97bfa96a9a');
    const q2 = await Question.findById('69a611ce26d4e93901b3141e');
    console.log("Q1:", JSON.stringify(q1, null, 2));
    console.log("Q2:", JSON.stringify(q2, null, 2));
    await mongoose.disconnect();
}

check();
