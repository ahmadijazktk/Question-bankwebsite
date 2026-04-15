
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const QuestionSchema = new mongoose.Schema({}, { strict: false });
const Question = mongoose.models.Question || mongoose.model('Question', QuestionSchema);

async function dump() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const qs = await Question.find({ isFreeTrialQuestion: { $ne: true } })
            .sort({ createdAt: -1 })
            .limit(30);

        console.log("Current Top 30 Regular Questions:");
        qs.forEach((q, i) => {
            console.log(`${i + 1}: ID: ${q._id} | Text: ${q.text?.substring(0, 40)}... | Img: ${q.image}`);
        });
    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.disconnect();
    }
}
dump();
