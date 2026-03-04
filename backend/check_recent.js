
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
    createdAt: Date
}, { strict: false });
const Question = mongoose.models.Question || mongoose.model('Question', QuestionSchema);

async function check() {
    await mongoose.connect(process.env.MONGO_URI);

    const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);
    const qs = await Question.find({ createdAt: { $gte: twoDaysAgo } }).sort('createdAt');
    console.log(`Found ${qs.length} questions added in the last 2 days.`);

    qs.forEach((q, i) => {
        console.log(`${i + 1}: ID: ${q._id} | Order: ${q.freeTrialOrder} | Image: ${q.image} | Text: ${q.text.substring(0, 50)}`);
    });

    await mongoose.disconnect();
}

check();
