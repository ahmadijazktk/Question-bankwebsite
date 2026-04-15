
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const QuestionSchema = new mongoose.Schema({}, { strict: false });
const Question = mongoose.model('Question', QuestionSchema);

async function findq39Full() {
    await mongoose.connect(process.env.MONGO_URI);

    // Search for keywords related to the question
    const qs = await Question.find({
        $or: [
            { text: /inadequate renal response/i },
            { text: /TRIPLE/i },
            { "options.explanation": /inadequate renal response/i },
            { "options.explanation": /TRIPLE/i },
            { text: /anti-CD20/i },
            { text: /LN class/i }
        ]
    });

    for (let q of qs) {
        if (q.text.includes('inadequate renal response') || (q.options[0] && q.options[0].explanation && q.options[0].explanation.includes('inadequate renal response')) || q.text.includes('Class V')) {
            console.log(`\nID: ${q._id}`);
            console.log(`Text: ${q.text.substring(0, 300)}...`);
            if (q.options && q.options.length > 0) {
                console.log(`Option 1 Expl: ${q.options[0].explanation?.substring(0, 300)}...`);
            }
        }
    }

    await mongoose.disconnect();
}
findq39Full();
