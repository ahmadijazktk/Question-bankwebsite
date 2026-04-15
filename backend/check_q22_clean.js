
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
    image2: String,
    category: String,
    difficulty: String,
    isFreeTrialQuestion: Boolean
}, { strict: false });
const Question = mongoose.models.Question || mongoose.model('Question', QuestionSchema);

async function check() {
    await mongoose.connect(process.env.MONGO_URI);

    // Front end logic for exams limits.
    const qs = await Question.find({}).sort({ createdAt: -1 }).limit(50);

    let out = `Total limit 50, found: ${qs.length}\n\n`;

    for (let i = 19; i <= 23; i++) {
        const q = qs[i];
        if (q) {
            out += `--- Q${i + 1} ---\n`;
            out += `ID: ${q._id}\n`;
            out += `Text: ${q.text}\n`;
            out += `Img: ${q.image}\n`;
            out += `Img2: ${q.image2}\n\n`;
        }
    }

    fs.writeFileSync('q22_debug_clean.txt', out, 'utf8');
    console.log("Written to q22_debug_clean.txt");
    await mongoose.disconnect();
}

check();
