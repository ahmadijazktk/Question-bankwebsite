
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
    const brEscaped = await Question.findOne({ $or: [{ text: /&lt;br&gt;/i }, { 'options.text': /&lt;br&gt;/i }] });
    const bEscaped = await Question.findOne({ $or: [{ text: /&lt;b&gt;/i }, { 'options.text': /&lt;b&gt;/i }] });

    if (brEscaped) console.log("WARNING: Found escaped <br> tags.");
    if (bEscaped) console.log("WARNING: Found escaped <b> tags.");

    if (!brEscaped && !bEscaped) {
        console.log("No escaped critical tags (<br> or <b>) found. Only mathematical symbols like &lt; are encoded which is usually safe.");
    }

    await mongoose.disconnect();
}
inspect();
