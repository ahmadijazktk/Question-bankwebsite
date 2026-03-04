
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
    const qs = await Question.find({ image: { $exists: true, $ne: null } });
    const used = new Set();
    qs.forEach(q => {
        if (q.image) used.add(q.image);
        if (q.image2) used.add(q.image2);
    });

    const suspects = [
        'acr-vaccine-glucocorticoids.png',
        'acr-vaccine-guidelines-1.png',
        'acr-vaccine-guidelines-2.png',
        'give_or_defer_vaccine_table.png',
        'how_long_vaccine_table.png'
    ];

    console.log("--- SUSPECTS USAGE ---");
    for (const s of suspects) {
        console.log(`${s.padEnd(40)} | Used: ${used.has(s)}`);
    }

    await mongoose.disconnect();
}

check();
