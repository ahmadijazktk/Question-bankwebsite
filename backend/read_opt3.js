
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const QuestionSchema = new mongoose.Schema({}, { strict: false });
const Question = mongoose.models.Question || mongoose.model('Question', QuestionSchema);

async function run() {
    await mongoose.connect(process.env.MONGO_URI);
    const q = await Question.findById('69a363b3e212ad97bfa96f60');
    if (!q) { console.log("Not found"); await mongoose.disconnect(); return; }

    // Show the correct (option 3) explanation in full
    const correctOpt = q.options[3];
    console.log(`Option 3 text: ${correctOpt?.text}`);
    console.log(`\nFull Explanation:\n${correctOpt?.explanation}`);

    await mongoose.disconnect();
}
run();
