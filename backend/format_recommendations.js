
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const QuestionSchema = new mongoose.Schema({}, { strict: false });
const Question = mongoose.models.Question || mongoose.model('Question', QuestionSchema);

async function formatQuestions() {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        // 1. Bolt and Capitalize "CONDITIONALLY RECOMMEND" (case insensitive match)
        // We look for any variation: "conditionally recommend", "Conditionally Recommend", etc.
        const allQuestions = await Question.find({});
        let updateCount = 0;

        for (const q of allQuestions) {
            let changed = false;

            // Function to process strings
            const processStr = (str) => {
                if (!str) return str;
                const regex = /conditionally recommend/gi;
                if (regex.test(str)) {
                    changed = true;
                    return str.replace(regex, "**CONDITIONALLY RECOMMEND**");
                }
                return str;
            };

            // Process text, summary, and options
            if (q.text) q.text = processStr(q.text);
            if (q.summary) q.summary = processStr(q.summary);

            if (q.options && Array.isArray(q.options)) {
                q.options.forEach(opt => {
                    if (opt.text) opt.text = processStr(opt.text);
                    if (opt.explanation) opt.explanation = processStr(opt.explanation);
                });
            }

            if (changed) {
                q.markModified('options'); // Required for nested array updates in Mongoose
                await q.save();
                updateCount++;
            }
        }
        console.log(`Updated ${updateCount} questions with **CONDITIONALLY RECOMMEND** bold/caps.`);

        // 2. Fix Question 30 specifically
        // Based on previous dump, Q30 ID is 69a363b3e212ad97bfa96f62
        const q30 = await Question.findById('69a363b3e212ad97bfa96f62');
        if (q30) {
            console.log("Found Question 30, updating formatting...");

            const target = "Essentially, steroids plus any of the listed steroid sparing agents above. ***MTX is not listed among them***";
            const replacement = "Essentially, steroids plus any of the listed steroid sparing agents above.\n\n***MTX is not listed among them***";

            // Check in explanation of the correct option
            if (q30.options) {
                q30.options.forEach(opt => {
                    if (opt.explanation && opt.explanation.includes(target)) {
                        opt.explanation = opt.explanation.replace(target, replacement);
                        console.log("Updated target line in option explanation.");
                    }
                });
            }

            // Also check in summary just in case
            if (q30.summary && q30.summary.includes(target)) {
                q30.summary = q30.summary.replace(target, replacement);
                console.log("Updated target line in summary.");
            }

            q30.markModified('options');
            await q30.save();
        } else {
            console.log("Question 30 not found by ID. Searching by text...");
            const qSearch = await Question.findOne({ text: /A 28 year old female with SLE has been s/ });
            if (qSearch) {
                // Repeat logic for search result
                const target = "Essentially, steroids plus any of the listed steroid sparing agents above. ***MTX is not listed among them***";
                const replacement = "Essentially, steroids plus any of the listed steroid sparing agents above.\n\n***MTX is not listed among them***";

                if (qSearch.options) {
                    qSearch.options.forEach(opt => {
                        if (opt.explanation && opt.explanation.includes(target)) {
                            opt.explanation = opt.explanation.replace(target, replacement);
                        }
                    });
                }
                qSearch.markModified('options');
                await qSearch.save();
                console.log("Updated found question by text.");
            }
        }

    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.disconnect();
    }
}
formatQuestions();
