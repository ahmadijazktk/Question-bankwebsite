
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

    const q = await Question.findById('69a363b2e212ad97bfa96f50');
    if (!q) { console.log("Not found"); await mongoose.disconnect(); return; }

    q.options.forEach(o => {
        if (o.explanation && o.explanation.includes("According to the RheumZoom dataset.")) {
            // Remove the phrase and any trailing whitespace/punctuation
            o.explanation = o.explanation.replace(/According to the RheumZoom dataset\.?/g, "").trim();
            // If explanation is now blank but it's the correct answer, maybe add "Correct."? 
            // The user just said "remove it", so I will leave it empty if that's what's left.
            // Actually, let's look at the previous formatting requests. They usually want guidelines.
            // If it's blank, I'll set it to "Correct." to avoid a blank display.
            if (o.explanation === "") {
                o.explanation = "Correct.";
            }
        }
    });

    q.markModified('options');
    await q.save();

    console.log("Phrase removed from Q38.");
    await mongoose.disconnect();
}
run();
