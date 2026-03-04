
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const QuestionSchema = new mongoose.Schema({
    image: String,
    image2: String
}, { strict: false });
const Question = mongoose.models.Question || mongoose.model('Question', QuestionSchema);

async function check() {
    await mongoose.connect(process.env.MONGO_URI);

    // Find all questions that have images
    const qs = await Question.find({ $or: [{ image: { $exists: true, $ne: null } }, { image2: { $exists: true, $ne: null } }] });
    const usedImages = new Set();
    qs.forEach(q => {
        if (q.image) usedImages.add(q.image);
        if (q.image2) usedImages.add(q.image2);
    });

    const candidates = [
        'acr-vaccine-glucocorticoids.png',
        'acr-vaccine-guidelines-1.png',
        'acr-vaccine-guidelines-2.png',
        'give_or_defer_vaccine_table.png',
        'how_long_vaccine_table.png'
    ];

    console.log("--- IMAGE USAGE CHECK ---");
    candidates.forEach(c => {
        console.log(`${c.padEnd(40)}: ${usedImages.has(c) ? 'USED' : 'UNUSED'}`);
    });

    await mongoose.disconnect();
}

check();
