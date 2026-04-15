
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const QuestionSchema = new mongoose.Schema({}, { strict: false });
const Question = mongoose.model('Question', QuestionSchema);

async function execRemove() {
    await mongoose.connect(process.env.MONGO_URI);

    // Let's find all questions that have text "What do you do?" and are the newest ones
    const qs = await Question.find({ text: /what do you do/i }).sort({ createdAt: -1 }).limit(5);

    console.log("Here are the top 5 'What do you do?' questions currently:");
    qs.forEach((q, i) => {
        console.log(`[${i + 1}] ID: ${q._id} | Image: ${q.image}`);
    });

    // We will just delete q_art_2 and q_art_3 if they are here
    const d1 = await Question.deleteOne({ image: 'q_art_2.png' });
    const d2 = await Question.deleteOne({ image: 'q_art_3.png' });
    console.log(`\nDeleted q_art_2: ${d1.deletedCount}`);
    console.log(`Deleted q_art_3: ${d2.deletedCount}`);

    // Also delete any other obvious 3-question batches if we see them, like q_question_23? (They are already gone).

    await mongoose.disconnect();
}
execRemove();
