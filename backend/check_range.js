
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const QuestionSchema = new mongoose.Schema({
    text: String,
    createdAt: Date,
    isFreeTrialQuestion: Boolean
}, { strict: false });
const Question = mongoose.models.Question || mongoose.model('Question', QuestionSchema);

async function run() {
    await mongoose.connect(process.env.MONGO_URI);

    const qs = await Question.find({ isFreeTrialQuestion: { $ne: true } })
        .sort({ createdAt: -1 })
        .skip(60) // Check from 61 to 70
        .limit(10);

    qs.forEach((q, i) => {
        const num = 61 + i;
        console.log(`\nQuestion ${num} (ID: ${q._id})`);
        console.log(`Text: ${q.text.substring(0, 50)}...MATCH: ${q.text.includes('{{c1') ? 'YES' : 'NO'}`);
        if (q.text.includes('{{c1::')) console.log(`Double colon found! ${q.text.match(/{{c1::[^}]+}}/)}`);
        if (q.text.includes('{{c1...')) console.log(`Triple dot found! ${q.text.match(/{{c1\.\.\.[^}]+}}/)}`);
    });

    await mongoose.disconnect();
}
run();
