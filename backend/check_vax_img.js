
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const QuestionSchema = new mongoose.Schema({
    image: String
}, { strict: false });
const Question = mongoose.models.Question || mongoose.model('Question', QuestionSchema);

async function check() {
    await mongoose.connect(process.env.MONGO_URI);
    const q = await Question.findOne({ image: 'acr-vaccine-glucocorticoids.png' });
    if (q) {
        console.log("FOUND question using acr-vaccine-glucocorticoids.png");
        console.log(q.text.substring(0, 100));
    } else {
        console.log("No question uses acr-vaccine-glucocorticoids.png");
    }
    await mongoose.disconnect();
}

check();
