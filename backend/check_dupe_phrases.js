
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

        // Find questions where the word is repeated in the SAME explanation
        const questions = await Question.find({
            $or: [
                { "options.explanation": /CONDITIONALLY RECOMMEND.*CONDITIONALLY RECOMMEND/i },
                { "options.explanation": /STRONGLY REC'D.*STRONGLY REC'D/i }
            ]
        });

        console.log(`Found ${questions.length} questions with repeated phrases in explanation.`);
        questions.slice(0, 5).forEach(q => {
            q.options.forEach(o => {
                if (o.explanation && o.explanation.includes('CONDITIONALLY RECOMMEND')) {
                    console.log(`QID: ${q._id}, Expl: ${o.explanation}`);
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
