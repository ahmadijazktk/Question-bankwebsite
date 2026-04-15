
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const QuestionSchema = new mongoose.Schema({}, { strict: false });
const Question = mongoose.models.Question || mongoose.model('Question', QuestionSchema);

async function finalFix() {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        // 1. Correct "CONDITIONALLY RECOMMEND" to be dark bold as requested
        const darkBoldRes = await Question.updateMany(
            {},
            {
                // We apply a broad transformation
            }
        );

        const all = await Question.find({});
        for (const q of all) {
            let changed = false;

            // Function to wrap in very bold HTML
            const toDarkBold = (str) => {
                if (!str) return str;
                // Match anything like CONDITIONALLY RECOMMEND or conditionally recommend
                const regex = /(<[^>]*>)?\s*CONDITIONALLY RECOMMEND\s*(<[^>]*>)?/gi;
                if (regex.test(str)) {
                    changed = true;
                    return str.replace(regex, " <strong style='color: black; font-weight: 900; background-color: rgba(255,255,0,0.1); border-radius: 2px; padding: 0 2px;'>CONDITIONALLY RECOMMEND</strong> ");
                }
                return str;
            };

            if (q.text) q.text = toDarkBold(q.text);
            if (q.summary) q.summary = toDarkBold(q.summary);
            if (q.options) {
                q.options.forEach(opt => {
                    if (opt.explanation) opt.explanation = toDarkBold(opt.explanation);
                });
            }

            // 2. Fix the "Essentially" spacing in ALL questions that have it
            if (q.options) {
                q.options.forEach(opt => {
                    if (opt.explanation && opt.explanation.includes("Essentially, steroids")) {
                        changed = true;
                        // Clean up any weird concatenation
                        const targetRegex = /\.[\s\n]*Essentially, steroids.*?(listed among them\**\*)/s;
                        const replacement = `.<br /><br /><strong style='color: black; font-weight: 900;'>Essentially, steroids plus any of the listed steroid sparing agents above.</strong><br /><br /><strong style='color: black; font-weight: 900;'>***MTX is not listed among them***</strong>`;
                        opt.explanation = opt.explanation.replace(targetRegex, replacement);
                    }
                });
            }

            if (changed) {
                q.markModified('options');
                await q.save();
            }
        }
        console.log("Applied dark bold and line breaks to all matching questions.");

    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.disconnect();
    }
}
finalFix();
