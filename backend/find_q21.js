
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const QuestionSchema = new mongoose.Schema({
    text: String,
    isFreeTrialQuestion: Boolean,
    freeTrialOrder: Number,
    image: String,
    image2: String,
    showImageWithQuestion: Boolean
}, { strict: false });
const Question = mongoose.models.Question || mongoose.model('Question', QuestionSchema);

async function check() {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("Searching for question 21...");
    const q21 = await Question.findOne({ $or: [{ freeTrialOrder: 21 }, { freeTrialOrder: "21" }] });

    if (q21) {
        console.log("FOUND BY ORDER 21:");
        console.log(JSON.stringify(q21, null, 2));
    } else {
        console.log("No question with order 21 found. Searching for images that might be related...");
        const qs = await Question.find({ image: { $exists: true, $ne: null } });
        console.log(`Found ${qs.length} questions with images.`);
        // List those with trial=false but having an order similar to 21
        const unsortedTrial = await Question.find({ isFreeTrialQuestion: true }).sort('freeTrialOrder');
        console.log(`Current trial count: ${unsortedTrial.length}`);
    }

    await mongoose.disconnect();
}

check();
