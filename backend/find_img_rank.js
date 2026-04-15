
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const QuestionSchema = new mongoose.Schema({}, { strict: false });
const Question = mongoose.model('Question', QuestionSchema);

async function findImgRank() {
    await mongoose.connect(process.env.MONGO_URI);

    // Find questions with images, sorted by createdAt
    const all = await Question.find({}).sort({ createdAt: 1 });
    console.log(`Checking questions around rank 78...`);

    for (let i = 0; i < all.length; i++) {
        if (all[i].image) {
            console.log(`Rank ${i + 1}: ID ${all[i]._id} | Image: ${all[i].image} | Text: ${all[i].text.substring(0, 50)}`);
        }
    }

    await mongoose.disconnect();
}
findImgRank();
