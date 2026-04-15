
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const QuestionSchema = new mongoose.Schema({}, { strict: false });
const Question = mongoose.model('Question', QuestionSchema);

async function checkNewest() {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");
    const qs = await Question.find({}).sort({ _id: -1 }).limit(10);
    qs.forEach(q => {
        console.log(`ID: ${q._id} | Text: ${q.text?.substring(0, 50).replace(/\n/g, ' ')} | Image: ${q.image} | Order: ${q.freeTrialOrder}`);
    });
    await mongoose.disconnect();
}
checkNewest();
