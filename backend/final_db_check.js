
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const QuestionSchema = new mongoose.Schema({ text: String }, { strict: false });
const Question = mongoose.models.Question || mongoose.model('Question', QuestionSchema);

async function check() {
    try {
        console.log("URI:", process.env.MONGO_URI);
        await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 10000 });
        console.log("Connected!");
        const count = await Question.countDocuments();
        console.log("Total Count:", count);

        const q = await Question.findOne({ text: /seizure/i });
        console.log("Seizure Q:", q ? q.text : "NOT FOUND");

        await mongoose.disconnect();
    } catch (err) {
        console.error("CONN ERROR:", err);
    }
}
check();
