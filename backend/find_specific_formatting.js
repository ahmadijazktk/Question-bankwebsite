
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const QuestionSchema = new mongoose.Schema({}, { strict: false });
const Question = mongoose.models.Question || mongoose.model('Question', QuestionSchema);

async function checkExplanations() {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        const qs = await Question.find({
            "options.explanation": { $all: [/Essentially/i, /MTX is not listed/i] }
        });
        console.log(`Found ${qs.length} questions matching BOTH.`);

        qs.forEach(q => {
            q.options.forEach(o => {
                if (/Essentially/i.test(o.explanation) && /MTX is not listed/i.test(o.explanation)) {
                    console.log(`\nID: ${q._id}`);
                    console.log(`Full Explanation:\n${o.explanation}`);
                }
            });
        });

    } catch (err) {
        console.error("Error:", err);
    } finally {
        await mongoose.disconnect();
    }
}
checkExplanations();
