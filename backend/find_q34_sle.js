
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const QuestionSchema = new mongoose.Schema({}, { strict: false });
const Question = mongoose.model('Question', QuestionSchema);

async function findq34() {
    await mongoose.connect(process.env.MONGO_URI);

    // Find questions having "prednisone" and "SLE"
    const qs = await Question.find({ text: /prednisone/i, text: /SLE/i });
    console.log("Found: ", qs.length);
    for (let q of qs) {
        console.log(`ID: ${q._id} | Text: ${q.text.substring(0, 100)}...`);
    }

    const qs2 = await Question.find({ "options.explanation": /prednisone/i });
    console.log("\nFound in explanation: ", qs2.length);
    for (let q of qs2) {
        console.log(`ID: ${q._id} | Text: ${q.text.substring(0, 100)}...`);
    }
    await mongoose.disconnect();
}
findq34();
