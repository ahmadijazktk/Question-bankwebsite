
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
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

        questions.forEach((q, i) => {
            console.log(`--- Question ${i + 1} (ID: ${q._id}) ---`);
            q.options.forEach((opt, j) => {
                if (opt.explanation && opt.explanation.includes('color: #000; font-weight: 600;')) {
                    console.log(`Option ${j} Explanation:`);
                    console.log(opt.explanation);
                    console.log('---');
                }
            });
        });
    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.disconnect();
    }
}
run();
