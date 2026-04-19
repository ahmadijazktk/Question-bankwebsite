
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const QuestionSchema = new mongoose.Schema({ options: Array }, { strict: false });
const Question = mongoose.models.Question || mongoose.model('Question', QuestionSchema);

async function run() {
    await mongoose.connect(process.env.MONGO_URI);

    const qId = '69e141bb92ef514155fdbd7f';
    const q = await Question.findById(qId);

    if (q) {
        console.log("Updating Question 69...");
        q.options.forEach(o => {
            if (o.isCorrect) {
                o.explanation = "The correct management is shown in the image below.";
            }
        });
        q.markModified('options');
        await q.save();
        console.log("Done.");
    } else {
        console.log("Question not found.");
    }

    await mongoose.disconnect();
}
run();
