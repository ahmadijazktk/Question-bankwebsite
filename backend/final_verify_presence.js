
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const QuestionSchema = new mongoose.Schema({ text: String }, { strict: false });
const Question = mongoose.models.Question || mongoose.model('Question', QuestionSchema);

async function check() {
    await mongoose.connect(process.env.MONGO_URI);
    const count = await Question.countDocuments();
    console.log(`Total questions: ${count}`);

    // Search for snippets of the questions we updated
    const snippets = [
        "30 year old female",
        "28 year old female",
        "34 year old female",
        "40 year old male",
        "seizures",
        "retinal toxicity",
        "GCA",
        "Class 5",
        "SSc-ILD"
    ];

    for (const s of snippets) {
        const found = await Question.findOne({ text: new RegExp(s, 'i') });
        console.log(`Search for "${s}": ${found ? 'FOUND (' + found._id + ') Text: ' + found.text.substring(0, 40) : 'NOT FOUND'}`);
    }

    await mongoose.disconnect();
}
check();
