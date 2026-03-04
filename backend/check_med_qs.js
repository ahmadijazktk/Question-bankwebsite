
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const QuestionSchema = new mongoose.Schema({
    text: String,
    category: String,
    image: String,
    image2: String,
    freeTrialOrder: Number
}, { strict: false });
const Question = mongoose.models.Question || mongoose.model('Question', QuestionSchema);

async function check() {
    await mongoose.connect(process.env.MONGO_URI);

    const qs = await Question.find({ text: /What do you do/i, category: 'Medications' });
    console.log(`Found ${qs.length} 'What do you do?' questions in Medications.`);

    qs.forEach((q, i) => {
        console.log(`${i + 1}: ID: ${q._id} | Order: ${q.freeTrialOrder} | Image: ${q.image} | Image2: ${q.image2}`);
    });

    await mongoose.disconnect();
}

check();
