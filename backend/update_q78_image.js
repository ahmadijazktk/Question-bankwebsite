
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const QuestionSchema = new mongoose.Schema({}, { strict: false });
const Question = mongoose.model('Question', QuestionSchema);

async function updateQ78() {
    await mongoose.connect(process.env.MONGO_URI);

    // Target ID identified: 69a363ade212ad97bfa96efc
    // Text: "What is the management for contraception?"
    const qid = '69a363ade212ad97bfa96efc';
    const q = await Question.findById(qid);

    if (q) {
        await Question.updateOne({ _id: qid }, { $set: { image: 'contraception_management_new.jpg' } });
        console.log("Successfully updated question image!");
    } else {
        console.log("Question not found");
    }

    await mongoose.disconnect();
}
updateQ78();
