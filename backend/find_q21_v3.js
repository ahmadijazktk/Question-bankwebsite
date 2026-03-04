
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
    createdAt: Date,
    isFreeTrialQuestion: Boolean,
    freeTrialOrder: Number
}, { strict: false });
const Question = mongoose.models.Question || mongoose.model('Question', QuestionSchema);

async function check() {
    await mongoose.connect(process.env.MONGO_URI);

    const qs = await Question.find({}).sort({ createdAt: -1 }).limit(50);
    let out = "Checking newest 50 questions...\n";

    qs.forEach((q, i) => {
        out += `${i + 1}: ID: ${q._id} | Trial: ${q.isFreeTrialQuestion} | Order: ${q.freeTrialOrder} | Image: ${q.image} | Text: ${q.text.substring(0, 40).replace(/\n/g, ' ')}\n`;
    });

    fs.writeFileSync(path.join(__dirname, 'newest_50_fixed.txt'), out);
    console.log("Written to newest_50_fixed.txt");
    await mongoose.disconnect();
}

check();
