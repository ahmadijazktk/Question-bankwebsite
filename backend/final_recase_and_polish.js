
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const QuestionSchema = new mongoose.Schema({}, { strict: false });
const Question = mongoose.models.Question || mongoose.model('Question', QuestionSchema);

async function runFix() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ Connected to MongoDB");

        const phrases = [
            /conditionally recommend(ed|s|ing)?/i,
            /CONDITIONALLY REC['’]D/i,
            /WEAK(LY)? REC['’]D/i,
            /STRONGLY REC['’]D/i,
            /STRONG REC['’]D/i,
            /Strong Recommendation(s)?/i
        ];

        const allQs = await Question.find({});
        let updateCount = 0;

        for (const q of allQs) {
            let changed = false;

            const formatField = (text) => {
                if (!text || typeof text !== 'string') return text;
                let result = text;

                phrases.forEach(regexPattern => {
                    // Match the phrase and any surrounding bold/strong/span/asterisk formatting
                    const clinicalRegex = new RegExp(`(<strong[^>]*>|<b>|\\*\\*)*${regexPattern.source}(<\\/strong>|<\\/b>|\\*\\*)*`, 'gi');

                    if (clinicalRegex.test(result)) {
                        result = result.replace(clinicalRegex, (match) => {
                            // Strip tags from the match to get the raw text
                            let raw = match.replace(/<[^>]+>/g, '').replace(/\*\*/g, '').trim();
                            // Convert entire phrase to uppercase as requested
                            return `<strong style='color: #000; font-weight: 600;'>${raw.toUpperCase()}</strong>`;
                        });
                        changed = true;
                    }
                });

                // Final cleanup of any potential leftover double strongs
                result = result.replace(/<strong[^>]*>\s*<strong[^>]*>(.*?)<\/strong>\s*<\/strong>/gi, (match, content) => {
                    return `<strong style='color: #000; font-weight: 600;'>${content}</strong>`;
                });

                return result;
            };

            if (q.summary) {
                const ns = formatField(q.summary);
                if (ns !== q.summary) { q.summary = ns; changed = true; }
            }

            if (q.options) {
                q.options.forEach(opt => {
                    if (opt.text) {
                        const nt = formatField(opt.text);
                        if (nt !== opt.text) { opt.text = nt; changed = true; }
                    }
                    if (opt.explanation) {
                        const ne = formatField(opt.explanation);
                        if (ne !== opt.explanation) { opt.explanation = ne; changed = true; }
                    }
                });
            }

            if (changed) {
                q.markModified('options');
                q.markModified('summary');
                await q.save();
                updateCount++;
            }
        }

        console.log(`✅ Successfully updated ${updateCount} questions.`);

    } catch (err) {
        console.error("❌ Error:", err);
    } finally {
        await mongoose.disconnect();
    }
}

runFix();
