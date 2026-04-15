
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const QuestionSchema = new mongoose.Schema({}, { strict: false });
const Question = mongoose.model('Question', QuestionSchema);

async function findMatch() {
    await mongoose.connect(process.env.MONGO_URI);

    // Find questions with specific strings
    const qs = await Question.find({
        $or: [
            { "options.explanation": /Strongly recommend AGAINST/ },
            { "options.explanation": /STRONGLY REC'D AGAINST/ }
        ]
    });

    console.log(`Found ${qs.length} matches`);
    for (let q of qs) {
        console.log(`\nID: ${q._id}`);
        console.log(`Text: ${q.text.substring(0, 100)}...`);
        q.options.forEach((o, i) => {
            if (o.explanation && (o.explanation.includes('Strongly recommend AGAINST') || o.explanation.includes("STRONGLY REC'D AGAINST"))) {
                console.log(`Opt ${i} Expl: ${o.explanation}`);
            }
        });
    }

    await mongoose.disconnect();
}
findMatch();
