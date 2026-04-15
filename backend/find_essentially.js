
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

        // Find all questions containing "Essentially"
        const qs = await Question.find({ "options.explanation": /Essentially/i });
        console.log(`Found ${qs.length} questions with 'Essentially' in options.`);

        qs.forEach(q => {
            q.options.forEach(o => {
                if (/Essentially/i.test(o.explanation)) {
                    console.log(`\nID: ${q._id}`);
                    console.log(`Text: ${q.text.substring(0, 50)}...`);
                    console.log(`Explanation:\n${o.explanation}`);
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
