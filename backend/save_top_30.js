
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const QuestionSchema = new mongoose.Schema({ text: String }, { strict: false });
const Question = mongoose.models.Question || mongoose.model('Question', QuestionSchema);

async function check() {
    await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 60000 });
    const qs = await Question.find({ isFreeTrialQuestion: { $ne: true } }).sort({ createdAt: -1 }).limit(30);

    let out = "";
    qs.forEach((q, i) => {
        out += `${i + 1}: ${q._id} | ${q.text.substring(0, 100)}\n`;
    });
    fs.writeFileSync('top_30_list.txt', out);
    await mongoose.disconnect();
}
check();
