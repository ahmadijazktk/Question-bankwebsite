
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const QuestionSchema = new mongoose.Schema({ text: String, options: Array }, { strict: false });
const Question = mongoose.models.Question || mongoose.model('Question', QuestionSchema);

async function check() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const qs = await Question.find({});

        console.log(`Checking ${qs.length} questions...`);

        for (const q of qs) {
            const hasFormatting = q.options.some(o => o.explanation && (o.explanation.includes("CONDITIONALLY") || o.explanation.includes("STRONGLY")));
            if (hasFormatting) {
                console.log(`\nID: ${q._id} | TEXT: ${q.text.substring(0, 50)}`);
                q.options.forEach(o => {
                    if (o.explanation && (o.explanation.includes("CONDITIONALLY") || o.explanation.includes("STRONGLY"))) {
                        console.log(`- EXPLANATION: ${o.explanation.substring(0, 200)}`);
                    }
                });
            }
        }
        await mongoose.disconnect();
    } catch (err) { console.error(err); }
}
check();
