
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const QuestionSchema = new mongoose.Schema({}, { strict: false });
const Question = mongoose.model('Question', QuestionSchema);

async function inspectQ() {
    await mongoose.connect(process.env.MONGO_URI);

    const q1 = await Question.findById('69a362f2e212ad97bfa96aae');
    const q2 = await Question.findById('69a362f2e212ad97bfa96ab0');

    console.log("Q1:\n", JSON.stringify({ text: q1?.text, options: q1?.options }, null, 2));
    console.log("Q2:\n", JSON.stringify({ text: q2?.text, options: q2?.options }, null, 2));

    await mongoose.disconnect();
}
inspectQ();
