
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const QuestionSchema = new mongoose.Schema({}, { strict: false });
const Question = mongoose.model('Question', QuestionSchema);

async function findLiveAtten() {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("=== Matching 'live attenuated' ===");
    const qs = await Question.find({
        $or: [
            { text: /live attenuated/i },
            { "options.text": /live attenuated/i },
            { "options.explanation": /live attenuated/i }
        ]
    });

    qs.forEach((q, i) => {
        console.log(`\nID: ${q._id}`);
        console.log(`Text: ${q.text?.substring(0, 100)}`);

        q.options.forEach((o, j) => {
            if (o.explanation) {
                console.log(`Opt ${j} Expl: ${o.explanation.substring(0, 500)}`);
            }
        });
    });

    // Also check Free trial order 1, just in case
    const q1 = await Question.findOne({ freeTrialOrder: 1 });
    if (q1) {
        console.log("\n=== freeTrialOrder: 1 ===");
        console.log(`ID: ${q1._id}`);
        console.log(`Text: ${q1.text?.substring(0, 100)}`);
        q1.options.forEach((o, j) => {
            if (o.explanation) {
                console.log(`Opt ${j} Expl: ${o.explanation.substring(0, 300)}`);
            }
        });
    }

    await mongoose.disconnect();
}
findLiveAtten();
