
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const QuestionSchema = new mongoose.Schema({}, { strict: false });
const Question = mongoose.models.Question || mongoose.model('Question', QuestionSchema);

async function applyFormatting() {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        // 1. Dark Bold for CONDITIONALLY RECOMMEND
        // We'll use a span with heavy style and black color
        const darkBoldHtml = "<strong style='color: #000; font-weight: 900; display: inline-block; transform: scaleX(1.1);'>CONDITIONALLY RECOMMEND</strong>";

        const allQs = await Question.find({});
        let count = 0;

        for (const q of allQs) {
            let changed = false;

            const updateField = (str) => {
                if (!str) return str;
                const regex = /(<b>|<\/b>|<strong>|<\/strong>|\*\*|CONDITIONALLY RECOMMEND)/gi;
                // Replace any existing markup or plain text version
                if (/conditionally recommend/i.test(str)) {
                    changed = true;
                    // First strip any existing bold tags around it if we can, or just replace the whole mess
                    return str.replace(/(?:<[^>]+>)?conditionally recommend(?:<\/[^>]+>)?/gi, darkBoldHtml);
                }
                return str;
            };

            q.text = updateField(q.text);
            q.summary = updateField(q.summary);
            if (q.options) {
                q.options.forEach(opt => {
                    opt.explanation = updateField(opt.explanation);
                });
            }

            // 2. Specific multi-line fix for "Essentially" and "MTX"
            if (q.options) {
                q.options.forEach(opt => {
                    if (opt.explanation && opt.explanation.includes("Essentially, steroids")) {
                        changed = true;

                        // Break down:
                        // Step 1: Ensure it's not already broken
                        // Step 2: Add <br> before "Essentially"
                        // Step 3: Add <br> before "***MTX"

                        let expl = opt.explanation;

                        const target1 = "Essentially, steroids plus any of the listed steroid sparing agents above.";
                        const target2 = "***MTX is not listed among them***";

                        // Replace the whole block
                        const regex = /Essentially, steroids.*?MTX is not listed among them\**\*/is;
                        const replacement = `<br /><br /><b>Essentially, steroids plus any of the listed steroid sparing agents above.</b><br /><br /><b>***MTX is not listed among them***</b>`;

                        if (regex.test(expl)) {
                            expl = expl.replace(regex, replacement);
                        } else if (expl.includes(target1)) {
                            // Fallback if regex is too strict
                            expl = expl.replace(target1, `<br /><br /><b>${target1}</b>`);
                            if (expl.includes(target2)) {
                                expl = expl.replace(target2, `<br /><br /><b>${target2}</b>`);
                            }
                        }

                        opt.explanation = expl;
                    }
                });
            }

            if (changed) {
                q.markModified('options');
                await q.save();
                count++;
            }
        }

        console.log(`Updated ${count} questions with dark bold and multi-line formatting.`);

    } catch (err) {
        console.error("Error:", err);
    } finally {
        await mongoose.disconnect();
    }
}
applyFormatting();
