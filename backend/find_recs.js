
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const QuestionSchema = new mongoose.Schema({}, { strict: false });
const Question = mongoose.model('Question', QuestionSchema);

async function findQ61_62() {
    await mongoose.connect(process.env.MONGO_URI);

    const qs = await Question.find({ text: /Within the 2023 ACR ILD guidelines/i });
    console.log(`Found ${qs.length} matches`);
    for (let q of qs) {
        console.log(`\nID: ${q._id}`);
        console.log(`Text: ${q.text}`);
        q.options.forEach((o, i) => console.log(`Opt ${i} Expl: ${o.explanation}`));
    }

    // Also search for the specific phrases mentioned
    const qs2 = await Question.find({ "options.explanation": /recommend AGAINST/i });
    console.log(`\nSearching by explanation content:`);
    for (let q of qs2) {
        if (q.options.some(o => o.explanation && (o.explanation.includes('Strongly recommend AGAINST') || o.explanation.includes("STRONGLY REC'D AGAINST")))) {
            console.log(`\nID: ${q._id}`);
            console.log(`Text: ${q.text.substring(0, 100)}...`);
            q.options.forEach((o, i) => {
                if (o.explanation && (o.explanation.includes('Strongly recommend AGAINST') || o.explanation.includes("STRONGLY REC'D AGAINST"))) {
                    console.log(`Opt ${i} Expl: ${o.explanation}`);
                }
            });
        }
    }

    await mongoose.disconnect();
}
findQ61_62();
