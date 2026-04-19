
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const QuestionSchema = new mongoose.Schema({
    text: String,
    category: String,
    options: [{
        text: String,
        explanation: String,
        isCorrect: Boolean
    }],
    tags: [String],
    image: String, // Supporting image field
    createdAt: { type: Date, default: Date.now }
}, { strict: false });

const Question = mongoose.models.Question || mongoose.model('Question', QuestionSchema);

async function importAnki() {
    try {
        console.log("🚀 Starting Purge and Re-import...");
        await mongoose.connect(process.env.MONGO_URI);

        await Question.deleteMany({});
        console.log("Deleted old questions.");

        const filePath = path.join(__dirname, '..', 'updatedquestion.txt');
        const content = fs.readFileSync(filePath, 'utf8');
        const lines = content.split('\n');

        let importedCount = 0;
        const questionsBatch = [];

        for (let line of lines) {
            line = line.trim();
            if (!line || line.startsWith('#')) continue;

            // Split by tab but be careful with extra tabs
            const parts = line.split('\t');
            // Anki usually has many columns. 0: Front, 1: Back, ...
            // Based on user: Format is question \t answer \t tags
            // But from preview, tag is often further right

            const rawQuestion = parts[0];
            const rawAnswer = parts[1];
            // Find tags (usually the last non-empty part or column 12)
            const nonEmptyParts = parts.filter(p => p.trim().length > 0);
            const rawTags = (nonEmptyParts.length > 2) ? nonEmptyParts[nonEmptyParts.length - 1] : 'AnkiImport';

            if (!rawQuestion || !rawAnswer) continue;

            const processHtml = (html) => {
                if (!html) return '';
                // rule 6: All images must load from /collection.media/
                // rule 1: Do not escape or modify except as required by rule 6
                let normalized = html.replace(/src="([^"]+)"/gi, (match, src) => {
                    if (src.includes('/') && !src.startsWith('/images/')) return match;
                    const base = src.split('/').pop() || src;
                    return `src="/collection.media/${base}"`;
                });
                return normalized;
            };

            const questionText = processHtml(rawQuestion);
            const answerText = processHtml(rawAnswer);
            const tagArray = rawTags.split(' ').map(t => t.trim()).filter(t => t);
            const primaryCategory = tagArray[0] || 'Uncategorized';

            // Detect Image Occlusion Questions (ID instead of text)
            // They usually look like a long hex string
            const isImageOcclusion = /^[a-f0-9-]{20,}/i.test(questionText);
            const displayQuestion = isImageOcclusion ? "What is the missing part in this figure?" : questionText;

            questionsBatch.push({
                text: displayQuestion,
                category: primaryCategory,
                options: [{
                    text: answerText, // This will be the "Green Answer"
                    explanation: answerText, // ALSO set as explanation so it shows in the details box
                    isCorrect: true
                }],
                tags: tagArray,
                createdAt: new Date()
            });

            importedCount++;
        }

        if (questionsBatch.length > 0) {
            console.log(`📥 Re-inserting ${questionsBatch.length} questions...`);
            await Question.insertMany(questionsBatch);
        }

        console.log(`✅ Successfully re-imported ${importedCount} questions.`);
        await mongoose.disconnect();
    } catch (err) {
        console.error("❌ Import failed:", err);
    }
}

importAnki();
