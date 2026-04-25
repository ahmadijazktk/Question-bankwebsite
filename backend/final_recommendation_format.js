
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
        if (!process.env.MONGO_URI) {
            console.error("❌ MONGO_URI missing from .env!");
            return;
        }
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ Connected to MongoDB");

        const phrases = [
            "conditionally recommend",
            "CONDITIONALLY REC'D",
            "WEAK Rec'd",
            "STRONG REC'D",
            "STRONGLY REC'D",
            "Strong Recommendation"
        ];

        // Map phrases to their uppercase versions for the replacement text
        const phraseMap = {
            "conditionally recommend": "CONDITIONALLY RECOMMEND",
            "CONDITIONALLY REC'D": "CONDITIONALLY REC'D",
            "WEAK Rec'd": "WEAK REC'D",
            "STRONG REC'D": "STRONG REC'D",
            "STRONGLY REC'D": "STRONGLY REC'D",
            "Strong Recommendation": "STRONG RECOMMENDATION"
        };

        const allQs = await Question.find({});
        let count = 0;

        for (const q of allQs) {
            let changed = false;

            const formatText = (text) => {
                if (!text || typeof text !== 'string') return text;
                let newText = text;

                phrases.forEach(phrase => {
                    const uppercasePhrase = phraseMap[phrase];
                    const replacement = `<strong style='color: #000; font-weight: 600;'>${uppercasePhrase}</strong>`;

                    // Regex to find the phrase case-insensitively
                    // We also want to avoid double-wrapping if it's already wrapped in our specific tag
                    // But to be safe and thorough, we'll first strip our specific tag pattern if it exists for these phrases
                    // Or just replace any existing bold/span variations of these phrases.

                    // Improved regex: find the phrase, possibly surrounded by bold tags or our custom span/strong
                    // We'll catch: <b>phrase</b>, <strong>phrase</strong>, **phrase**, or just phrase
                    const regex = new RegExp(`(?:<strong[^>]*>|<b>|\\*\\*|<span>)?${phrase.replace(/[']/g, "\\'")}(?:<\\/strong>|<\\/b>|\\*\\*|<\\/span>)?`, 'gi');

                    if (regex.test(newText)) {
                        newText = newText.replace(regex, replacement);
                        changed = true;
                    }
                });
                return newText;
            };

            // USER: "go through all the answer not question only answer"
            // Usually answers are in options.explanation and summary.
            // We leave q.text (the question) alone as requested.

            if (q.summary) {
                const updatedSummary = formatText(q.summary);
                if (updatedSummary !== q.summary) {
                    q.summary = updatedSummary;
                    changed = true;
                }
            }

            if (q.options && Array.isArray(q.options)) {
                q.options.forEach(opt => {
                    if (opt.explanation) {
                        const updatedExpl = formatText(opt.explanation);
                        if (updatedExpl !== opt.explanation) {
                            opt.explanation = updatedExpl;
                            changed = true;
                        }
                    }
                });
            }

            if (changed) {
                q.markModified('options');
                q.markModified('summary');
                await q.save();
                count++;
            }
        }

        console.log(`✅ Successfully updated ${count} questions with the new recommendation formatting.`);

    } catch (err) {
        console.error("❌ Error:", err);
    } finally {
        await mongoose.disconnect();
        console.log("👋 Disconnected.");
    }
}

applyFormatting();
