
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const QuestionSchema = new mongoose.Schema({}, { strict: false });
const Question = mongoose.models.Question || mongoose.model('Question', QuestionSchema);

async function check() {
    await mongoose.connect(process.env.MONGO_URI);

    // Position 69 (0-indexed 68)
    const qs = await Question.find({ isFreeTrialQuestion: { $ne: true } })
        .sort({ createdAt: -1 })
        .skip(68)
        .limit(1);

    if (qs.length) {
        console.log(`ID: ${qs[0]._id}`);
        console.log(`Text: ${qs[0].text}`);
        console.log(`Image (Question): ${qs[0].image}`);
        console.log(`Image2 (Answer): ${qs[0].image2}`);
        console.log(`Diagram: ${qs[0].diagram}`);
        console.log(`ShowImageWithQuestion: ${qs[0].showImageWithQuestion}`);
        qs[0].options.forEach((o, i) => {
            console.log(`Opt ${i}: Text="${o.text}" Expl="${o.explanation}"`);
        });
    }

    await mongoose.disconnect();
}
check();
