
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const QuestionSchema = new mongoose.Schema({}, { strict: false });
const Question = mongoose.models.Question || mongoose.model('Question', QuestionSchema);

async function findEssentially() {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        const qs = await Question.find({});
        console.log(`Searching through ${qs.length} questions...`);

        qs.forEach((q, idx) => {
            let found = false;
            let expls = [];

            if (q.options) {
                q.options.forEach(o => {
                    if (o.explanation && o.explanation.includes("Essentially")) {
                        found = true;
                        expls.push(o.explanation);
                    }
                });
            }

            if (found) {
                console.log(`\n--- Match Found ---`);
                console.log(`ID: ${q._id}`);
                console.log(`Text: ${q.text?.substring(0, 100)}...`);
                expls.forEach(e => console.log(`Explanation Slice: ${e.substring(0, 500)}`));
            }
        });

    } finally {
        await mongoose.disconnect();
    }
}
findEssentially();
