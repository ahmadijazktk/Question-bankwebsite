
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const QuestionSchema = new mongoose.Schema({}, { strict: false });
const Question = mongoose.model('Question', QuestionSchema);

async function checkCategory() {
    await mongoose.connect(process.env.MONGO_URI);
    const qs = await Question.find({ category: 'Pregnancy' }).sort({ createdAt: -1 });
    console.log(`Found ${qs.length} Pregnancy questions.`);
    for (let i = 0; i < Math.min(10, qs.length); i++) {
        const q = qs[i];
        console.log(`${i + 1}: ID: ${q._id} | Text: ${q.text?.substring(0, 30)} | Image: ${q.image} | Expl: ${q.options[0]?.explanation?.substring(0, 30)}`);
    }
    await mongoose.disconnect();
}
checkCategory();
