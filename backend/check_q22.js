
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
    category: String,
    difficulty: String,
    isFreeTrialQuestion: Boolean
}, { strict: false });
const Question = mongoose.models.Question || mongoose.model('Question', QuestionSchema);

async function check() {
    await mongoose.connect(process.env.MONGO_URI);

    // As per frontend list view, Questions are returned sorted by createdAt desc limit 50 by default in test_api.cjs.
    // Let's get them the exact same way to find the index
    const qs = await Question.find({}).sort({ createdAt: -1 }).limit(50);

    console.log(`Total limit 50, found: ${qs.length}`);
    const q21 = qs[20];
    const q22 = qs[21];
    const q23 = qs[22];

    console.log('\n--- Q21 ---');
    console.log(`ID: ${q21?._id} | Text: ${q21?.text} | Img: ${q21?.image} | Img2: ${q21?.image2}`);

    console.log('\n--- Q22 ---');
    console.log(`ID: ${q22?._id} | Text: ${q22?.text} | Img: ${q22?.image} | Img2: ${q22?.image2}`);

    console.log('\n--- Q23 ---');
    console.log(`ID: ${q23?._id} | Text: ${q23?.text} | Img: ${q23?.image} | Img2: ${q23?.image2}`);

    await mongoose.disconnect();
}

check();
