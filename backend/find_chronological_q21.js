
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const QuestionSchema = new mongoose.Schema({
    text: String,
    image: String,
    image2: String,
    createdAt: Date
}, { strict: false });
const Question = mongoose.models.Question || mongoose.model('Question', QuestionSchema);

async function find21() {
    await mongoose.connect(process.env.MONGO_URI);

    // Sort by createdAt desc like the API does
    const qs = await Question.find({}).sort({ createdAt: -1 }).limit(30);

    console.log(`Checking first 30 questions sorted by newest...`);
    qs.forEach((q, i) => {
        const num = i + 1;
        console.log(`${num}: [${q._id}] | Image: ${q.image} | Text: ${q.text.substring(0, 50).replace(/\n/g, ' ')}...`);
    });

    if (qs.length >= 21) {
        const q21 = qs[20];
        console.log("\n--- QUESTION 21 DETAILS ---");
        console.log(JSON.stringify(q21, null, 2));
    }

    await mongoose.disconnect();
}

find21();
