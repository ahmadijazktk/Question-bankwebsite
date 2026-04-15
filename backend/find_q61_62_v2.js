
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const QuestionSchema = new mongoose.Schema({}, { strict: false });
const Question = mongoose.model('Question', QuestionSchema);

async function findExactMatch() {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("Searching for 'Strongly recommend AGAINST.'...");
    const q61_cand = await Question.find({ "options.explanation": /Strongly recommend AGAINST\./ });
    q61_cand.forEach(q => {
        console.log(`ID: ${q._id} | Text: ${q.text.substring(0, 50)}`);
        q.options.forEach(o => console.log(`Expl: ${o.explanation}`));
    });

    console.log("\nSearching for 'STRONGLY REC'D AGAINST'...");
    const q62_cand = await Question.find({ "options.explanation": /STRONGLY REC'D AGAINST/ });
    q62_cand.forEach(q => {
        console.log(`ID: ${q._id} | Text: ${q.text.substring(0, 50)}`);
        q.options.forEach(o => console.log(`Expl: ${o.explanation}`));
    });

    await mongoose.disconnect();
}
findExactMatch();
