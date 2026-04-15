
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const QuestionSchema = new mongoose.Schema({}, { strict: false });
const Question = mongoose.model('Question', QuestionSchema);

async function findQ78() {
    await mongoose.connect(process.env.MONGO_URI);

    // Most common order is by createdAt
    const qs = await Question.find({}).sort({ createdAt: 1 });

    console.log(`Total questions: ${qs.length}`);

    for (let i = 75; i < 85; i++) {
        const q = qs[i];
        if (q) {
            console.log(`\nIndex ${i} (Question ${i + 1}):`);
            console.log(`ID: ${q._id}`);
            console.log(`Text: ${q.text.substring(0, 100)}`);
            console.log(`Image: ${q.image}`);
            console.log(`Image2: ${q.image2}`);
        }
    }

    await mongoose.disconnect();
}
findQ78();
