
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const QuestionSchema = new mongoose.Schema({ text: String, options: Array }, { strict: false });
const Question = mongoose.models.Question || mongoose.model('Question', QuestionSchema);

async function find() {
    await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 60000 });

    // Search for ELNT in questions
    const qs = await Question.find({ "options.explanation": /ELNT/i });

    qs.forEach(q => {
        console.log(`ID: ${q._id} | TEXT: ${q.text.substring(0, 100)}`);
        q.options.forEach((o, i) => {
            if (o.explanation.includes("ELNT")) {
                console.log(`--- Expl --- \n${o.explanation}\n-----------`);
            }
        });
    });

    await mongoose.disconnect();
}
find();
