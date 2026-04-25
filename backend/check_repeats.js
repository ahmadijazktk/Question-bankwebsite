
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const Question = mongoose.models.Question || mongoose.model('Question', new mongoose.Schema({}, { strict: false }));

async function findRepeats() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const questions = await Question.find({
            "options.explanation": /CONDITIONALLY RECOMMEND/
        });

        questions.forEach(q => {
            q.options.forEach(opt => {
                if (opt.explanation && /CONDITIONALLY RECOMMEND.*CONDITIONALLY RECOMMEND/i.test(opt.explanation)) {
                    // This is fine if it occurs twice in different sentences
                }
                // Check for immediate repetition
                if (opt.explanation && /CONDITIONALLY RECOMMEND\s+CONDITIONALLY RECOMMEND/i.test(opt.explanation)) {
                    console.log(`REPETITION in QID: ${q._id}`);
                    console.log(`Text: ${opt.explanation}`);
                }
            });
        });
        console.log("Check complete.");
    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.disconnect();
    }
}
findRepeats();
