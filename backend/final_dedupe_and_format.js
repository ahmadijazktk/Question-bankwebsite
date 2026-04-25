
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
            { search: /conditionally recommend(ed|s|ing)?/i, replace: "CONDITIONALLY RECOMMEND", suffix: "$1" },
            { search: /CONDITIONALLY REC['’]D/i, replace: "CONDITIONALLY REC'D" },
            { search: /WEAK(LY)? REC['’]D/i, replace: "WEAK REC'D" },
            { search: /STRONGLY REC['’]D/i, replace: "STRONGLY REC'D" },
            { search: /STRONG REC['’]D/i, replace: "STRONG REC'D" },
            { search: /Strong Recommendation(s)?/i, replace: "STRONG RECOMMENDATION", suffix: "$1" }
        ];

        const allQs = await Question.find({});
        let updateCount = 0;

        for (const q of allQs) {
            let changed = false;

            const formatField = (text) => {
                if (!text || typeof text !== 'string') return text;
                let result = text;

                phrases.forEach(p => {
                    // 1. Identify the phrase and any surrounding bold/strong/span/asterisk formatting
                    // We'll catch multiple levels of nesting by using a broad regex
                    // Specifically looking for the phrase surrounded by any combination of:
                    // <strong>, <b>, <span>, **, \", '
                    // We want to replace the whole "formatted block" with our clean version.

                    // This regex finds the phrase possibly wrapped in multiple layers of bold/strong tags or asterisks
                    const regex = new RegExp(`(?:<strong[^>]*>|<b>|\\*\\*|<span>|\\s|")*${p.search.source}(?:<\\/strong>|<\\/b>|\\*\\*|<\\/span>|\\s|")*`, 'gi');

                    // However, we must be careful not to consume adjacent words. 
                    // Better approach: 
                    // 1. Find all occurrences of the phrase (case insensitive).
                    // 2. For each occurrence, look outwards to see if it's wrapped in strong/b/** tags.

                    // Simple but effective: Replace any existing formatted clinical phrase with our standard
                    // We include the possible suffixes (ed/s/ing)
                    const standardReplacement = `<strong style='color: #000; font-weight: 600;'>${p.replace}${p.suffix || ''}</strong>`;

                    // Catch cases like **<strong>STRONG REC'D</strong>** or <strong><strong>...</strong></strong>
                    // We'll strip the leading/trailing tags if they match specifically for these phrases
                    const clinicalRegex = new RegExp(`(<strong[^>]*>|<b>|\\*\\*)*${p.search.source}(<\\/strong>|<\\/b>|\\*\\*)*`, 'gi');

                    if (clinicalRegex.test(result)) {
                        result = result.replace(clinicalRegex, (match, p1, p2, offset, string) => {
                            // Extract the actual suffix if captured
                            const subMatch = match.match(p.search);
                            const actualSuffix = (subMatch && subMatch[1]) ? subMatch[1].toUpperCase() : '';
                            return `<strong style='color: #000; font-weight: 600;'>${p.replace}${actualSuffix}</strong>`;
                        });
                        changed = true;
                    }
                });

                // Cleanup: replace double strong tags if any were missed or created
                result = result.replace(/<strong[^>]*>\s*<strong[^>]*>(.*?)<\/strong>\s*<\/strong>/gi, (match, content) => {
                    return `<strong style='color: #000; font-weight: 600;'>${content}</strong>`;
                });

                return result;
            };

            // Process Summary
            if (q.summary) {
                const newSummary = formatField(q.summary);
                if (newSummary !== q.summary) {
                    q.summary = newSummary;
                    changed = true;
                }
            }

            // Process Options (Text and Explanation)
            if (q.options && Array.isArray(q.options)) {
                q.options.forEach(opt => {
                    if (opt.text) {
                        const newText = formatField(opt.text);
                        if (newText !== opt.text) {
                            opt.text = newText;
                            changed = true;
                        }
                    }
                    if (opt.explanation) {
                        const newExpl = formatField(opt.explanation);
                        if (newExpl !== opt.explanation) {
                            opt.explanation = newExpl;
                            changed = true;
                        }
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

        console.log(`✅ Successfully cleaned up and formatted ${updateCount} questions.`);

    } catch (err) {
        console.error("❌ Error:", err);
    } finally {
        await mongoose.disconnect();
    }
}

runFix();
