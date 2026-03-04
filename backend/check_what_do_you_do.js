
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const QuestionSchema = new mongoose.Schema({
    text: String,
    image: String,
    image2: String,
    explanation: String
}, { strict: false });
const Question = mongoose.models.Question || mongoose.model('Question', QuestionSchema);

async function check() {
    await mongoose.connect(process.env.MONGO_URI);
    const qs = await Question.find({ text: /What do you do/i });
    console.log(`Found ${qs.length} questions.`);
    qs.forEach(q => {
        console.log(`ID: ${q._id} | Order: ${q.freeTrialOrder} | Image: ${q.image} | Explanation: ${q.explanation ? q.explanation.substring(0, 50) : 'N/A'}`);
    });
    await mongoose.disconnect();
}

check();
