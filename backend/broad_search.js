
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const QuestionSchema = new mongoose.Schema({}, { strict: false });
const Question = mongoose.model('Question', QuestionSchema);

async function broadSearch() {
    await mongoose.connect(process.env.MONGO_URI);

    // Search for "AGAINST" in the explanation
    const qs = await Question.find({
        "options.explanation": /AGAINST/
    });

    console.log(`Found ${qs.length} matches with 'AGAINST'`);
    for (let q of qs) {
        let match = false;
        q.options.forEach(o => {
            if (o.explanation && o.explanation.includes('AGAINST')) {
                // If it contains "recommend" or "REC'D"
                if (o.explanation.toLowerCase().includes('recommend') || o.explanation.includes("REC'D")) {
                    match = true;
                }
            }
        });

        if (match) {
            console.log(`\nID: ${q._id}`);
            console.log(`Text: ${q.text.substring(0, 50)}...`);
            q.options.forEach((o, i) => {
                if (o.explanation && o.explanation.includes('AGAINST')) {
                    console.log(`Opt ${i} Expl: ${o.explanation}`);
                }
            });
        }
    }

    await mongoose.disconnect();
}
broadSearch();
