
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const QuestionSchema = new mongoose.Schema({}, { strict: false });
const Question = mongoose.model('Question', QuestionSchema);

async function findImages() {
    await mongoose.connect(process.env.MONGO_URI);

    // Find questions with images
    const qs = await Question.find({ image: { $ne: null } }).sort({ createdAt: 1 });

    console.log(`Found ${qs.length} questions with images`);
    qs.forEach((q, i) => {
        console.log(`\nMatch ${i + 1}:`);
        console.log(`ID: ${q._id}`);
        console.log(`Text: ${q.text.substring(0, 100)}...`);
        console.log(`Image: ${q.image}`);
    });

    await mongoose.disconnect();
}
findImages();
