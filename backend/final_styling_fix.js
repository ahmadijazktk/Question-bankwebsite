
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const QuestionSchema = new mongoose.Schema({}, { strict: false });
const Question = mongoose.models.Question || mongoose.model('Question', QuestionSchema);

async function finalFormatting() {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        // 1. Process all questions to make "CONDITIONALLY RECOMMEND" bold and dark using <strong>
        const allQuestions = await Question.find({});
        for (const q of allQuestions) {
            let changed = false;

            const makeBold = (str) => {
                if (!str) return str;
                // Match "CONDITIONALLY RECOMMEND" with potential previous tags
                const regex = /(<b>|<\/b>|\*\*|<strong>|<\/strong>)?conditionally recommend(<b>|<\/b>|\*\*|<strong>|<\/strong>)?/gi;
                if (regex.test(str)) {
                    changed = true;
                    // Using <strong> and custom style for "dark bold"
                    return str.replace(regex, "<strong style='color: #000; font-weight: 900;'>CONDITIONALLY RECOMMEND</strong>");
                }
                return str;
            };

            if (q.text) q.text = makeBold(q.text);
            if (q.summary) q.summary = makeBold(q.summary);
            if (q.options) {
                q.options.forEach(opt => {
                    if (opt.explanation) opt.explanation = makeBold(opt.explanation);
                });
            }

            if (changed) {
                q.markModified('options');
                await q.save();
            }
        }
        console.log("Global formatting for recommendations applied.");

        // 2. Fix Question 30 specific formatting
        // Target text: "... . Essentially, steroids plus any of the listed steroid sparing agents above. ***MTX is not listed among them***"
        const q30 = await Question.findById('69a363b3e212ad97bfa96f62');
        if (q30 && q30.options) {
            q30.options.forEach(opt => {
                if (opt.explanation) {
                    const segmentText = "Essentially, steroids plus any of the listed steroid sparing agents above.";
                    const mtxLine = "***MTX is not listed among them***";

                    if (opt.explanation.includes(segmentText)) {
                        // We want "Essentially" on its own line and "MTX" on its own line
                        const replacement = `<br /><br /><strong style='color: #000; font-weight: 900;'>${segmentText}</strong><br /><br /><strong style='color: #000; font-weight: 900;'>${mtxLine}</strong>`;

                        // Regex to catch both the original and our previous attempt
                        const targetRegex = /Essentially, steroids.*?among them\**\*/s;
                        opt.explanation = opt.explanation.replace(targetRegex, replacement);
                        console.log("Q30 specific breaking lines applied with dark bold.");
                    }
                }
            });
            q30.markModified('options');
            await q30.save();
        }

    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.disconnect();
    }
}
finalFormatting();
