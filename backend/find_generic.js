
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const QuestionSchema = new mongoose.Schema({}, { strict: false });
const Question = mongoose.models.Question || mongoose.model('Question', QuestionSchema);

async function findGenericExplanations() {
    await mongoose.connect(process.env.MONGO_URI);

    // Find questions with generic explanations or common patterns
    const qs = await Question.find({
        $or: [
            { "options.explanation": /Review the provided image/i },
            { "options.explanation": "Show Answer" }
        ]
    });

    console.log(`Found ${qs.length} questions with generic explanations.\n`);
    qs.forEach(q => {
        console.log(`ID: ${q._id} | Text: ${q.text} | Img: ${q.image} | Expl: ${q.options[0]?.explanation}`);
    });

    await mongoose.disconnect();
}
findGenericExplanations();
