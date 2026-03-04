
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const QuestionSchema = new mongoose.Schema({
    freeTrialOrder: Number,
    text: String
}, { strict: false });
const Question = mongoose.models.Question || mongoose.model('Question', QuestionSchema);

async function check() {
    await mongoose.connect(process.env.MONGO_URI);
    const q = await Question.findOne({ freeTrialOrder: 21 });
    if (q) {
        console.log("FOUND question with freeTrialOrder 21:", q._id, q.text);
    } else {
        console.log("No question with freeTrialOrder 21");
    }
    await mongoose.disconnect();
}

check();
