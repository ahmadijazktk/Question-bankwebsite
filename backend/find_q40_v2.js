
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

    // Search by content that sounds like the old answer or question text
    const qs = await Question.find({
        $or: [
            { text: /Class III\/IV/i },
            { text: /lupus nephritis/i, text: /escalating/i },
            { "options.explanation": /regimen/i, "options.explanation": /TRIPLE/i },
            { text: /undergone DUAL immunosuppressive/i }
        ]
    });

    console.log(`Found ${qs.length} potential matches`);
    for (let q of qs) {
        if (q.text.includes('Class III/IV') || (q.options[0] && q.options[0].explanation && q.options[0].explanation.includes('TRIPLE'))) {
            console.log(`\nID: ${q._id}`);
            console.log(`Text: ${q.text.substring(0, 200)}`);
            if (q.options && q.options.length > 0) {
                console.log(`Opt 1 Expl: ${q.options[0].explanation?.substring(0, 300)}`);
            }
        }
    }

    await mongoose.disconnect();
}
findQ40();
