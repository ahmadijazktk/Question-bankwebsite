
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const QuestionSchema = new mongoose.Schema({
    image: String,
    image2: String,
    text: String
}, { strict: false });
const Question = mongoose.models.Question || mongoose.model('Question', QuestionSchema);

async function check() {
    await mongoose.connect(process.env.MONGO_URI);
    const qs = await Question.find({ $or: [{ image: 'acr-vaccine-glucocorticoids.png' }, { image2: 'acr-vaccine-glucocorticoids.png' }] });
    console.log(`Found ${qs.length} questions using it.`);
    qs.forEach(q => {
        console.log(`ID: ${q._id} | Text: ${q.text.substring(0, 100)}`);
    });
    await mongoose.disconnect();
}

check();
