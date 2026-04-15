
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const QuestionSchema = new mongoose.Schema({}, { strict: false });
const Question = mongoose.models.Question || mongoose.model('Question', QuestionSchema);

const DARK_BOLD = (text) => `<strong style='color:#000;font-weight:900;'>${text}</strong>`;

async function run() {
    await mongoose.connect(process.env.MONGO_URI);

    const q = await Question.findById('69a363b3e212ad97bfa96f60');
    if (!q) { console.log("Not found"); await mongoose.disconnect(); return; }

    // Rewrite option 3 explanation:
    // - CONDITIONALLY RECOMMEND → bold
    // - "Essentially..." and "MTX" lines → plain text (NOT bold)
    const cleanExplanation =
        `According to ACR: Thrombocytopenia: For chronic asymptomatic thrombocytopenia ( ${DARK_BOLD('CONDITIONALLY RECOMMEND')} initiation of glucocorticoid with an additional therapy (MPAA, AZA, CNI, anti-CD 20 agents, belimumab, and/or IVIG) over observation or glucocorticoid monotherapy.<br /><br />Essentially, steroids plus any of the listed steroid sparing agents above.<br /><br />***MTX is not listed among them***`;

    q.options[3].explanation = cleanExplanation;
    q.markModified('options');
    await q.save();
    console.log("Done — 'Essentially' and 'MTX' lines are now plain text, only CONDITIONALLY RECOMMEND is bold.");

    await mongoose.disconnect();
}
run();
