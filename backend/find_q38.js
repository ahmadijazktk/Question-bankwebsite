
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const QuestionSchema = new mongoose.Schema({}, { strict: false });
const Question = mongoose.model('Question', QuestionSchema);

async function findq38() {
    await mongoose.connect(process.env.MONGO_URI);

    // Search based on the content of the answer to narrow down to Question 38
    // Refractory disease, LN class, MMF, belimumab, CNI, anti-CD20, etc.
    const qs = await Question.find({
        $or: [
            { text: /failed two standard therapy courses/i },
            { text: /anti-CD20/i },
            { text: /belimumab and CNI/i },
            { text: /MMF, belimumab, and CNI/i },
            { "options.explanation": /failed two standard therapy courses/i },
            { "options.explanation": /investigational therapy/i },
            { "options.explanation": /refractory disease/i },
            { "options.text": /investigational therapy/i }
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
findq38();
