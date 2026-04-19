
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const QuestionSchema = new mongoose.Schema({ options: Array }, { strict: false });
const Question = mongoose.models.Question || mongoose.model('Question', QuestionSchema);

async function check() {
    await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 60000 });
    const q = await Question.findById('69e141bb92ef514155fdbd9c');
    if (q) {
        q.options.forEach((o, i) => {
            if (o.isCorrect) {
                console.log(`Correct Option Text: "${o.text}"`);
                console.log(`Explanation: "${o.explanation}"`);
            }
        });
    }
    await mongoose.disconnect();
}
check();
