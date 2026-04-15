
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const QuestionSchema = new mongoose.Schema({}, { strict: false });
const Question = mongoose.model('Question', QuestionSchema);

async function findQ40() {
    await mongoose.connect(process.env.MONGO_URI);

    const qs = await Question.find({
        $or: [
            { text: /partial renal response/i },
            { text: /TRIPLE immunosuppressive/i },
            { text: /Class III.*IV.*lupus nephritis/i },
            { "options.explanation": /partial renal response/i },
            { "options.explanation": /TRIPLE immunosuppressive/i },
            { text: /DUAL immunosuppressive/i },
        ]
    });

    console.log(`Found ${qs.length} matching questions`);
    for (let q of qs) {
        console.log(`\nID: ${q._id}`);
        console.log(`Text: ${q.text.substring(0, 200)}`);
        if (q.options && q.options.length > 0) {
            console.log(`Opt 1 Expl (first 200): ${q.options[0].explanation?.substring(0, 200)}`);
        }
    }

    await mongoose.disconnect();
}
findQ40();
