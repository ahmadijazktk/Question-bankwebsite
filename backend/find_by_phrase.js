
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const QuestionSchema = new mongoose.Schema({}, { strict: false });
const Question = mongoose.model('Question', QuestionSchema);

async function findByPhrase() {
    await mongoose.connect(process.env.MONGO_URI);

    // We want "Strongly recommend AGAINST" and "STRONGLY REC'D AGAINST"
    const qs = await Question.find({
        $or: [
            { "options.explanation": /recommend AGAINST/i },
            { "options.explanation": /rec'd AGAINST/i }
        ]
    });

    console.log(`Found ${qs.length} matching questions`);
    for (let q of qs) {
        console.log(`\nID: ${q._id}`);
        console.log(`Text: ${q.text.substring(0, 100)}`);
        q.options.forEach((o, i) => {
            if (o.explanation && (o.explanation.toLowerCase().includes('recommend against') || o.explanation.toLowerCase().includes("rec'd against"))) {
                console.log(`Opt ${i} Expl: ${o.explanation}`);
            }
        });
    }

    await mongoose.disconnect();
}
findByPhrase();
