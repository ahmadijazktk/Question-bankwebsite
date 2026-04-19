
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const QuestionSchema = new mongoose.Schema({ options: Array }, { strict: false });
const Question = mongoose.models.Question || mongoose.model('Question', QuestionSchema);

async function importAnki() {
    let connected = false;
    let attempts = 0;
    while (!connected && attempts < 10) {
        try {
            attempts++;
            console.log(`Connection attempt ${attempts}...`);
            await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 60000 });
            connected = true;
            console.log("Connected!");
        } catch (err) {
            console.log("Failed attempt:", err.message);
            if (attempts >= 10) throw err;
            await new Promise(r => setTimeout(r, 2000));
        }
    }

    try {
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

            const parts = line.split('\t');
            const rawQuestion = parts[0];
            const rawAnswer = parts[1];
            const nonEmptyParts = parts.filter(p => p.trim().length > 0);
            const rawTags = (nonEmptyParts.length > 2) ? nonEmptyParts[nonEmptyParts.length - 1] : 'AnkiImport';

            if (!rawQuestion || !rawAnswer) continue;

            const processHtml = (html) => {
                if (!html) return '';
                // src="filename.ext" -> src="/images/filename.ext"
                return html.replace(/src="([^"]+)"/gi, (match, src) => {
                    if (src.includes('/') || src.startsWith('http')) return match;
                    return `src="/images/${src}"`;
                });
            };

            const questionText = processHtml(rawQuestion);
            const answerText = processHtml(rawAnswer);
            const tagArray = rawTags.split(' ').map(t => t.trim()).filter(t => t);
            const primaryCategory = tagArray[0] || 'Uncategorized';

            const isImageOcclusion = /^[a-f0-9-]{20,}/i.test(questionText.replace(/<[^>]+>/g, '').trim());
            const displayQuestion = (isImageOcclusion || questionText.length < 5) ? "Identify the missing clinical information:" : questionText;

            questionsBatch.push({
                text: displayQuestion,
                category: primaryCategory,
                options: [{
                    text: answerText,
                    explanation: answerText,
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
    } catch (err) {
        console.error("IMPORT ERROR:", err);
    } finally {
        await mongoose.disconnect();
    }
}

importAnki();
