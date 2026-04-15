
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const QuestionSchema = new mongoose.Schema({}, { strict: false });
const Question = mongoose.model('Question', QuestionSchema);

async function findQ47() {
    await mongoose.connect(process.env.MONGO_URI);

    const qs = await Question.find({
        $or: [
            { "options.explanation": /MMF \+ belimumab/i },
            { "options.explanation": /Euro-Lupus/i },
            { "options.explanation": /proteinuria ≥3g/i },
            { text: /Choice of initial treatment/i }
        ]
    });

    console.log(`Found ${qs.length} potential matches`);
    for (let q of qs) {
        console.log(`\nID: ${q._id}`);
        console.log(`Text: ${q.text.substring(0, 150)}...`);
        if (q.options && q.options.length > 0) {
            const expl = q.options.find(o => o.isCorrect)?.explanation || q.options[0].explanation;
            console.log(`Expl: ${expl?.substring(0, 300)}...`);
        }
    }

    await mongoose.disconnect();
}
findQ47();
