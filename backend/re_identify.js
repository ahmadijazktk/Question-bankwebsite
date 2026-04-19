
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const QuestionSchema = new mongoose.Schema({}, { strict: false });
const Question = mongoose.models.Question || mongoose.model('Question', QuestionSchema);

async function find() {
    await mongoose.connect(process.env.MONGO_URI);

    const terms = [
        "seizures", "hemolytic anemia", "transverse myelitis", "retinal toxicity",
        "proteinuria", "lupus nephritis", "PMH of SLE", "GCA", "muscle biopsy",
        "SARDs-ILD", "SSc-ILD", "MCTD-ILD"
    ];

    for (const term of terms) {
        const results = await Question.find({ text: new RegExp(term, 'i') }).limit(5);
        console.log(`\n--- Term: ${term} (${results.length} found) ---`);
        results.forEach(q => {
            console.log(`ID: ${q._id} | Text: ${q.text.substring(0, 100)}`);
        });
    }

    await mongoose.disconnect();
}
find();
