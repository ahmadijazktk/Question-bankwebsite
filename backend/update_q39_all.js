
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const QuestionSchema = new mongoose.Schema({}, { strict: false });
const Question = mongoose.model('Question', QuestionSchema);

async function updateQ39() {
    await mongoose.connect(process.env.MONGO_URI);

    // Find anything that talks about inadequate renal response in the explanation
    const qs = await Question.find({
        $or: [
            { "options.explanation": /inadequate renal response/i },
            { "options.explanation": /TRIPLE therapy/i },
            { text: /inadequate renal response/i }
        ]
    });

    console.log(`Found ${qs.length} matching questions`);
    let count = 0;

    const newExpl = `Change to an alternative TRIPLE therapy choice or Add anti-CD20 agent (ie. RTX) \n<br/>\n"In people with any LN class with an inadequate renal response (i.e., have not achieved at least a partial renal response by 6-12 months) we <strong>CONDITIONALLY RECOMMEND</strong> escalation of treatment: \n<br/>\n• For initial DUAL therapy, escalate to TRIPLE therapy. \n<br/>\n• For initial TRIPLE therapy, change to an alternative TRIPLE therapy or consider addition of an antiCD20 agent as a second immunosuppressive."`;

    for (let q of qs) {
        let modified = false;
        let newOptions = [];

        if (q.options && Array.isArray(q.options)) {
            for (let opt of q.options) {
                // If it's the exact match question, it talks about "inadequate renal response" in explanation
                if (opt.explanation && opt.explanation.includes('inadequate renal response')) {
                    opt.explanation = newExpl;
                    modified = true;
                }
                newOptions.push(opt);
            }
        }

        if (modified) {
            await Question.updateOne({ _id: q._id }, { $set: { options: newOptions } });
            count++;
            console.log(`Updated ID: ${q._id}`);
        }
    }

    console.log(`Finished updating ${count} questions.`);
    await mongoose.disconnect();
}
updateQ39();
