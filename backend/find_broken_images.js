
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

    // Find all questions with images
    const qs = await Question.find({ image: { $exists: true, $ne: null } });
    const imgDir = path.join(__dirname, '../src/images');

    console.log(`Checking ${qs.length} questions for broken images...`);

    for (const q of qs) {
        if (q.image && !fs.existsSync(path.join(imgDir, q.image))) {
            console.log(`BROKEN Q IMAGE: ID: ${q._id} | File: ${q.image} | Text: ${q.text.substring(0, 50)}`);
        }
        if (q.image2 && !fs.existsSync(path.join(imgDir, q.image2))) {
            console.log(`BROKEN A IMAGE: ID: ${q._id} | File: ${q.image2} | Text: ${q.text.substring(0, 50)}`);
        }
    }

    await mongoose.disconnect();
}

check();
