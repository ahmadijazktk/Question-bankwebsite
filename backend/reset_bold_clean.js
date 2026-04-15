
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const QuestionSchema = new mongoose.Schema({}, { strict: false });
const Question = mongoose.models.Question || mongoose.model('Question', QuestionSchema);

// Strip ALL existing formatting tags around CONDITIONALLY RECOMMEND
// and re-apply a single clean <strong> tag
function cleanAndBold(str) {
    if (!str) return str;

    // Step 1: Remove any existing HTML tags wrapping the phrase (messy results from previous runs)
    // This regex matches any opening tag(s) before + "CONDITIONALLY RECOMMEND" + any closing tag(s) after
    const taggedPhrase = /(?:<[^>]+>\s*)*CONDITIONALLY RECOMMEND(?:\s*<\/[^>]+>)*/gi;
    const cleaned = str.replace(taggedPhrase, 'CONDITIONALLY RECOMMEND');

    // Step 2: Also strip **CONDITIONALLY RECOMMEND** markdown style
    const mdPhrase = /\*\*CONDITIONALLY RECOMMEND\*\*/gi;
    const cleaned2 = cleaned.replace(mdPhrase, 'CONDITIONALLY RECOMMEND');

    // Step 3: Now apply a single clean bold tag
    const bolded = cleaned2.replace(/CONDITIONALLY RECOMMEND/gi,
        '<strong>CONDITIONALLY RECOMMEND</strong>');

    return bolded;
}

async function run() {
    await mongoose.connect(process.env.MONGO_URI);
    const allQs = await Question.find({});
    let updateCount = 0;

    for (const q of allQs) {
        let changed = false;

        const process = (str) => {
            if (!str) return str;
            // Check if it needs any work (contains the phrase in any form)
            if (/CONDITIONALLY RECOMMEND/i.test(str)) {
                const result = cleanAndBold(str);
                if (result !== str) { changed = true; return result; }
            }
            return str;
        };

        q.text = process(q.text);
        q.summary = process(q.summary);
        if (q.options) {
            q.options.forEach(opt => {
                opt.explanation = process(opt.explanation);
            });
        }

        if (changed) {
            q.markModified('options');
            await q.save();
            updateCount++;
        }
    }

    console.log(`Cleaned and re-applied bold to ${updateCount} questions.`);
    await mongoose.disconnect();
}
run();
