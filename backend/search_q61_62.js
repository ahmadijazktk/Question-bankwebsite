
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const QuestionSchema = new mongoose.Schema({}, { strict: false });
const Question = mongoose.model('Question', QuestionSchema);

async function searchAll() {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("Searching for 'Strongly recommend AGAINST.'...");
    const qs1 = await Question.find({ "options.explanation": /Strongly recommend AGAINST\./ });
    console.log(`Found ${qs1.length} for Q61`);
    qs1.forEach(q => console.log(`ID: ${q._id} | Expl: ${q.options[0].explanation}`));

    console.log("\nSearching for 'REC'D AGAINST'...");
    const qs2 = await Question.find({ "options.explanation": /REC'D AGAINST/ });
    console.log(`Found ${qs2.length} for Q62`);
    qs2.forEach(q => console.log(`ID: ${q._id} | Expl: ${q.options[0].explanation}`));

    await mongoose.disconnect();
}
searchAll();
