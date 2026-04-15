
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const QuestionSchema = new mongoose.Schema({}, { strict: false });
const Question = mongoose.model('Question', QuestionSchema);

async function checkTrialOrder() {
    await mongoose.connect(process.env.MONGO_URI);
    const qs = await Question.find({ isFreeTrialQuestion: true }).sort({ freeTrialOrder: 1 }).limit(10);
    console.log(`Found ${qs.length} trial questions.`);
    qs.forEach((q, i) => {
        console.log(`\nOrder ${q.freeTrialOrder}: ID: ${q._id}`);
        console.log(`Text: ${q.text}`);
        console.log(`Image: ${q.image}`);
        console.log(`Category: ${q.category}`);
        console.log(`Options Count: ${q.options.length}`);
        console.log(`First Option Text: ${q.options[0]?.text}`);
        console.log(`Summary: ${q.summary}`);
    });
    await mongoose.disconnect();
}
checkTrialOrder();
