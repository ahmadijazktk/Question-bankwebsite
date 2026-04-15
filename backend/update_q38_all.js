
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const QuestionSchema = new mongoose.Schema({}, { strict: false });
const Question = mongoose.model('Question', QuestionSchema);

async function findAndFixRefractory() {
    await mongoose.connect(process.env.MONGO_URI);

    // Find anything that talks about LN refractory, 3 options
    const qs = await Question.find({
        $or: [
            { "options.explanation": /MMF, belimumab, and CNI/i },
            { "options.explanation": /anti-CD20 to current regimen/i },
            { "options.explanation": /failed two standard therapy courses/i },
            { text: /failed two standard therapy courses/i }
        ]
    });

    console.log(`Found ${qs.length} matching questions`);
    let count = 0;

    const newExpl = `1) do combination MMF, belimumab, and CNI (ie. voclosporin).\n2) add anti-CD20 (ie. RTX) to current regimen \n3) referral for investigational therapy.\n<br/>\n" In people with any LN class with refractory disease (i.e., failed two standard therapy courses), we <strong>CONDITIONALLY RECOMMEND</strong> treatment escalation to a more intensive regimen, including addition of anti-CD20 agents, OR.....combination therapy with three non-glucocorticoid immunosuppressives (i.e., MPAA, belimumab and CNI)....OR.... referral for investigational therapy."`;

    for (let q of qs) {
        console.log(`Checking question ID: ${q._id}`);
        // Only update if it contains options
        let modified = false;
        let newOptions = [];

        if (q.options && Array.isArray(q.options)) {
            for (let opt of q.options) {
                if (opt.explanation && opt.explanation.includes('failed two standard therapy courses') ||
                    opt.explanation && opt.explanation.includes('MMF, belimumab, and CNI')) {
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
findAndFixRefractory();
