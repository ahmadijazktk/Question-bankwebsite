
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const QuestionSchema = new mongoose.Schema({}, { strict: false });
const Question = mongoose.model('Question', QuestionSchema);

async function findLiveAtten() {
    await mongoose.connect(process.env.MONGO_URI);

    let output = "=== Matching 'live attenuated' ===\n";
    const qs = await Question.find({
        $or: [
            { text: /vaccine/i },
            { "options.text": /live attenuated/i },
            { "options.explanation": /live attenuated/i }
        ]
    });

    qs.forEach((q, i) => {
        output += `\nID: ${q._id}\n`;
        output += `Text: ${q.text?.substring(0, 100)}\n`;

        q.options.forEach((o, j) => {
            if (o.explanation) {
                output += `Opt ${j} Expl: ${o.explanation.substring(0, 500)}\n`;
            }
        });
    });

    const q1 = await Question.find({}).sort({ createdAt: 1 }).limit(1);
    if (q1.length > 0) {
        output += "\n=== Question 1 by createdAt ===\n";
        output += `ID: ${q1[0]._id}\n`;
        output += `Text: ${q1[0].text}\n`;
        q1[0].options.forEach((o, j) => {
            if (o.explanation) {
                output += `Opt ${j} Expl: ${o.explanation}\n`;
            }
        });
    }

    fs.writeFileSync('backend/vaccine_output_clean.txt', output, 'utf8');

    await mongoose.disconnect();
}
findLiveAtten();
