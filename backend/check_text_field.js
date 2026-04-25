
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const Question = mongoose.models.Question || mongoose.model('Question', new mongoose.Schema({}, { strict: false }));

async function checkText() {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        const phrases = [
            "conditionally recommend",
            "CONDITIONALLY REC'D",
            "WEAK Rec'd",
            "STRONG REC'D",
            "STRONGLY REC'D",
            "Strong Recommendation"
        ];

        const allQs = await Question.find({
            $or: phrases.map(p => ({ text: new RegExp(p, 'i') }))
        });

        console.log(`Found ${allQs.length} questions where the phrase exists in the core question 'text' field.`);
        allQs.slice(0, 5).forEach(q => {
            console.log(`- QID: ${q._id}, Text: ${q.text.substring(0, 100)}`);
        });

    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.disconnect();
    }
}
checkText();
