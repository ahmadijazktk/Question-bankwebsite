
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const QuestionSchema = new mongoose.Schema({}, { strict: false });
const Question = mongoose.models.Question || mongoose.model('Question', QuestionSchema);

async function checkQuad() {
    await mongoose.connect(process.env.MONGO_URI);
    const ids = [
        '69a363b3e212ad97bfa96f64',
        '69a363b3e212ad97bfa96f62',
        '69a363b3e212ad97bfa96f60',
        '69a363b3e212ad97bfa96f5e'
    ];
    const qs = await Question.find({ _id: { $in: ids } });
    qs.forEach(q => {
        console.log(`\nID: ${q._id}`);
        console.log(`Text: ${q.text}`);
        console.log(`Explanation: ${q.options[0]?.explanation}`);
        console.log(`Summary: ${q.summary}`);
    });
    await mongoose.disconnect();
}
checkQuad();
