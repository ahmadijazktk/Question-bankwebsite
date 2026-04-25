
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const Question = mongoose.models.Question || mongoose.model('Question', new mongoose.Schema({}, { strict: false }));

async function checkLeftover() {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        const phrases = [
            "conditionally recommend",
            "CONDITIONALLY REC'D",
            "WEAK Rec'd",
            "STRONG REC'D",
            "STRONGLY REC'D",
            "Strong Recommendation"
        ];

        const allQs = await Question.find({});
        let issues = [];

        allQs.forEach(q => {
            const check = (text, field, qid) => {
                if (!text || typeof text !== 'string') return;
                phrases.forEach(phrase => {
                    const regex = new RegExp(`(?<!style='color: #000; font-weight: 600;'>)${phrase.replace(/[']/g, "\\'")}`, 'i');
                    if (regex.test(text)) {
                        // Check if it's already inside our tag but maybe the regex lookbehind isn't enough in JS
                        if (!text.includes(`<strong style='color: #000; font-weight: 600;'>${phrase.toUpperCase()}`) &&
                            !text.includes(`<strong style='color: #000; font-weight: 600;'>${phrase.toUpperCase().replace("REC'D", "REC'D")}`)) {
                            issues.push({ qid, field, found: phrase, snippet: text.substring(text.indexOf(phrase) - 20, text.indexOf(phrase) + 40) });
                        }
                    }
                });
            };

            // Only check options.explanation and summary
            if (q.summary) check(q.summary, 'summary', q._id);
            if (q.options) {
                q.options.forEach((opt, idx) => {
                    if (opt.explanation) check(opt.explanation, `options[${idx}].explanation`, q._id);
                });
            }
        });

        if (issues.length > 0) {
            console.log(`Found ${issues.length} potentially unformatted occurrences:`);
            console.log(JSON.stringify(issues.slice(0, 5), null, 2));
        } else {
            console.log("No unformatted occurrences found!");
        }
    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.disconnect();
    }
}
checkLeftover();
