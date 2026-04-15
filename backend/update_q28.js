
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

    const q = await Question.findById('69a363b3e212ad97bfa96f64');
    if (!q) { console.log("Not found"); await mongoose.disconnect(); return; }

    const BOLD = (text) => `<strong style='color:#000;font-weight:900;'>${text}</strong>`;

    const newExplanation =
        `According to ACR "Hemolytic Anemia : For SYMPTOMATIC autoimmune hemolytic anemia (i.e., ischemic manifestations and/or hemodynamic instability) attributed to SLE: \u2026We ${BOLD('CONDITIONALLY RECOMMEND')} initial glucocorticoid therapy with addition of IVIG and/or anti-CD20 therapy over the addition of conventional immunosuppressive agents."<br /><br />` +
        `***this is the same answer and treatment for SYMPTOMATIC thrombocytopenia attributed to SLE ***`;

    // Based on inspection, Opt 2 is the correct answer
    if (q.options[2]) {
        q.options[2].explanation = newExplanation;
    }

    q.markModified('options');
    await q.save();

    console.log("Q28 updated successfully.");
    console.log("New explanation:\n" + newExplanation);

    await mongoose.disconnect();
}
run();
