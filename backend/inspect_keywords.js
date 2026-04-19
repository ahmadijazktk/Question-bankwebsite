
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const QuestionSchema = new mongoose.Schema({ text: String }, { strict: false });
const Question = mongoose.models.Question || mongoose.model('Question', QuestionSchema);

async function check() {
    await mongoose.connect(process.env.MONGO_URI);

    const terms = ["seizure", "myelitis", "hemolytic", "retinal", "proteinuria", "GCA", "muscle biopsy", "SSc-ILD"];

    for (const t of terms) {
        const found = await Question.find({ text: new RegExp(t, 'i') }).limit(3);
        console.log(`\nTERM: ${t}`);
        found.forEach(f => console.log(`- ID: ${f._id} | TEXT: ${f.text.substring(0, 100)}`));
    }

    await mongoose.disconnect();
}
check();
