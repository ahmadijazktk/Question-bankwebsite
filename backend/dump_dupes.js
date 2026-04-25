
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const Question = mongoose.models.Question || mongoose.model('Question', new mongoose.Schema({}, { strict: false }));

async function run() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const questions = await Question.find({
            "options.explanation": /color: #000; font-weight: 600;/
        }).limit(3);

        let output = '';
        questions.forEach((q, i) => {
            output += `--- Question ${i + 1} (ID: ${q._id}) ---\n`;
            if (q.summary) output += `Summary: ${q.summary}\n`;
            q.options.forEach((opt, j) => {
                if (opt.explanation && opt.explanation.includes('color: #000; font-weight: 600;')) {
                    output += `Option ${j} Explanation:\n${opt.explanation}\n---\n`;
                }
            });
        });
        fs.writeFileSync('dupe_check.txt', output);
        console.log("Written to dupe_check.txt");
    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.disconnect();
    }
}
run();
