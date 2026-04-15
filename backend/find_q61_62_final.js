
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

    console.log("Searching for Q61/62 content in DB...");

    // Q61 search
    const qs61 = await Question.find({ "options.explanation": /Strongly recommend AGAINST/i });
    console.log(`Q61 matches: ${qs61.length}`);
    for (let q of qs61) {
        console.log(`\nID: ${q._id}`);
        console.log(`Text: ${q.text.substring(0, 100)}...`);
        q.options.forEach((o, i) => {
            if (o.explanation && o.explanation.toLowerCase().includes('strongly recommend against')) {
                console.log(`Opt ${i} Expl: ${o.explanation}`);
            }
        });
    }

    // Q62 search
    const qs62 = await Question.find({ "options.text": /STRONGLY REC'D AGAINST/i });
    console.log(`\nQ62 matches (searching by options.text): ${qs62.length}`);
    for (let q of qs62) {
        console.log(`\nID: ${q._id}`);
        console.log(`Text: ${q.text.substring(0, 100)}...`);
        q.options.forEach((o, i) => {
            if (o.text && o.text.toLowerCase().includes('rec\'d against')) {
                console.log(`Opt ${i} Text: ${o.text}`);
            }
        });
    }

    await mongoose.disconnect();
}
findFinal();
