
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const QuestionSchema = new mongoose.Schema({}, { strict: false });
const Question = mongoose.model('Question', QuestionSchema);

async function findFinal() {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("Searching for 'Strongly recommend AGAINST'...");
    const matches1 = await Question.find({ "options.explanation": /Strongly recommend AGAINST/ });
    matches1.forEach(q => {
        console.log(`ID: ${q._id} | Text: ${q.text.substring(0, 100)}`);
        q.options.forEach(o => console.log(`Expl: ${o.explanation}`));
    });

    console.log("\nSearching for 'False, this is STRONGLY'...");
    const matches2 = await Question.find({ "options.explanation": /False, this is STRONGLY/ });
    matches2.forEach(q => {
        console.log(`ID: ${q._id} | Text: ${q.text.substring(0, 100)}`);
        q.options.forEach(o => console.log(`Expl: ${o.explanation}`));
    });

    await mongoose.disconnect();
}
findFinal();
