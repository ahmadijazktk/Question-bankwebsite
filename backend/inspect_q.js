
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const QuestionSchema = new mongoose.Schema({}, { strict: false });
const Question = mongoose.model('Question', QuestionSchema);

async function inspectQ() {
    await mongoose.connect(process.env.MONGO_URI);

    const q = await Question.findById('69a363b1e212ad97bfa96f3a');
    if (q) {
        console.log(JSON.stringify(q, null, 2));
    } else {
        console.log("Not found");
    }

    await mongoose.disconnect();
}
inspectQ();
