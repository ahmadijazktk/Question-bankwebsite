
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const QuestionSchema = new mongoose.Schema({}, { strict: false });
const Question = mongoose.model('Question', QuestionSchema);

async function findq34() {
    await mongoose.connect(process.env.MONGO_URI);

    const qs = await Question.find({
        $or: [
            { text: /stable controlled SLE/i },
            { text: /prednisone to a dose of/i },
            { text: /routine treatment with HCQ/i },
            { "options.explanation": /stable controlled SLE/i },
            { "options.explanation": /prednisone to a dose of/i },
            { "options.explanation": /routine treatment with HCQ/i }
        ]
    });

    console.log("Found: ", qs.length);
    for (let q of qs) {
        console.log(`\nID: ${q._id}`);
        console.log(`Text: ${q.text.substring(0, 150)}...`);
        if (q.options && q.options.length > 0) {
            console.log(`Option 1 Expl: ${q.options[0].explanation?.substring(0, 150)}...`);
        }
    }

    await mongoose.disconnect();
}
findq34();
