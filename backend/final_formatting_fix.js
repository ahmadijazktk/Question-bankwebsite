
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const QuestionSchema = new mongoose.Schema({}, { strict: false });
const Question = mongoose.models.Question || mongoose.model('Question', QuestionSchema);

async function formatQuestionsFinal() {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        // 1. Bolt and Capitalize "CONDITIONALLY RECOMMEND" (using HTML tags for "darker" bold)
        const allQuestions = await Question.find({});
        let updateCount = 0;

        for (const q of allQuestions) {
            let changed = false;

            const processStr = (str) => {
                if (!str) return str;
                // Match any case of conditionally recommend, with or without previous bolding
                const regex = /(\*\*)?conditionally recommend(\*\*)?/gi;
                if (regex.test(str)) {
                    changed = true;
                    // Using <b> tags for stronger emphasis
                    return str.replace(regex, "<b>CONDITIONALLY RECOMMEND</b>");
                }
                return str;
            };

            if (q.text) q.text = processStr(q.text);
            if (q.summary) q.summary = processStr(q.summary);

            if (q.options && Array.isArray(q.options)) {
                q.options.forEach(opt => {
                    if (opt.explanation) opt.explanation = processStr(opt.explanation);
                });
            }

            if (changed) {
                q.markModified('options');
                await q.save();
                updateCount++;
            }
        }
        console.log(`Updated ${updateCount} questions with <b>CONDITIONALLY RECOMMEND</b>.`);

        // 2. Fix Question 30 specifically - Explicit Line Breaks
        // ID: 69a363b3e212ad97bfa96f62
        const q30 = await Question.findById('69a363b3e212ad97bfa96f62');
        if (q30) {
            console.log("Found Question 30, updating with <br /> tags...");

            // The segment that needs to be moved to a new line
            const segmentText = "Essentially, steroids plus any of the listed steroid sparing agents above.";
            const subSegmentText = "***MTX is not listed among them***";

            if (q30.options) {
                q30.options.forEach(opt => {
                    if (opt.explanation && opt.explanation.includes(segmentText)) {
                        // Insert TWO line breaks before "Essentially"
                        // And TWO line breaks before "MTX"

                        // Clean up any existing \n we added
                        let cleanExpl = opt.explanation.replace(/\n\nEssentially/g, "Essentially");

                        if (cleanExpl.includes(segmentText)) {
                            const replacement = `<br /><br /><b>Essentially, steroids plus any of the listed steroid sparing agents above.</b><br /><br /><b>***MTX is not listed among them***</b>`;
                            const targetFull = segmentText + (cleanExpl.includes("\n\n" + subSegmentText) ? "\n\n" + subSegmentText : ". " + subSegmentText);

                            // More robust match: find the start of 'Essentially' and replacement from there
                            const index = cleanExpl.indexOf(segmentText);
                            if (index !== -1) {
                                // We replace from the index to the end of the MTX line
                                const rest = cleanExpl.substring(index);
                                // Find where MTX line ends (usually end of string or next punctuation)
                                const mtxIndex = rest.indexOf(subSegmentText);
                                if (mtxIndex !== -1) {
                                    const toReplace = rest.substring(0, mtxIndex + subSegmentText.length);
                                    opt.explanation = cleanExpl.replace(toReplace, replacement);
                                }
                            }
                        }
                    }
                });
            }

            q30.markModified('options');
            await q30.save();
            console.log("Question 30 separate lines applied.");
        }

    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.disconnect();
    }
}
formatQuestionsFinal();
