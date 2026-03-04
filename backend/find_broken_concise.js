
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const QuestionSchema = new mongoose.Schema({
    image: String,
    image2: String,
    text: String
}, { strict: false });
const Question = mongoose.models.Question || mongoose.model('Question', QuestionSchema);

async function check() {
    await mongoose.connect(process.env.MONGO_URI);
    const qs = await Question.find({ $or: [{ image: { $exists: true, $ne: null } }, { image2: { $exists: true, $ne: null } }] });
    const imgDir = path.join(__dirname, '../src/images');

    for (const q of qs) {
        let bq = q.image && !fs.existsSync(path.join(imgDir, q.image));
        let ba = q.image2 && !fs.existsSync(path.join(imgDir, q.image2));
        if (bq || ba) {
            console.log(`${q._id} | Q:${bq ? q.image : ''} | A:${ba ? q.image2 : ''}`);
        }
    }
    await mongoose.disconnect();
}

check();
