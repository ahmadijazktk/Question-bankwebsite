
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const Question = mongoose.models.Question || mongoose.model('Question', new mongoose.Schema({}, { strict: false }));

async function verify() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const q = await Question.findOne({
            $or: [
                { summary: /color: #000; font-weight: 600;/ },
                { "options.explanation": /color: #000; font-weight: 600;/ }
            ]
        });
        if (q) {
            console.log("Sample Updated Question:");
            console.log("Summary:", q.summary);
            console.log("First option explanation:", q.options[0]?.explanation);
        } else {
            console.log("No updated questions found.");
        }
    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.disconnect();
    }
}
verify();
