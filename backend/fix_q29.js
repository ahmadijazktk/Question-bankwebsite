
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const QuestionSchema = new mongoose.Schema({}, { strict: false });
const Question = mongoose.models.Question || mongoose.model('Question', QuestionSchema);

async function run() {
    await mongoose.connect(process.env.MONGO_URI);

    const q = await Question.findById('69a363b3e212ad97bfa96f62');
    if (!q) { console.log("Not found"); await mongoose.disconnect(); return; }

    // Rewrite option 2 (the correct one) with exact user-requested text:
    // - "Thrombocytopenia" stays as is (capital T, normal weight)
    // - "SYMPTOMATIC" in uppercase
    // - CONDITIONALLY RECOMMEND bold + uppercase
    const newExplanation =
        `According to ACR: " Thrombocytopenia: For SYMPTOMATIC thrombocytopenia (i.e., active significant bleeding) attributed to SLE: \u2026We <strong style='color:#000;font-weight:900;'>CONDITIONALLY RECOMMEND</strong> initial glucocorticoid therapy with addition of IVIG and/or anti-CD20 therapy over the addition of conventional immunosuppressive agents."`;

    q.options[2].explanation = newExplanation;
    q.markModified('options');
    await q.save();

    console.log("Q29 updated successfully.");
    console.log("New explanation:\n" + newExplanation);

    await mongoose.disconnect();
}
run();
