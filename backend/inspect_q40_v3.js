
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const QuestionSchema = new mongoose.Schema({}, { strict: false });
const Question = mongoose.model('Question', QuestionSchema);

async function inspectQ40() {
    await mongoose.connect(process.env.MONGO_URI);

    // Check global ID 69a363b1e212ad97bfa96f48
    const q = await Question.findById('69a363b1e212ad97bfa96f48');
    if (q) {
        console.log("ID: " + q._id);
        console.log("Text: " + q.text);
        if (q.options && q.options.length > 0) {
            console.log("Options[0] Expl: " + q.options[0].explanation);
        }
    } else {
        console.log("Question not found");
    }

    await mongoose.disconnect();
}
inspectQ40();
