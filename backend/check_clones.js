
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const QuestionSchema = new mongoose.Schema({}, { strict: false });
const Question = mongoose.model('Question', QuestionSchema);

async function checkRecent() {
    await mongoose.connect(process.env.MONGO_URI);
    const qs = await Question.find({ text: 'What do you do?' }).sort({ createdAt: -1 }).limit(10);
    console.log(`Checking ${qs.length} recent 'What do you do?' questions.`);
    qs.forEach((q, i) => {
        console.log(`\nQuestion ${i + 1}: ID: ${q._id}`);
        console.log(`Image: ${q.image}`);
        console.log(`Image2: ${q.image2}`);
        console.log(`Explanation: ${q.options[0]?.explanation}`);
        console.log(`Summary: ${q.summary}`);
    });
    await mongoose.disconnect();
}
checkRecent();
