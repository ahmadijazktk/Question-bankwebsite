
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
    await mongoose.connect(process.env.MONGO_URI);
    const q = await Question.findOne({});
    console.log("Question Text:", q.text);
    console.log("Option 0 Text:", q.options[0].text);
    console.log("Option 0 Explanation:", q.options[0].explanation);
    await mongoose.disconnect();
}
check();
