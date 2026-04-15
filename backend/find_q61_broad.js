
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const QuestionSchema = new mongoose.Schema({}, { strict: false });
const Question = mongoose.model('Question', QuestionSchema);

async function searchQ61() {
    await mongoose.connect(process.env.MONGO_URI);

    // Broaden search for Q61
    const qs = await Question.find({ "options.explanation": /recommend AGAINST/i });
    console.log(`Found ${qs.length} potential Q61 matches`);
    for (let q of qs) {
        q.options.forEach(o => {
            if (o.explanation?.toLowerCase().includes('recommend against')) {
                console.log(`\nID: ${q._id}`);
                console.log(`Expl: ${o.explanation}`);
            }
        });
    }

    await mongoose.disconnect();
}
searchQ61();
