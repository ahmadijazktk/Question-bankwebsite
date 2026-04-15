
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const QuestionSchema = new mongoose.Schema({}, { strict: false });
const Question = mongoose.model('Question', QuestionSchema);

async function findRecommends() {
    await mongoose.connect(process.env.MONGO_URI);

    // Find questions having "AGAINST" in either text or explanations
    const qs = await Question.find({
        $or: [
            { "options.explanation": /AGAINST/i },
            { "options.text": /AGAINST/i },
            { "text": /AGAINST/i }
        ]
    });

    console.log(`Found ${qs.length} matches with 'AGAINST'`);
    for (let q of qs) {
        console.log(`\nID: ${q._id}`);
        console.log(`Text: ${q.text.substring(0, 100)}...`);
        q.options.forEach((o, i) => {
            if (o.explanation?.toLowerCase().includes('against') || o.text?.toLowerCase().includes('against')) {
                console.log(`Opt ${i} Text: ${o.text}`);
                console.log(`Opt ${i} Expl: ${o.explanation}`);
            }
        });
    }

    await mongoose.disconnect();
}
findRecommends();
