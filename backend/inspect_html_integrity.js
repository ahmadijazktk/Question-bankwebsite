
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const QuestionSchema = new mongoose.Schema({ options: Array }, { strict: false });
const Question = mongoose.models.Question || mongoose.model('Question', QuestionSchema);

async function inspect() {
    await mongoose.connect(process.env.MONGO_URI);
    const questions = await Question.find({
        $or: [
            { text: /&lt;/i },
            { 'options.text': /&lt;/i },
            { 'options.explanation': /&lt;/i }
        ]
    }).limit(5);

    if (questions.length > 0) {
        console.log(`Found ${questions.length} questions with escaped HTML.`);
        questions.forEach(q => {
            console.log(`ID: ${q._id}`);
            console.log(`Text: ${q.text.substring(0, 100)}`);
        });
    } else {
        console.log("No escaped HTML (e.g. &lt;) found in DB. Content looks like raw HTML.");
    }

    // Check for raw tags to confirm
    const rawTagsQ = await Question.findOne({ text: /<br>/i });
    if (rawTagsQ) {
        console.log("Confirmed: Raw <br> tags exist in DB.");
    }

    await mongoose.disconnect();
}
inspect();
