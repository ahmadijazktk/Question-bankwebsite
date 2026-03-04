
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
    diagram: Boolean,
    showImageWithQuestion: Boolean,
    createdAt: Date
}, { strict: false });
const Question = mongoose.models.Question || mongoose.model('Question', QuestionSchema);

async function find21() {
    await mongoose.connect(process.env.MONGO_URI);

    // API logic: newest first
    const qs = await Question.find({}).sort({ createdAt: -1 });

    if (qs.length >= 21) {
        const q21 = qs[20];
        console.log("--- QUESTION 21 ---");
        console.log(`ID: ${q21._id}`);
        console.log(`Text: ${q21.text}`);
        console.log(`Image: ${q21.image}`);
        console.log(`Image2: ${q21.image2}`);
        console.log(`Diagram: ${q21.diagram}`);
        console.log(`ShowWithQ: ${q21.showImageWithQuestion}`);
    } else {
        console.log(`Only found ${qs.length} questions.`);
    }

    await mongoose.disconnect();
}

find21();
