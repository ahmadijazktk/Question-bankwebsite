
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const QuestionSchema = new mongoose.Schema({
    text: String
}, { strict: false });
const Question = mongoose.models.Question || mongoose.model('Question', QuestionSchema);

async function run() {
    await mongoose.connect(process.env.MONGO_URI);

    const allQs = await Question.find({});
    let count = 0;

    for (const q of allQs) {
        let text = q.text || "";
        let original = text;

        if (text.includes("{{c1::3-12 months}}")) {
            console.log(`Found 3-12 match in ${q._id}`);
            text = text.split("{{c1::3-12 months}}").join("{{c1...3-12 months}}");
        }
        if (text.includes("{{c1::3-6 months}}")) {
            console.log(`Found 3-6 match in ${q._id}`);
            text = text.split("{{c1::3-6 months}}").join("{{c1...3-6 months}}");
        }

        if (text !== original) {
            q.text = text;
            await q.save();
            count++;
            console.log(`Updated ID: ${q._id}`);
        }
    }

    console.log(`\nDONE. Updated ${count} questions.`);
    await mongoose.disconnect();
}
run();
