
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
            await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 60000 });
            connected = true;
        } catch (err) {
            await new Promise(r => setTimeout(r, 2000));
        }
    }

    try {
        console.log("Wiping and Re-importing with PERFECT formatting...");
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

            const processHtml = (html) => {
                if (!html) return '';
                let cleaned = html.replace(/src="([^"]+)"/gi, (match, src) => {
                    if (src.includes('/') || src.startsWith('http')) return match;
                    return `src="/${src}"`;
                });

                // Remove surrounding quotes if they exist
                cleaned = cleaned.replace(/^"|"$/g, '').trim();

                // REQ: Make RECOMMENDations uppercase and bold
                // Handle "conditionally recommend", "strongly recommend", etc.
                cleaned = cleaned.replace(/(conditionally|strongly)\s*recomm(e|n)nd(ed)?/gi, (match) => {
                    return `<strong style="color:#000;font-weight:900;">${match.toUpperCase()}</strong>`;
                });

                return cleaned;
            };

            const qText = processHtml(rawQuestion);
            const aText = processHtml(rawAnswer);

            const nonEmptyParts = parts.filter(p => p.trim().length > 0);
            const rawTags = (nonEmptyParts.length > 2) ? nonEmptyParts[nonEmptyParts.length - 1] : 'AnkiImport';
            const categories = rawTags.split(' ').map(t => t.trim()).filter(t => t);

            const textOnly = qText.replace(/<[^>]+>/g, '').trim();
            const isIO = textOnly.length > 20 && /^[a-f0-9-]+$/.test(textOnly);
            const finalQText = isIO ? "<b>Image Occlusion:</b> Identify the labeled structure." : qText;

            questionsBatch.push({
                text: finalQText,
                category: categories[0] || 'Uncategorized',
                options: [{
                    text: aText,
                    explanation: '', // Leave explanation empty to avoid duplication on frontend
                    isCorrect: true
                }],
                tags: categories,
                createdAt: new Date()
            });
        }

        const BATCH_SIZE = 50;
        for (let i = 0; i < questionsBatch.length; i += BATCH_SIZE) {
            await Question.insertMany(questionsBatch.slice(i, i + BATCH_SIZE));
            console.log(`Progress: ${Math.min(i + BATCH_SIZE, questionsBatch.length)}/${questionsBatch.length}`);
        }

        console.log("✅ Re-import finished successfully!");
    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.disconnect();
    }
}
run();
