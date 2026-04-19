
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const QuestionSchema = new mongoose.Schema({
    text: String,
    category: String,
    options: [{
        text: String,
        explanation: String,
        isCorrect: Boolean
    }],
    tags: [String],
    diagram: Boolean,
    difficulty: String,
    createdAt: { type: Date, default: Date.now }
}, { strict: false });

const Question = mongoose.models.Question || mongoose.model('Question', QuestionSchema);

async function addQuestion() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to DB.");

        const questionText = "-Young female with inflammatory infiltrate of SubQ adipose tissue that comes and goes<br>-Bx shows inflammation in adipose tissue, both in septal and lobular pattern, mononuclear cell infiltrate with multiple fat laden macrophages without any vasculitis.";

        const answerText = "Weber Christian disease (WCD)<br>-aka Relapsing Febrile Nodular Panniculitis<br>-remember that erythema nodosum does not have inflammation in lobule, but rather only septa";

        const newQuestion = new Question({
            text: questionText,
            category: "Dermatopathology",
            options: [{
                text: "Show Answer",
                explanation: answerText,
                isCorrect: true
            }],
            tags: ["Pathology", "WCD"],
            diagram: false,
            difficulty: "medium"
        });

        await newQuestion.save();
        console.log("✅ Question added successfully!");

        await mongoose.disconnect();
    } catch (err) {
        console.error("FAILED:", err.message);
    }
}
addQuestion();
