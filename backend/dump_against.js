
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const QuestionSchema = new mongoose.Schema({}, { strict: false });
const Question = mongoose.model('Question', QuestionSchema);

async function dumpAgainst() {
    await mongoose.connect(process.env.MONGO_URI);

    const qs = await Question.find({ "options.explanation": /AGAINST/i });
    console.log(`Found ${qs.length} questions`);

    qs.forEach(q => {
        const expls = q.options.map(o => o.explanation || "").join(" | ");
        console.log(`ID: ${q._id} | Text: ${q.text.substring(0, 50)} | Expl: ${expls}`);
    });

    await mongoose.disconnect();
}
dumpAgainst();
