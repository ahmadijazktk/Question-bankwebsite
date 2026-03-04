
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
    freeTrialOrder: Number
}, { strict: false });
const Question = mongoose.models.Question || mongoose.model('Question', QuestionSchema);

async function check() {
    await mongoose.connect(process.env.MONGO_URI);

    // Search for "21" in text or order
    const qs = await Question.find({ $or: [{ text: /21/i }, { freeTrialOrder: 21 }] });
    console.log(`Found ${qs.length} questions matching '21'.`);

    qs.forEach(q => {
        console.log(`ID: ${q._id} | Order: ${q.freeTrialOrder} | Image: ${q.image} | Text: ${q.text.substring(0, 100)}`);
    });

    await mongoose.disconnect();
}

check();
