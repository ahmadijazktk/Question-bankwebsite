
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const QuestionSchema = new mongoose.Schema({}, { strict: false });
const Question = mongoose.model('Question', QuestionSchema);

async function finalSearch() {
    await mongoose.connect(process.env.MONGO_URI);

    // Search for the specific string "Strongly recommend AGAINST."
    const qs1 = await Question.find({ "options.explanation": /Strongly recommend AGAINST\./ });
    console.log(`Matched Q61 criteria: ${qs1.length}`);
    qs1.forEach(q => console.log(`ID: ${q._id} | Expl: ${q.options[0].explanation}`));

    // Search for "False, this is STRONGLY REC'D AGAINST"
    const qs2 = await Question.find({ "options.explanation": /False, this is STRONGLY/i });
    console.log(`Matched Q62 criteria: ${qs2.length}`);
    qs2.forEach(q => console.log(`ID: ${q._id} | Expl: ${q.options[0].explanation}`));

    await mongoose.disconnect();
}
finalSearch();
