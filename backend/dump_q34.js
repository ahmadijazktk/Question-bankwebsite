
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const QuestionSchema = new mongoose.Schema({
    text: String,
    options: [{
        explanation: String
    }]
}, { strict: false });
const Question = mongoose.models.Question || mongoose.model('Question', QuestionSchema);

async function run() {
    await mongoose.connect(process.env.MONGO_URI);
    const q = await Question.findById('69a363b2e212ad97bfa96f58');
    if (q) {
        fs.writeFileSync('q34_result.txt', `TEXT: ${q.text}\nEXPL: ${q.options[0].explanation}`);
    }
    await mongoose.disconnect();
}
run();
