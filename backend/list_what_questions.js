
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const QuestionSchema = new mongoose.Schema({}, { strict: false });
const Question = mongoose.model('Question', QuestionSchema);

async function checkWhat() {
    await mongoose.connect(process.env.MONGO_URI);
    const qs = await Question.find({ text: 'What do you do?' }).sort({ createdAt: -1 });
    console.log(`Found ${qs.length} 'What do you do?' questions.`);
    qs.forEach((q, i) => {
        console.log(`${i + 1}: ID: ${q._id} | Image: ${q.image} | Image2: ${q.image2} | Created: ${q.createdAt}`);
    });
    await mongoose.disconnect();
}
checkWhat();
