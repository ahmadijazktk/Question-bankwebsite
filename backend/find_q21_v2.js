
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
    createdAt: Date,
    isFreeTrialQuestion: Boolean,
    freeTrialOrder: Number
}, { strict: false });
const Question = mongoose.models.Question || mongoose.model('Question', QuestionSchema);

async function check() {
    await mongoose.connect(process.env.MONGO_URI);

    // API logic: newest first
    const qs = await Question.find({}).sort({ createdAt: -1 }).limit(50);
    console.log(`Checking newest 50 questions...`);

    qs.forEach((q, i) => {
        console.log(`${i + 1}: ID: ${q._id} | Trial: ${q.isFreeTrialQuestion} | Order: ${q.freeTrialOrder} | Image: ${q.image} | Text: ${q.text.substring(0, 40)}`);
    });

    await mongoose.disconnect();
}

check();
