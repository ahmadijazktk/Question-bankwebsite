
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

    const ids = ['69a363aee212ad97bfa96f14', '69a363afe212ad97bfa96f16', '69a363afe212ad97bfa96f18'];
    const qs = await Question.find({ _id: { $in: ids } });

    qs.forEach((q, i) => {
        console.log(`\n\nQuestion ID: ${q._id}`);
        console.log(`Text: ${q.text}`);
    });

    await mongoose.disconnect();
}
run();
