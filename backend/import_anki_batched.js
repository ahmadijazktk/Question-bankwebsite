
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
            await mongoose.connect(process.env.MONGO_URI, {
                serverSelectionTimeoutMS: 120000,
                connectTimeoutMS: 120000,
                socketTimeoutMS: 120000
            });
            connected = true;
            console.log("Connected!");
        } catch (err) {
            console.log("Failed attempt:", err.message);
            if (attempts >= 10) throw err;
            await new Promise(r => setTimeout(r, 5000));
        }
    }

    try {
        console.log("Cleaning old data...");
        await Question.deleteMany({});

        const filePath = path.join(__dirname, '..', 'updatedquestion.txt');
        const content = fs.readFileSync(filePath, 'utf8');
        const lines = content.split('\n');

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
                return html.replace(/src="([^"]+)"/gi, (match, src) => {
                    if (src.includes('/') || src.startsWith('http')) return match;
                    return `src="/images/${src}"`;
                });
            };

            const questionText = processHtml(rawQuestion);
            const answerText = processHtml(rawAnswer);
            const tagArray = rawTags.split(' ').map(t => t.trim()).filter(t => t);

            const isImageOcclusion = /^[a-f0-9-]{20,}/i.test(questionText.replace(/<[^>]+>/g, '').trim());
            const displayQuestion = (isImageOcclusion || questionText.length < 5) ? "Identify the missing clinical information:" : questionText;

            questionsBatch.push({
                text: displayQuestion,
                category: tagArray[0] || 'Uncategorized',
                options: [{
                    text: answerText,
                    explanation: answerText,
                    isCorrect: true
                }],
                tags: tagArray
            });
        }

        console.log(`📥 Inserting ${questionsBatch.length} items...`);
        // Batch insertion to avoid timeout on huge single insert
        const BATCH_SIZE = 50;
        for (let i = 0; i < questionsBatch.length; i += BATCH_SIZE) {
            const batch = questionsBatch.slice(i, i + BATCH_SIZE);
            await Question.insertMany(batch);
            console.log(`Progress: ${i + batch.length}/${questionsBatch.length}`);
        }

        console.log(`✅ Success!`);
    } catch (err) {
        console.error("CRITICAL ERROR:", err);
    } finally {
        await mongoose.disconnect();
    }
}

importAnki();
