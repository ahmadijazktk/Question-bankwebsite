
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const QuestionSchema = new mongoose.Schema({}, { strict: false });
const Question = mongoose.model('Question', QuestionSchema);

async function listRanks() {
    await mongoose.connect(process.env.MONGO_URI);

    const all = await Question.find({}).sort({ createdAt: 1 });
    console.log(`Checking questions around rank 78...`);

    for (let i = 70; i < 90; i++) {
        const q = all[i];
        if (q) {
            console.log(`Rank ${i + 1}: ID ${q._id} | Image: ${q.image} | Text: ${q.text.substring(0, 50)}`);
        }
    }

    await mongoose.disconnect();
}
listRanks();
