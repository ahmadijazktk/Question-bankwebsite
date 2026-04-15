
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const QuestionSchema = new mongoose.Schema({}, { strict: false });
const Question = mongoose.models.Question || mongoose.model('Question', QuestionSchema);

async function updateQuestions() {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        const allQs = await Question.find({});
        let updateCount = 0;

        for (const q of allQs) {
            let changed = false;
            let text = q.text || "";

            // Q66 & Q67 changes
            if (text.includes("{{c1::3-12 months}}")) {
                text = text.replaceAll("{{c1::3-12 months}}", "{{c1...3-12 months}}");
                changed = true;
            }
            if (text.includes("{{c1::3-6 months}}")) {
                text = text.replaceAll("{{c1::3-6 months}}", "{{c1...3-6 months}}");
                changed = true;
            }

            if (changed) {
                q.text = text;
                await q.save();
                updateCount++;
                console.log(`Updated ID: ${q._id}`);
            }
        }

        console.log(`Finished. Updated ${updateCount} questions.`);
    } catch (err) {
        console.error("Error:", err);
    } finally {
        await mongoose.disconnect();
    }
}
updateQuestions();
