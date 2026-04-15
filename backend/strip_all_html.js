
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const QuestionSchema = new mongoose.Schema({}, { strict: false });
const Question = mongoose.models.Question || mongoose.model('Question', QuestionSchema);

// Strip ALL HTML tags from a string
function stripHtml(str) {
    if (!str) return str;
    return str
        // Remove any HTML tags
        .replace(/<[^>]+>/g, '')
        // Also clean up double spaces that might remain
        .replace(/  +/g, ' ')
        .trim();
}

// Normalize line breaks: any existing <br> tags or \n should become proper \n
function cleanLineBreaks(str) {
    if (!str) return str;
    return str
        // Convert <br />, <br/>, <br> to newline
        .replace(/<br\s*\/?>/gi, '\n')
        // Strip remaining tags
        .replace(/<[^>]+>/g, '')
        .trim();
}

async function run() {
    await mongoose.connect(process.env.MONGO_URI);
    const allQs = await Question.find({});
    let updateCount = 0;

    for (const q of allQs) {
        let changed = false;

        const process = (str) => {
            if (!str) return str;
            // If string contains any HTML tags, clean them
            if (/<[^>]+>/.test(str)) {
                changed = true;
                return cleanLineBreaks(str);
            }
            return str;
        };

        if (q.text) q.text = process(q.text);
        if (q.summary) q.summary = process(q.summary);
        if (q.options) {
            q.options.forEach(opt => {
                if (opt.text) opt.text = process(opt.text);
                if (opt.explanation) opt.explanation = process(opt.explanation);
            });
        }

        if (changed) {
            q.markModified('options');
            await q.save();
            updateCount++;
        }
    }

    console.log(`Stripped HTML tags from ${updateCount} questions.`);
    console.log("All text now uses plain \\n newlines — works with whitespace-pre-wrap in current deployed build.");
    await mongoose.disconnect();
}
run();
