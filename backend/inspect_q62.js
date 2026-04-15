
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const QuestionSchema = new mongoose.Schema({}, { strict: false });
const Question = mongoose.model('Question', QuestionSchema);

async function inspectQ62() {
    await mongoose.connect(process.env.MONGO_URI);

    const q = await Question.findById('69a363aee212ad97bfa96f06');
    if (q) {
        console.log(`ID: ${q._id}`);
        console.log(`Text: ${q.text}`);
        q.options.forEach((o, i) => {
            console.log(`\nOpt ${i} Text: ${o.text}`);
            console.log(`Opt ${i} Expl: ${o.explanation}`);
        });
    }

    await mongoose.disconnect();
}
inspectQ62();
