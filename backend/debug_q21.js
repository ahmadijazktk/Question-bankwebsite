
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
    console.log("Connected to MongoDB");

    const qs = await Question.find({ isFreeTrialQuestion: true });
    console.log(`Trial questions: ${qs.length}`);
    qs.sort((a, b) => (a.freeTrialOrder || 0) - (b.freeTrialOrder || 0));
    qs.forEach((q, i) => {
        console.log(`${i + 1}: Order ${q.freeTrialOrder} | Image: ${q.image} | Image2: ${q.image2} | ShowWithQ: ${q.showImageWithQuestion} | Text: ${q.text.substring(0, 50)}`);
    });

    const any21 = await Question.findOne({ freeTrialOrder: 21 });
    if (any21) {
        console.log(`FOUND QUESTION 21: ${any21.text.substring(0, 100)}`);
        console.log(`IsTrial: ${any21.isFreeTrialQuestion}`);
        console.log(`Image: ${any21.image}`);
        console.log(`Image2: ${any21.image2}`);
        console.log(`ShowWithQ: ${any21.showImageWithQuestion}`);
    } else {
        console.log("No question with freeTrialOrder 21 found.");
    }

    await mongoose.disconnect();
}

check();
