
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const QuestionSchema = new mongoose.Schema({}, { strict: false });
const Question = mongoose.model('Question', QuestionSchema);

async function checkWhatDupes() {
    await mongoose.connect(process.env.MONGO_URI);
    const qs = await Question.find({ text: 'What do you do?' }).sort({ createdAt: 1 });
    let out = `Found ${qs.length} 'What do you do?' questions.\n`;
    qs.forEach((q, i) => {
        out += `${i + 1}: ID: ${q._id} | Image: ${q.image} | Image2: ${q.image2} | Expl: ${q.options[0]?.explanation?.substring(0, 30)}\n`;
    });
    fs.writeFileSync(path.join(__dirname, 'chrono_utf8.txt'), out, 'utf8');
    await mongoose.disconnect();
}
checkWhatDupes();
