
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
        const q = await Question.findOne({});
        if (q) {
            console.log("FIELDS:", Object.keys(q._doc).join(', '));
        } else {
            console.log("No question found");
        }
    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.disconnect();
    }
}
run();
