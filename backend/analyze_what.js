
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const QuestionSchema = new mongoose.Schema({}, { strict: false });
const Question = mongoose.models.Question || mongoose.model('Question', QuestionSchema);

async function groupWhatQuestions() {
    await mongoose.connect(process.env.MONGO_URI);

    // Get all "What do you do?" questions
    const qs = await Question.find({ text: /What do you do\??/i });
    console.log(`Analyzing ${qs.length} 'What do you do?' questions...\n`);

    // Group by explanation to find duplicates
    const explMap = new Map();

    qs.forEach(q => {
        const expl = q.options?.[0]?.explanation || "NO EXPLANATION";
        if (!explMap.has(expl)) explMap.set(expl, []);
        explMap.get(expl).push(q);
    });

    for (const [expl, list] of explMap.entries()) {
        if (list.length > 1) {
            console.log(`\nDUPLICATE SET (Found ${list.length} items):`);
            console.log(`Explanation: ${expl.substring(0, 100)}...`);
            list.forEach((q, i) => {
                console.log(`  ${i + 1}. ID: ${q._id} | Image: ${q.image} | Category: ${q.category}`);
            });
        }
    }

    console.log("\n\n--- ALL 'WHAT DO YOU DO?' QUESTIONS BY ID ---");
    qs.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0)).forEach((q, i) => {
        console.log(`${i + 1}. ID: ${q._id} | Img: ${q.image} | Expl: ${q.options?.[0]?.explanation?.substring(0, 50)}...`);
    });

    await mongoose.disconnect();
}
groupWhatQuestions();
