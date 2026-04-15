
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const QuestionSchema = new mongoose.Schema({}, { strict: false });
const Question = mongoose.model('Question', QuestionSchema);

async function findQ61_62() {
    await mongoose.connect(process.env.MONGO_URI);

    // Search for keywords
    const qs = await Question.find({
        $or: [
            { "options.explanation": /Strongly recommend AGAINST/i },
            { "options.explanation": /STRONGLY REC'D AGAINST/i }
        ]
    });

    console.log(`Found ${qs.length} matching questions`);
    for (let q of qs) {
        console.log(`\nID: ${q._id}`);
        console.log(`Text: ${q.text.substring(0, 150)}...`);
        if (q.options && q.options.length > 0) {
            for (let opt of q.options) {
                if (opt.explanation && (opt.explanation.toLowerCase().includes('strongly recommend against') || opt.explanation.toLowerCase().includes("rec'd against"))) {
                    console.log(`Expl: ${opt.explanation}`);
                }
            }
        }
    }

    await mongoose.disconnect();
}
findQ61_62();
