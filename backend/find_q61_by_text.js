
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const QuestionSchema = new mongoose.Schema({}, { strict: false });
const Question = mongoose.model('Question', QuestionSchema);

async function findQ61() {
    await mongoose.connect(process.env.MONGO_URI);

    const qs = await Question.find({ text: /Within the 2023 ACR ILD guidelines, which is\/are the recommendations classified as 'STRONGLY'/i });
    console.log(`Matched Q61 criteria: ${qs.length}`);
    for (let q of qs) {
        console.log(`\nID: ${q._id}`);
        q.options.forEach((o, i) => console.log(`Opt ${i} Expl: ${o.explanation}`));
    }

    await mongoose.disconnect();
}
findQ61();
