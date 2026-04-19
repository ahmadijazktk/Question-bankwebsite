
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const QuestionSchema = new mongoose.Schema({ options: Array }, { strict: false });
const Question = mongoose.models.Question || mongoose.model('Question', QuestionSchema);

const BOLD = (text) => `<strong style='color:#000;font-weight:900;'>${text}</strong>`;

async function run() {
    try {
        console.log("Connecting to DB...");
        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 60000,
            connectTimeoutMS: 60000
        });

        console.log("Searching for Vasculitis SLE question...");
        const q = await Question.findOne({ text: /35 year old woman.*vasculitis/i });

        if (!q) {
            // Try by just the start of the text
            console.log("Attempt 2: Search by start string...");
            const q2 = await Question.findOne({ text: /A 35 year old woman with 5 year history of SLE/i });
            if (q2) {
                await update(q2);
            } else {
                console.log("Question not found.");
            }
        } else {
            await update(q);
        }

    } catch (err) {
        console.error("FAIL:", err.message);
    } finally {
        await mongoose.disconnect();
    }
}

async function update(q) {
    console.log(`Updating Question: ${q._id}`);

    const newExpl = `According to ACR For vasculitis attributed to active SLE: <br />` +
        `\u2026We ${BOLD('CONDITIONALLY RECOMMEND')} initial therapy with pulse/high-dose glucocorticoid taper and conventional (IV CYC, MPAA, AZA) or biologic (anti-CD 20 therapy, belimumab, anifrolumab) immunosuppressive therapy over glucocorticoid monotherapy alone; <br />` +
        `\u2026We ${BOLD('CONDITIONALLY RECOMMEND')} IV CYC or anti-CD20 therapy as initial therapy over other immunosuppressive therapies.`;

    let updated = false;
    q.options.forEach(o => {
        if (o.isCorrect) {
            o.explanation = newExpl;
            updated = true;
        }
    });

    if (updated) {
        q.markModified('options');
        await q.save();
        console.log("Restore Success!");
    } else {
        console.log("No correct option found to update.");
    }
}

run();
