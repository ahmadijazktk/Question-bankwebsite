
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const QuestionSchema = new mongoose.Schema({
    text: String,
    isFreeTrialQuestion: Boolean,
    freeTrialOrder: Number,
    image: String,
    image2: String
}, { strict: false });
const Question = mongoose.models.Question || mongoose.model('Question', QuestionSchema);

async function check() {
    await mongoose.connect(process.env.MONGO_URI);

    // Find all questions with image property
    const qs = await Question.find({ image: { $ne: null, $exists: true } });
    console.log(`Questions with images: ${qs.length}`);

    qs.forEach(q => {
        console.log(`ID: ${q._id} | Order: ${q.freeTrialOrder} | Trial: ${q.isFreeTrialQuestion} | Image: ${q.image} | Text: ${q.text.substring(0, 50)}`);
    });

    await mongoose.disconnect();
}

check();
