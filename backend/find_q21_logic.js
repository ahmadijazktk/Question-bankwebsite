
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const QuestionSchema = new mongoose.Schema({
    freeTrialOrder: Number,
    text: String,
    image: String,
    image2: String
}, { strict: false });
const Question = mongoose.models.Question || mongoose.model('Question', QuestionSchema);

async function check() {
    await mongoose.connect(process.env.MONGO_URI);
    const q = await Question.findOne({ freeTrialOrder: 21 });
    if (q) {
        console.log("FOUND question 21:");
        console.log(JSON.stringify(q, null, 2));
    } else {
        console.log("No question with freeTrialOrder 21");
        // Check the 21st question if sorted by freeTrialOrder then ID?
        const allTrial = await Question.find({ isFreeTrialQuestion: true }).sort('freeTrialOrder');
        console.log(`Total free trial questions: ${allTrial.length}`);
        if (allTrial.length >= 21) {
            console.log("21st trial question:");
            console.log(JSON.stringify(allTrial[20], null, 2));
        } else {
            console.log("Less than 21 trial questions found.");
        }
    }
    await mongoose.disconnect();
}

check();
