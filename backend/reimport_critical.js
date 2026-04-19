
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

async function run() {
    let connected = false;
    let attempts = 0;
    while (!connected && attempts < 10) {
        try {
            attempts++;
            console.log(`Connection attempt ${attempts}...`);
            await mongoose.connect(process.env.MONGO_URI, {
                serverSelectionTimeoutMS: 120000,
                connectTimeoutMS: 120000
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
        console.log("PURGING DATABASE...");
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

            if (!rawQuestion || !rawAnswer) continue;

            const processAnkiHtml = (html) => {
                if (!html) return '';
                // Rule 6: All images load from /collection.media/
                return html.replace(/src="([^"]+)"/gi, (match, src) => {
                    if (src.startsWith('/') || src.startsWith('http')) return match;
                    return `src="/collection.media/${src}"`;
                });
            };

            const qText = processAnkiHtml(rawQuestion);
            const aText = processAnkiHtml(rawAnswer);

            const nonEmptyParts = parts.filter(p => p.trim().length > 0);
            const rawTags = (nonEmptyParts.length > 2) ? nonEmptyParts[nonEmptyParts.length - 1] : 'AnkiImport';
            const categories = rawTags.split(' ').map(t => t.trim()).filter(t => t);

            const textOnly = qText.replace(/<[^>]+>/g, '').trim();
            const isIO = textOnly.length > 20 && /^[a-f0-9-]+$/.test(textOnly);
            const finalQText = isIO ? "<b>Identify the structure indicated in the figure:</b>" : qText;

            questionsBatch.push({
                text: finalQText,
                category: categories[0] || 'Uncategorized',
                options: [{
                    text: aText,
                    explanation: '', // Keeping empty to prevent duplication since text holds the answer
                    isCorrect: true
                }],
                tags: categories,
                createdAt: new Date()
            });
        }

        console.log(`📥 Inserting ${questionsBatch.length} items with /collection.media/ mapping...`);
        const BATCH_SIZE = 50;
        for (let i = 0; i < questionsBatch.length; i += BATCH_SIZE) {
            await Question.insertMany(questionsBatch.slice(i, i + BATCH_SIZE));
            console.log(`Progress: ${Math.min(i + BATCH_SIZE, questionsBatch.length)}/${questionsBatch.length}`);
        }

        console.log("✅ CRITICAL IMPORT FINISHED.");
    } catch (err) {
        console.error("FATAL:", err);
    } finally {
        await mongoose.disconnect();
    }
}
run();
