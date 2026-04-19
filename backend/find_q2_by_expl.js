
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const QuestionSchema = new mongoose.Schema({ options: Array }, { strict: false });
const Question = mongoose.models.Question || mongoose.model('Question', QuestionSchema);

async function find() {
    await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 60000 });

    // Search in explanations
    const qs = await Question.find({ "options.explanation": /vasculitis attributed to active SLE/i });

    qs.forEach(q => {
        console.log(`ID: ${q._id} | TEXT: ${q.text.substring(0, 50)}`);
        q.options.forEach((o, i) => {
            if (o.explanation.includes("vasculitis attributed to active SLE")) {
                console.log(`Opt ${i}: ${o.explanation.substring(0, 100)}`);
            }
        });
    });

    await mongoose.disconnect();
}
find();
