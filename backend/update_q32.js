
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

    const q = await Question.findById('69a363b2e212ad97bfa96f5c');
    if (!q) { console.log("Not found"); await mongoose.disconnect(); return; }

    const BOLD = (text) => `<strong style='color:#000;font-weight:900;'>${text}</strong>`;

    const newExplanation =
        `In people with SLE who are unable to taper prednisone to \u22645 mg/day, we ${BOLD('CONDITIONALLY RECOMMEND')} initiating or escalating immunosuppressive therapy.<br /><br />` +
        `Under Musculoskeletal Arthritis in the 2025 ACR SLE Treatment Guideline: "For persistent or recurrent active SLE arthritis on HCQ, regardless of prior/current NSAIDs or short-term glucocorticoid therapy: \u2026We ${BOLD('CONDITIONALLY RECOMMEND')} initial therapy with MTX, MPAA, or AZA, with a low threshold to add or substitute with belimumab or anifrolumab for inadequate response over initial biologic therapy."`;

    // Based on inspect_q32.js, opt 0 seemed to be the explanation target or the correct answer.
    // Let's check for the correct one or update all if it's a guide.
    q.options.forEach(o => {
        if (o.isCorrect || (o.explanation && o.explanation.includes("According to ACR"))) {
            o.explanation = newExplanation;
        }
    });

    q.markModified('options');
    await q.save();

    console.log("Q32 updated successfully.");
    console.log("New explanation:\n" + newExplanation);

    await mongoose.disconnect();
}
run();
