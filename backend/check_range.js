
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const QuestionSchema = new mongoose.Schema({
    text: String,
    image: String,
    image2: String
}, { strict: false });
const Question = mongoose.models.Question || mongoose.model('Question', QuestionSchema);

async function check() {
    await mongoose.connect(process.env.MONGO_URI);
    const qs = await Question.find().sort({ createdAt: -1 }).limit(50);
    const imgDir = path.join(__dirname, '../src/images');

    console.log("Checking questions 15-25 (indices 14-24):");
    for (let i = 14; i <= 24; i++) {
        const q = qs[i];
        if (!q) continue;
        let bq = q.image && !fs.existsSync(path.join(imgDir, q.image));
        console.log(`${i + 1}: ID ${q._id} | Image: ${q.image} | Broken: ${bq} | Text: ${q.text?.substring(0, 40)}`);
    }
    await mongoose.disconnect();
}

check();
